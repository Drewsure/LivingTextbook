import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
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
  const { validateDurableBackupPath, validateDurableBackupFilesystemPath } = require(join(output, "backupPathPolicy.js"));
  const custodyRoot = join(output, "custody");
  assert(validateDurableBackupPath(join(custodyRoot, "backup.sqlite"), custodyRoot).length === 0, "backup below custody root must pass");
  assert(validateDurableBackupPath(join(custodyRoot, "nested", "backup.sqlite"), custodyRoot).length === 0, "nested backup below custody root must pass");
  assert(validateDurableBackupPath(join(output, "outside.sqlite"), custodyRoot).some((error) => error.includes("inside")), "outside backup path must fail");
  assert(validateDurableBackupPath(custodyRoot, custodyRoot).some((error) => error.includes("below")), "custody root itself must fail");
  assert(validateDurableBackupPath(join(custodyRoot, "backup.sqlite"), undefined).some((error) => error.includes("configured")), "missing custody root must fail");
  assert(validateDurableBackupPath(resolve(custodyRoot, "..", "custody-other", "backup.sqlite"), custodyRoot).some((error) => error.includes("inside")), "path traversal outside custody root must fail");

  mkdirSync(custodyRoot, { recursive: true });
  assert(validateDurableBackupFilesystemPath(join(custodyRoot, "backup.sqlite"), custodyRoot).length === 0, "filesystem path below existing custody root must pass");
  assert(validateDurableBackupFilesystemPath(join(output, "missing", "backup.sqlite"), join(output, "missing")).some((error) => error.includes("must exist")), "missing filesystem custody root must fail");

  const outsideRoot = join(output, "outside");
  mkdirSync(outsideRoot, { recursive: true });
  const junction = join(custodyRoot, "escape");
  try {
    symlinkSync(outsideRoot, junction, "junction");
    assert(validateDurableBackupFilesystemPath(join(junction, "backup.sqlite"), custodyRoot).some((error) => error.includes("escapes")), "junction escape must fail");
  } catch {
    console.log("SKIP junction escape test: filesystem does not permit junction creation in this environment.");
  }
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
