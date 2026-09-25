import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = process.cwd();
const output = mkdtempSync(join(tmpdir(), "living-textbook-backup-manifest-"));
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const source = readFileSync(join(root, "apps", "web", "src", "server", "persistence", "backupManifest.ts"), "utf8");
  writeFileSync(join(output, "backupManifest.js"), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  const { createDurableProgressionBackupManifest, validateDurableProgressionBackupManifest } = require(join(output, "backupManifest.js"));
  const valid = {
    manifestVersion: 1,
    artifactKind: "sqlite-progression-backup",
    provider: "sqlite",
    schemaVersion: 1,
    bytes: 4096,
    sha256: "a".repeat(64),
    createdAt: "2026-09-25T00:00:00.000Z",
    retentionDays: 30,
    rawLearnerAudioExcluded: true,
    learnerTranscriptsExcluded: true,
  };

  assert(validateDurableProgressionBackupManifest(valid).length === 0, "valid backup manifest must pass");
  const created = createDurableProgressionBackupManifest({ bytes: valid.bytes, sha256: valid.sha256, schemaVersion: 1 }, 30, valid.createdAt);
  assert(validateDurableProgressionBackupManifest(created).length === 0, "created backup manifest must pass its own validator");
  assert(created.bytes === valid.bytes && created.sha256 === valid.sha256, "created backup manifest must bind artifact identity");
  assert(validateDurableProgressionBackupManifest(valid, { bytes: 4096, sha256: valid.sha256, schemaVersion: 1 }).length === 0, "matching artifact expectations must pass");
  assert(validateDurableProgressionBackupManifest({ ...valid, manifestVersion: 2 }).some((error) => error.includes("manifestVersion")), "manifest version drift must fail");
  assert(validateDurableProgressionBackupManifest({ ...valid, sha256: "A".repeat(64) }).some((error) => error.includes("lowercase")), "uppercase checksum must fail");
  assert(validateDurableProgressionBackupManifest(valid, { bytes: 4095 }).some((error) => error.includes("bytes")), "byte mismatch must fail");
  assert(validateDurableProgressionBackupManifest(valid, { sha256: "b".repeat(64) }).some((error) => error.includes("sha256")), "checksum mismatch must fail");
  assert(validateDurableProgressionBackupManifest({ ...valid, schemaVersion: 2 }).some((error) => error.includes("schemaVersion")), "schema mismatch must fail");
  assert(validateDurableProgressionBackupManifest({ ...valid, rawLearnerAudioExcluded: false }).some((error) => error.includes("exclude")), "raw learner audio inclusion must fail");
  assert(validateDurableProgressionBackupManifest({ ...valid, retentionDays: 0 }).some((error) => error.includes("retentionDays")), "invalid retention must fail");
  assert(validateDurableProgressionBackupManifest({ ...valid, createdAt: "not-a-date" }).some((error) => error.includes("createdAt")), "invalid timestamp must fail");
  let invalidCreationRejected = false;
  try {
    createDurableProgressionBackupManifest({ bytes: valid.bytes, sha256: valid.sha256, schemaVersion: 1 }, 0, valid.createdAt);
  } catch {
    invalidCreationRejected = true;
  }
  assert(invalidCreationRejected, "backup manifest creation must reject invalid retention");
} catch (error) {
  failures.push(`backup manifest verification failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS durable backup manifest validation and negative coverage");
}
