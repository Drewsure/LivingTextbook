import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const workspace = mkdtempSync(join(tmpdir(), "living-textbook-hosted-activation-"));
const compiledRoot = join(workspace, "compiled");
const custodyRoot = join(workspace, "custody");
const failures = [];

try {
  compileSources();
  const { readHostedPersistenceActivation } = require(join(compiledRoot, "apps", "web", "src", "server", "persistence", "hostedPersistenceActivationStore.js"));
  const directory = join(custodyRoot, "sample-publisher", "sample-package");
  mkdirSync(directory, { recursive: true });
  process.env.LIVING_TEXTBOOOK_HOSTED_PERSISTENCE_ACTIVATION_ROOT = custodyRoot;

  const missing = await readHostedPersistenceActivation({ tenantId: "sample-publisher", packageId: "sample-package" });
  assert(missing.status === "not-found", "missing activation record must remain unavailable");

  const record = {
    recordVersion: 1,
    activationId: "sample-package:hosted-activation",
    tenantId: "sample-publisher",
    packageId: "sample-package",
    deliveryVersion: "1.0.0",
    releaseReceiptId: "sample-package:release-receipt",
    hostedPersistenceDecisionPacketId: "sample-package:hosted-persistence-opt-in",
    provider: "sqlite",
    deliveryMode: "hosted-managed",
    status: "approved",
    optInRecorded: true,
    schoolPolicyAccepted: true,
    retentionPolicyAccepted: true,
    releaseApprovalAccepted: true,
    writesAllowed: true,
    studentContinuityAllowed: true,
    teacherReviewAllowed: true,
    routeMutationAllowed: false,
    studentFacingActivationAllowed: false,
    operatorId: "operator-1",
    activatedAt: "2026-10-01T00:00:00.000Z",
    sideEffect: "metadata-only",
  };
  const recordPath = join(directory, "activation.json");
  writeFileSync(recordPath, JSON.stringify(record) + "\n", "utf8");

  const available = await readHostedPersistenceActivation({ tenantId: "sample-publisher", packageId: "sample-package" });
  assert(available.status === "available", "valid package-scoped activation record must be readable");
  assert(available.status === "available" && available.record.provider === "sqlite", "available activation must preserve the approved provider");

  writeFileSync(recordPath, JSON.stringify({ ...record, writesAllowed: false }) + "\n", "utf8");
  const rejected = await readHostedPersistenceActivation({ tenantId: "sample-publisher", packageId: "sample-package" });
  assert(rejected.status === "blocked", "unsafe activation flags must fail closed");

  writeFileSync(recordPath, JSON.stringify(record) + "\n", "utf8");
  const crossTenant = await readHostedPersistenceActivation({ tenantId: "other-publisher", packageId: "sample-package" });
  assert(crossTenant.status === "not-found", "cross-tenant activation lookup must not find another tenant record");
  const crossPackage = await readHostedPersistenceActivation({ tenantId: "sample-publisher", packageId: "other-package" });
  assert(crossPackage.status === "not-found", "cross-package activation lookup must not find another package record");
} catch (error) {
  failures.push(`Hosted persistence activation behavior harness failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  delete process.env.LIVING_TEXTBOOOK_HOSTED_PERSISTENCE_ACTIVATION_ROOT;
  rmSync(workspace, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("PASS hosted persistence activation custody proves missing, valid, tampered, tenant-drifted, and package-drifted records fail or pass closed as intended.");

function compileSources() {
  mkdirSync(compiledRoot, { recursive: true });
  writeFileSync(join(compiledRoot, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc,
    "--module", "commonjs",
    "--target", "ES2022",
    "--moduleResolution", "node",
    "--esModuleInterop",
    "--skipLibCheck",
    "--noCheck",
    "--rootDir", root,
    "--outDir", compiledRoot,
    "packages/content-model/src/hostedPersistenceActivation.ts",
    "apps/web/src/server/persistence/hostedPersistenceActivationStore.ts",
    "apps/web/src/server/persistence/backupPathPolicy.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    throw new Error("TypeScript compilation failed.");
  }
  normalizeCompiledExtensions(compiledRoot);
  const contentModelPackage = join(compiledRoot, "node_modules", "@living-textbook", "content-model");
  mkdirSync(contentModelPackage, { recursive: true });
  writeFileSync(join(contentModelPackage, "package.json"), JSON.stringify({ name: "@living-textbook/content-model", main: "../../../packages/content-model/src/hostedPersistenceActivation.js", type: "commonjs" }), "utf8");
}

function normalizeCompiledExtensions(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) normalizeCompiledExtensions(path);
    else if (entry.isFile() && entry.name.endsWith(".js")) {
      const source = readFileSync(path, "utf8");
      const normalized = source.replace(/require\("(\.[^"]+)\.ts"\)/g, 'require("$1.js")');
      if (normalized !== source) writeFileSync(path, normalized, "utf8");
    }
  }
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}
