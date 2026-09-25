import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = process.cwd();
const output = mkdtempSync(join(tmpdir(), "living-textbook-backup-path-"));
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const source = readFileSync(join(root, "apps", "web", "src", "server", "persistence", "backupPathPolicy.ts"), "utf8");
  writeFileSync(join(output, "backupPathPolicy.js"), ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, "utf8");
  const { validateDurableBackupPath } = require(join(output, "backupPathPolicy.js"));
  const custodyRoot = join(output, "custody");
  assert(validateDurableBackupPath(join(custodyRoot, "backup.sqlite"), custodyRoot).length === 0, "backup below custody root must pass");
  assert(validateDurableBackupPath(join(custodyRoot, "nested", "backup.sqlite"), custodyRoot).length === 0, "nested backup below custody root must pass");
  assert(validateDurableBackupPath(join(output, "outside.sqlite"), custodyRoot).some((error) => error.includes("inside")), "outside backup path must fail");
  assert(validateDurableBackupPath(custodyRoot, custodyRoot).some((error) => error.includes("below")), "custody root itself must fail");
  assert(validateDurableBackupPath(join(custodyRoot, "backup.sqlite"), undefined).some((error) => error.includes("configured")), "missing custody root must fail");
  assert(validateDurableBackupPath(resolve(custodyRoot, "..", "custody-other", "backup.sqlite"), custodyRoot).some((error) => error.includes("inside")), "path traversal outside custody root must fail");
} catch (error) {
  failures.push(`backup path verification failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS durable backup and restore paths remain inside an explicit custody root");
}
