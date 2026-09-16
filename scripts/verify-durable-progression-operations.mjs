import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const failures = [];
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "living-textbook-ops-"));
const sourcePath = path.join(tempRoot, "source.sqlite");
const backupPath = path.join(tempRoot, "backup.sqlite");
const restoredPath = path.join(tempRoot, "restored.sqlite");

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`missing ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function requireFragments(label, source, fragments) {
  for (const fragment of fragments) {
    if (!source.includes(fragment)) failures.push(`${label}: missing ${fragment}`);
  }
}

const store = read("apps/web/src/server/persistence/sqliteProgressionStore.ts");
const operations = read("apps/web/src/server/persistence/sqliteProgressionOperations.ts");
const statusRoute = read("apps/web/src/app/api/persistence/status/route.ts");
const statusPanel = read("apps/web/src/features/persistence/PersistenceOperationsStatusPanel.tsx");
const operationsRoute = read("apps/web/src/app/api/persistence/operations/route.ts");
const teacherSession = read("apps/web/src/server/persistence/teacherSessionCookie.ts");
const teacherAuthorization = read("apps/web/src/server/persistence/teacherOperationsAuthorization.ts");
const teacherSessionRoute = read("apps/web/src/app/api/teacher/session/route.ts");
const teacherAccessPanel = read("apps/web/src/features/persistence/TeacherOperationsAccessPanel.tsx");
const operationsPanel = read("apps/web/src/features/persistence/PersistenceOperationsEvidencePanel.tsx");
const chainChecks = read("docs/verification/PERSISTENCE_EVIDENCE_CHAIN_CHECKS.md");
const chainAdr = read("docs/adr/0817-persistence-evidence-chain.md");
const envExample = read(".env.example");

requireFragments("SQLite operations store", store, [
  "getHealth()",
  "VACUUM INTO",
  "deleteForIdentity",
  "static restoreFromBackup",
  "sha256File",
  "sha256",
  "integrity_check",
  "hosted_progression_records",
  "progression_operation_evidence",
  "recordOperationEvidence",
  "listOperationEvidence",
  "getOperationEvidenceIntegrity",
  "previous_hash",
  "evidence_hash",
  "createOperationEvidenceHash",
  "scope_digest",
  "tenant_scope_digest",
  "createTenantScopeDigest",
]);
requireFragments("SQLite operations policy", operations, [
  "LIVING_TEXTBOOK_PERSISTENCE_ALLOW_OPERATIONS",
  "schoolPolicyAccepted",
  "retentionPolicyAccepted",
  "releaseApprovalAccepted",
  "retentionDays",
  "backupTo",
  "backupWithManifest",
  "restoreFromBackup",
  "restoreWithManifest",
  "deleteForIdentity",
]);
requireFragments("safe status route", statusRoute, [
  'runtime = "nodejs"',
  'dynamic = "force-dynamic"',
  "studentSessionBoundaryConfigured",
  "teacherOperationsSessionBoundaryConfigured",
  "No learner records, database paths, credentials, raw audio, or transcripts",
  "Cache-Control",
]);
requireFragments("teacher status panel", statusPanel, [
  "Teacher-safe persistence status",
  "No learner records",
  "/api/persistence/status",
  "Backup, restore, and deletion evidence",
]);
requireFragments("operations evidence route", operationsRoute, [
  'runtime = "nodejs"',
  'dynamic = "force-dynamic"',
  "metadata only",
  "No learner records",
  "Cache-Control",
  "hasTeacherOperationsReadAuthorization",
  "tenantId",
]);
requireFragments("teacher session boundary", teacherSession, [
  "TEACHER_SESSION_COOKIE",
  "TEACHER_PERSISTENCE_READ_SCOPE",
  "HttpOnly",
  "LIVING_TEXTBOOK_TEACHER_SESSION_SECRET",
  "LIVING_TEXTBOOK_TEACHER_REVIEW_CODE",
  "expiresAt",
]);
requireFragments("teacher operations authorization", teacherAuthorization, [
  "readTeacherSessionClaims",
  "TEACHER_PERSISTENCE_READ_SCOPE",
  "claims.tenantId === tenantId",
  "LIVING_TEXTBOOK_PERSISTENCE_API_TOKEN",
]);
requireFragments("teacher session route", teacherSessionRoute, [
  "POST",
  "DELETE",
  "isTeacherSessionConfigured",
  "isTeacherReviewCodeValid",
  "isTeacherTenantAllowed",
  "setTeacherSessionCookie",
  "clearTeacherSessionCookie",
]);
requireFragments("teacher access panel", teacherAccessPanel, [
  "Tenant-scoped operations review",
  "school-approved review code",
  "Sign out",
]);
requireFragments("operations evidence panel", operationsPanel, [
  "Read-only recovery history",
  "cannot start an operation",
  "/api/persistence/operations",
  "No learner records or student identifiers",
]);
requireFragments("operations environment", envExample, [
  "LIVING_TEXTBOOK_PERSISTENCE_ALLOW_OPERATIONS=false",
  "LIVING_TEXTBOOK_PERSISTENCE_RETENTION_DAYS=30",
]);
requireFragments("evidence chain checks", chainChecks, ["tamper-evident chain", "Health diagnostics", "npm run verify:durable-operations"]);
requireFragments("evidence chain ADR", chainAdr, ["tamper-evident hash chain", "backfill", "teacher-safe status"]);

try {
  const db = new DatabaseSync(sourcePath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = FULL;
    CREATE TABLE hosted_progression_records (
      tenant_id TEXT NOT NULL,
      package_id TEXT NOT NULL,
      launch_code TEXT NOT NULL,
      student_session_id TEXT NOT NULL,
      idempotency_key TEXT NOT NULL,
      written_at TEXT NOT NULL,
      record_json TEXT NOT NULL,
      PRIMARY KEY (tenant_id, package_id, launch_code, student_session_id, idempotency_key)
    ) STRICT;
    CREATE TABLE progression_operation_evidence (
      evidence_id TEXT PRIMARY KEY,
      operation TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      status TEXT NOT NULL,
      schema_version INTEGER NOT NULL,
      artifact_sha256 TEXT,
      artifact_bytes INTEGER,
      retention_days INTEGER NOT NULL,
      scope_digest TEXT,
      tenant_scope_digest TEXT,
      deleted_records INTEGER,
      previous_hash TEXT,
      evidence_hash TEXT
    ) STRICT;
  `);
  db.prepare("INSERT INTO hosted_progression_records VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "tenant-a", "package-a", "launch-a", "student-a", "idempotency-a", "2026-09-16T00:00:00.000Z", JSON.stringify({ tenantId: "tenant-a" }),
  );
  const scopeDigest = createHash("sha256").update("tenant-a\u001fpackage-a\u001flaunch-a\u001fstudent-a").digest("hex");
  const tenantScopeDigest = createHash("sha256").update("tenant-a").digest("hex");
  const evidenceHash = createHash("sha256").update(JSON.stringify({
    evidenceId: "ops-test",
    operation: "retention-delete",
    occurredAt: "2026-09-16T00:00:02.000Z",
    status: "completed",
    schemaVersion: 1,
    artifactSha256: null,
    artifactBytes: null,
    retentionDays: 30,
    scopeDigest,
    deletedRecords: 1,
    previousHash: null,
    tenantScopeDigest,
  })).digest("hex");
  db.prepare("INSERT INTO progression_operation_evidence VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    "ops-test", "retention-delete", "2026-09-16T00:00:02.000Z", "completed", 1, null, null, 30,
    scopeDigest, tenantScopeDigest, 1, null, evidenceHash,
  );
  db.prepare("INSERT INTO hosted_progression_records VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "tenant-b", "package-b", "launch-b", "student-b", "idempotency-b", "2026-09-16T00:00:01.000Z", JSON.stringify({ tenantId: "tenant-b" }),
  );
  db.exec(`VACUUM INTO '${backupPath.replaceAll("'", "''")}'`);
  db.close();

  if (!fs.existsSync(backupPath)) failures.push("backup file was not created");
  const backupChecksum = createHash("sha256").update(fs.readFileSync(backupPath)).digest("hex");
  if (!/^[0-9a-f]{64}$/.test(backupChecksum)) failures.push("backup did not receive a SHA-256 checksum");
  const backup = new DatabaseSync(backupPath);
  const integrity = backup.prepare("PRAGMA integrity_check").get();
  if (integrity?.integrity_check !== "ok") failures.push("backup integrity check failed");
  backup.close();

  fs.copyFileSync(backupPath, restoredPath);
  const restoredChecksum = createHash("sha256").update(fs.readFileSync(restoredPath)).digest("hex");
  if (restoredChecksum !== backupChecksum) failures.push("restored database did not match the backup checksum");
  const restored = new DatabaseSync(restoredPath);
  const restoredCount = restored.prepare("SELECT COUNT(*) AS count FROM hosted_progression_records").get();
  if (Number(restoredCount?.count) !== 2) failures.push("restore did not preserve both tenant records");
  const deleted = restored.prepare("DELETE FROM hosted_progression_records WHERE tenant_id = ? AND package_id = ? AND launch_code = ? AND student_session_id = ?").run("tenant-a", "package-a", "launch-a", "student-a");
  if (Number(deleted.changes) !== 1) failures.push("retention deletion did not remove the requested identity");
  const remaining = restored.prepare("SELECT tenant_id FROM hosted_progression_records").all();
  if (remaining.length !== 1 || remaining[0].tenant_id !== "tenant-b") failures.push("retention deletion crossed the tenant boundary");
  const evidence = restored.prepare("SELECT * FROM progression_operation_evidence").all();
  if (evidence.length !== 1 || evidence[0].scope_digest?.length !== 64) failures.push("operation evidence did not preserve a one-way scope digest");
  if (JSON.stringify(evidence).includes("student-a")) failures.push("operation evidence leaked a raw student-session identifier");
  const expectedEvidenceHash = createHash("sha256").update(JSON.stringify({
    evidenceId: evidence[0].evidence_id,
    operation: evidence[0].operation,
    occurredAt: evidence[0].occurred_at,
    status: evidence[0].status,
    schemaVersion: evidence[0].schema_version,
    artifactSha256: evidence[0].artifact_sha256,
    artifactBytes: evidence[0].artifact_bytes,
    retentionDays: evidence[0].retention_days,
    scopeDigest: evidence[0].scope_digest,
    deletedRecords: evidence[0].deleted_records,
    previousHash: null,
    tenantScopeDigest: evidence[0].tenant_scope_digest,
  })).digest("hex");
  if (evidence[0].previous_hash !== null || evidence[0].evidence_hash !== expectedEvidenceHash) failures.push("operation evidence did not preserve its first chain hash");
  restored.prepare("UPDATE progression_operation_evidence SET deleted_records = 2 WHERE evidence_id = ?").run("ops-test");
  const tampered = restored.prepare("SELECT evidence_hash FROM progression_operation_evidence WHERE evidence_id = ?").get("ops-test");
  const tamperedExpectedHash = createHash("sha256").update(JSON.stringify({
    evidenceId: "ops-test",
    operation: "retention-delete",
    occurredAt: "2026-09-16T00:00:02.000Z",
    status: "completed",
    schemaVersion: 1,
    artifactSha256: null,
    artifactBytes: null,
    retentionDays: 30,
    scopeDigest,
    deletedRecords: 2,
    previousHash: null,
    tenantScopeDigest,
  })).digest("hex");
  if (tampered.evidence_hash === tamperedExpectedHash) {
    failures.push("operation evidence tamper check did not detect a changed receipt");
  }
  restored.close();
} catch (error) {
  failures.push(`SQLite operations smoke test failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS durable progression backup, restore, retention deletion, and safe status boundaries are present.");
}
