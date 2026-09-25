import { createRequire } from "node:module";
import { mkdirSync, readFileSync, rmSync, writeFileSync, mkdtempSync, symlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-database-path-"));
const failures = [];

try {
  writeFileSync(join(output, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const source = readFileSync(join(root, "apps", "web", "src", "server", "persistence", "databasePathPolicy.ts"), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const modulePath = join(output, "databasePathPolicy.js");
  writeFileSync(modulePath, compiled, "utf8");
  const policy = require(modulePath);
  const dataRoot = resolve(output, "data");
  mkdirSync(dataRoot, { recursive: true });

  assertEmpty(policy.validateDurableDatabasePath(join(dataRoot, "progress.sqlite"), dataRoot), "nested sqlite path");
  assertEmpty(policy.validateDurableDatabasePath(join(dataRoot, "tenant-a", "progress.sqlite"), dataRoot), "tenant nested sqlite path");
  assertError(policy.validateDurableDatabasePath(join(dataRoot, "progress.db"), dataRoot), ".sqlite extension");
  assertError(policy.validateDurableDatabasePath(dataRoot, dataRoot), "root itself");
  assertError(policy.validateDurableDatabasePath(join(output, "outside.sqlite"), dataRoot), "outside path");
  assertError(policy.validateDurableDatabasePath(join(dataRoot, "..", "outside.sqlite"), dataRoot), "traversal path");
  assertError(policy.validateDurableDatabasePath(join(dataRoot, "progress.sqlite"), undefined), "missing data root");
  assertEmpty(policy.validateDurableDatabaseFilesystemPath(join(dataRoot, "progress.sqlite"), dataRoot), "existing data root");
  assertError(policy.validateDurableDatabaseFilesystemPath(join(output, "missing", "progress.sqlite"), join(output, "missing")), "missing data root");

  const outsideRoot = resolve(output, "outside");
  mkdirSync(outsideRoot, { recursive: true });
  const junction = join(dataRoot, "escape");
  try {
    symlinkSync(outsideRoot, junction, "junction");
    assertError(policy.validateDurableDatabaseFilesystemPath(join(junction, "progress.sqlite"), dataRoot), "junction escape");
  } catch {
    console.log("SKIP junction escape test: filesystem does not permit junction creation in this environment.");
  }
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS durable SQLite database custody-root policy rejects unsafe paths and accepts nested .sqlite paths.");
}

function assertEmpty(errors, label) {
  if (errors.length > 0) failures.push(`${label}: expected no errors, received ${errors.join(" | ")}`);
}

function assertError(errors, label) {
  if (errors.length === 0) failures.push(`${label}: expected a policy error`);
}
