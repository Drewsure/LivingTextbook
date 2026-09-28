import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = mkdtempSync(join(tmpdir(), "living-textbook-quarantine-path-"));
const failures = [];

try {
  const source = readFileSync(join(root, "apps", "web", "src", "server", "uploads", "quarantinePathPolicy.ts"), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const modulePath = join(output, "quarantinePathPolicy.js");
  require("node:fs").writeFileSync(modulePath, compiled, "utf8");
  const { validateQuarantineFilesystemPath } = require(modulePath);
  const quarantineRoot = join(output, "quarantine");
  mkdirSync(quarantineRoot, { recursive: true });

  assertEmpty(validateQuarantineFilesystemPath(join(quarantineRoot, "tenant-a", "q-123"), quarantineRoot), "nested quarantine path");
  assertError(validateQuarantineFilesystemPath(join(output, "outside", "q-123"), quarantineRoot), "outside quarantine path");
  assertError(validateQuarantineFilesystemPath(join(quarantineRoot, "..", "outside", "q-123"), quarantineRoot), "traversal quarantine path");
  assertError(validateQuarantineFilesystemPath(join(output, "missing", "q-123"), join(output, "missing")), "missing quarantine root");

  const outsideRoot = join(output, "outside-root");
  mkdirSync(outsideRoot, { recursive: true });
  const junction = join(quarantineRoot, "escape");
  try {
    symlinkSync(outsideRoot, junction, "junction");
    assertError(validateQuarantineFilesystemPath(join(junction, "q-123"), quarantineRoot), "junction escape");
  } catch {
    console.log("SKIP junction escape test: filesystem does not permit junction creation in this environment.");
  }
} catch (error) {
  failures.push(`quarantine filesystem verification failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  rmSync(output, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS upload quarantine filesystem custody rejects unsafe paths and junction escapes.");
}

function assertEmpty(errors, label) {
  if (errors.length > 0) failures.push(`${label}: expected no errors, received ${errors.join(" | ")}`);
}

function assertError(errors, label) {
  if (errors.length === 0) failures.push(`${label}: expected a policy error`);
}
