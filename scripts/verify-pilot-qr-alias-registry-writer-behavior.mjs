import { createRequire } from "node:module";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const workspace = mkdtempSync(join(tmpdir(), "living-textbook-qr-registry-"));
const compiledRoot = join(workspace, "compiled");
const registryRoot = join(workspace, "registry");
const failures = [];

try {
  compileSources();
  const model = {
    ...require(join(compiledRoot, "packages", "content-model", "src", "pilotQrAliasRegistryRecord.js")),
    ...require(join(compiledRoot, "packages", "content-model", "src", "pilotDeliveryReleaseReceipt.js")),
  };
  const writer = require(join(compiledRoot, "apps", "web", "src", "server", "delivery", "pilotQrAliasRegistryWriter.js"));
  const manifest = createManifest();
  const receipt = model.createPilotDeliveryReleaseReceipt({
    manifest,
    reviewerId: "reviewer-one",
    reviewerRole: "school-admin",
    reviewedAt: "2026-09-30T00:00:00.000Z",
    releaseApproval: "approved",
    qrPrintAuthorization: "approved",
    rollbackReference: "rollback-one",
  });
  const entry = {
    aliasId: "alias-unit-1",
    printedQrId: "qr-unit-1",
    tenantId: "tenant-one",
    packageId: "package-one",
    version: "1.0.0",
    aliasPath: "/q/tenant-one/unit-one",
    fallbackPath: "/local/package/tenant-one/package-one/1.0.0/front-door/unit-1",
    targetLabel: "Unit 1 launch",
    deploymentTargets: ["local-bundle"],
    status: "draft-only",
    rollbackEvidenceId: "rollback-one",
  };
  const record = model.createPilotQrAliasRegistryRecord({
    manifest,
    receipt,
    entries: [entry],
    registeredBy: "operator-one",
    registeredAt: "2026-09-30T00:00:00.000Z",
  });
  assert(model.validatePilotQrAliasRegistryRecord(record).length === 0, "approved registry record must pass the shared validator");

  process.env.LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_ROOT = registryRoot;
  delete process.env.LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_WRITES_ENABLED;
  const disabled = await writer.writePilotQrAliasRegistry({ record });
  assert(disabled.status === "blocked" && disabled.errors.some((error) => error.includes("writes are disabled")), "registry writes must remain disabled by default");

  process.env.LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_WRITES_ENABLED = "true";
  const first = await writer.writePilotQrAliasRegistry({ record });
  assert(first.status === "accepted" && first.idempotent === false, `approved registry record must write once: ${JSON.stringify(first)}`);
  const storedPath = join(registryRoot, "tenant-one", "package-one", "1.0.0", "qr-alias-registry.json");
  assert(existsSync(storedPath), "registry writer must create the tenant/package/version record");
  const second = await writer.writePilotQrAliasRegistry({ record });
  assert(second.status === "accepted" && second.idempotent === true, "exact registry replay must be idempotent");
  const conflictRecord = { ...record, registeredBy: "operator-two" };
  const conflict = await writer.writePilotQrAliasRegistry({ record: conflictRecord });
  assert(conflict.status === "conflict", "different immutable registry content must conflict");

  const read = await writer.readPilotQrAliasRegistry({ tenantId: "tenant-one", packageId: "package-one", version: "1.0.0" });
  assert(read.status === "available", "written registry record must be readable");
  if (read.status === "available") assert(read.record.recordId === record.recordId && read.record.routeMutationAllowed === false, "registry reader must preserve identity and route safety");

  const tampered = JSON.parse(readFileSync(storedPath, "utf8"));
  tampered.entries[0].fallbackPath = "/local/package/tenant-one/other-package/1.0.0/front-door/unit-1";
  writeFileSync(storedPath, JSON.stringify(tampered) + "\n", "utf8");
  const tamperedRead = await writer.readPilotQrAliasRegistry({ tenantId: "tenant-one", packageId: "package-one", version: "1.0.0" });
  assert(tamperedRead.status === "blocked", "tampered registry record must fail closed on read");

  const unsafe = { ...record, recordId: "../unsafe" };
  assert(model.validatePilotQrAliasRegistryRecord(unsafe).some((error) => error.includes("recordId")), "registry record identity drift must be rejected");
} catch (error) {
  failures.push(`QR alias registry behavior harness failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS guarded QR alias registry writer proves disabled-by-default behavior, approved writes, idempotence, immutable conflicts, tenant-scoped reads, tamper rejection, and route/student activation safety.");
}

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
    "packages/content-model/src/pilotQrAliasRegistryRecord.ts",
    "packages/content-model/src/pilotDeliveryManifest.ts",
    "packages/content-model/src/pilotDeliveryReleaseReceipt.ts",
    "packages/content-model/src/pilotQrAliasRegistry.ts",
    "apps/web/src/server/delivery/pilotQrAliasRegistryWriter.ts",
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
  writeFileSync(join(contentModelPackage, "package.json"), JSON.stringify({ name: "@living-textbook/content-model", main: "../../../packages/content-model/src/pilotQrAliasRegistryRecord.js", type: "commonjs" }), "utf8");
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

function createManifest() {
  return {
    manifestId: "manifest-one",
    tenantId: "tenant-one",
    packageId: "package-one",
    version: "1.0.0",
    mode: "closed-local",
    sourceAssemblyChecksum: "sha256:" + "b".repeat(64),
    status: "ready-for-manual-release",
    contentPackagePath: "/packages/package-one/content/package.json",
    gameRoutePaths: ["/games/flashcards"],
    mediaKinds: ["audio"],
    qrAliasPaths: ["/q/tenant-one/unit-one"],
    localFallbackPaths: ["/local/package/tenant-one/package-one/1.0.0/front-door/unit-1"],
    hostedPersistence: "not-selected",
    hostedPersistenceDecisionPacketId: null,
    gates: { sourceReview: true, packageReadiness: true, multimediaRights: true, gameAudio: true, qrRegistry: true, qrPrintAuthorization: true, localBundle: true, hostedPersistence: false, teacherPolicy: true, releaseApproval: true },
    unresolvedRequirements: [],
    blockedActions: ["No package writer execution without manual release approval"],
    deliveryAllowed: true,
    qrPrintAllowed: true,
    studentFacingActivationAllowed: false,
    sideEffect: "none",
  };
}

function assert(condition, message) { if (!condition) failures.push(message); }
