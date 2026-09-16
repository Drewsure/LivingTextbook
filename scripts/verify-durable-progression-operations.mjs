import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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
const envExample = read(".env.example");

requireFragments("SQLite operations store", store, [
  "getHealth()",
  "VACUUM INTO",
  "deleteForIdentity",
  "static restoreFromBackup",
  "integrity_check",
  "hosted_progression_records",
]);
requireFragments("SQLite operations policy", operations, [
  "LIVING_TEXTBOOK_PERSISTENCE_ALLOW_OPERATIONS",
  "schoolPolicyAccepted",
  "retentionPolicyAccepted",
  "releaseApprovalAccepted",
  "retentionDays",
  "backupTo",
  "restoreFromBackup",
  "deleteForIdentity",
]);
requireFragments("safe status route", statusRoute, [
  'runtime = "nodejs"',
  'dynamic = "force-dynamic"',
  "studentSessionBoundaryConfigured",
  "No learner records, database paths, credentials, raw audio, or transcripts",
  "Cache-Control",
]);
requireFragments("teacher status panel", statusPanel, [
  "Teacher-safe persistence status",
  "No learner records",
  "/api/persistence/status",
  "Backup, restore, and deletion evidence",
]);
requireFragments("operations environment", envExample, [
  "LIVING_TEXTBOOK_PERSISTENCE_ALLOW_OPERATIONS=false",
  "LIVING_TEXTBOOK_PERSISTENCE_RETENTION_DAYS=30",
]);

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
  `);
  db.prepare("INSERT INTO hosted_progression_records VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "tenant-a", "package-a", "launch-a", "student-a", "idempotency-a", "2026-09-16T00:00:00.000Z", JSON.stringify({ tenantId: "tenant-a" }),
  );
  db.prepare("INSERT INTO hosted_progression_records VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "tenant-b", "package-b", "launch-b", "student-b", "idempotency-b", "2026-09-16T00:00:01.000Z", JSON.stringify({ tenantId: "tenant-b" }),
  );
  db.exec(`VACUUM INTO '${backupPath.replaceAll("'", "''")}'`);
  db.close();

  if (!fs.existsSync(backupPath)) failures.push("backup file was not created");
  const backup = new DatabaseSync(backupPath);
  const integrity = backup.prepare("PRAGMA integrity_check").get();
  if (integrity?.integrity_check !== "ok") failures.push("backup integrity check failed");
  backup.close();

  fs.copyFileSync(backupPath, restoredPath);
  const restored = new DatabaseSync(restoredPath);
  const restoredCount = restored.prepare("SELECT COUNT(*) AS count FROM hosted_progression_records").get();
  if (Number(restoredCount?.count) !== 2) failures.push("restore did not preserve both tenant records");
  const deleted = restored.prepare("DELETE FROM hosted_progression_records WHERE tenant_id = ? AND package_id = ? AND launch_code = ? AND student_session_id = ?").run("tenant-a", "package-a", "launch-a", "student-a");
  if (Number(deleted.changes) !== 1) failures.push("retention deletion did not remove the requested identity");
  const remaining = restored.prepare("SELECT tenant_id FROM hosted_progression_records").all();
  if (remaining.length !== 1 || remaining[0].tenant_id !== "tenant-b") failures.push("retention deletion crossed the tenant boundary");
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
