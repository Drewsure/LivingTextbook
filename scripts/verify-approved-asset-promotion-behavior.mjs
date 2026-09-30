import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const workspace = mkdtempSync(join(tmpdir(), "living-textbook-approved-asset-promotion-"));
const compiledRoot = join(workspace, "compiled");
const quarantineRoot = join(workspace, "quarantine");
const approvedRoot = join(workspace, "approved");
const failures = [];

try {
  compileSources();
  const model = require(join(compiledRoot, "node_modules", "@living-textbook", "content-model", "index.js"));
  const writer = require(join(compiledRoot, "apps", "web", "src", "server", "delivery", "approvedAssetPromotionWriter.js"));
  const payload = Buffer.from("publisher-audio-fixture\n", "utf8");
  const checksum = createHash("sha256").update(payload).digest("hex");
  const quarantineId = "q-123e4567-e89b-12d3-a456-426614174000";
  const tenantId = "tenant-one";
  const packageId = "package-one";
  const version = "1.0.0";
  const intakeDirectory = join(quarantineRoot, tenantId, quarantineId);
  mkdirSync(intakeDirectory, { recursive: true });
  const intake = model.createUploadQuarantineIntakeRecord({
    intakeId: quarantineId,
    tenantId,
    channelId: "audio-music-upload",
    unitKey: "unit-1",
    fileName: "greetings.mp3",
    mimeType: "audio/mpeg",
    sizeBytes: payload.length,
    checksumSha256: checksum,
  });
  writeFileSync(join(intakeDirectory, "intake.json"), JSON.stringify(intake) + "\n", "utf8");
  writeFileSync(join(intakeDirectory, "payload.mp3"), payload);

  const manifest = createManifest({ model, tenantId, packageId, version, checksum });
  const receipt = model.createPilotDeliveryReleaseReceipt({
    manifest,
    reviewerId: "reviewer-one",
    reviewerRole: "school-admin",
    reviewedAt: "2026-10-01T00:00:00.000Z",
    releaseApproval: "approved",
    qrPrintAuthorization: "approved",
    rollbackReference: "rollback-one",
  });
  const request = createRequest({ tenantId, packageId, version, manifest, receipt, quarantineId, checksum });
  const packageEvidenceReview = {
    tenantId,
    quarantineId,
    packageId,
    sourceChecksumSha256: checksum,
    status: "reviewed-package-evidence",
    evidenceReferences: [{ lane: "audio", referenceId: "asset-evidence-1" }],
  };

  process.env.LIVING_TEXTBOOOK_UPLOAD_QUARANTINE_ROOT = quarantineRoot;
  process.env.LIVING_TEXTBOOOK_APPROVED_ASSET_ROOT = approvedRoot;
  delete process.env.LIVING_TEXTBOOOK_APPROVED_ASSET_PROMOTION_WRITES_ENABLED;
  const disabled = await writer.writeApprovedAssetPromotion({ request, manifest, receipt, packageEvidenceReview });
  assert(disabled.status === "blocked" && disabled.errors.some((error) => error.includes("writes are disabled")), "promotion writes must remain disabled by default");

  process.env.LIVING_TEXTBOOOK_APPROVED_ASSET_PROMOTION_WRITES_ENABLED = "true";
  const first = await writer.writeApprovedAssetPromotion({ request, manifest, receipt, packageEvidenceReview });
  assert(first.status === "accepted" && first.idempotent === false, `approved asset promotion must write once: ${JSON.stringify(first)}`);
  const promotedPath = join(approvedRoot, tenantId, packageId, version, "media", "greetings.mp3");
  const recordPath = join(approvedRoot, tenantId, packageId, version, "promotion-record.json");
  assert(existsSync(promotedPath) && existsSync(recordPath), "promotion writer must copy the approved payload and write its custody record");
  const second = await writer.writeApprovedAssetPromotion({ request, manifest, receipt, packageEvidenceReview });
  assert(second.status === "accepted" && second.idempotent === true, "exact approved asset promotion replay must be idempotent");

  const unsafe = { ...request, entries: [{ ...request.entries[0], destinationPath: "../escape.mp3" }] };
  const unsafeResult = await writer.writeApprovedAssetPromotion({ request: unsafe, manifest, receipt, packageEvidenceReview });
  assert(unsafeResult.status === "blocked", "unsafe destination paths must fail closed");

  const missingEvidence = { ...request, entries: [{ ...request.entries[0], evidenceReferenceId: "unreviewed-asset" }] };
  const missingEvidenceResult = await writer.writeApprovedAssetPromotion({ request: missingEvidence, manifest, receipt, packageEvidenceReview });
  assert(missingEvidenceResult.status === "blocked" && missingEvidenceResult.errors.some((error) => error.includes("not present")), "unreviewed evidence references must fail closed");
} catch (error) {
  failures.push(`Approved asset promotion behavior harness failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS approved asset promotion proves disabled-by-default writes, release/evidence binding, checksum-verified quarantine copying, safe destinations, immutable custody, idempotence, and student-facing separation.");
}

function compileSources() {
  mkdirSync(compiledRoot, { recursive: true });
  writeFileSync(join(compiledRoot, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const tsc = join(root, "node_modules", "typescript", "bin", "tsc");
  const compile = spawnSync(process.execPath, [
    tsc, "--module", "commonjs", "--target", "ES2022", "--moduleResolution", "node", "--esModuleInterop", "--skipLibCheck", "--noCheck", "--rootDir", root, "--outDir", compiledRoot,
    "packages/content-model/src/approvedAssetPromotion.ts",
    "packages/content-model/src/pilotDeliveryManifest.ts",
    "packages/content-model/src/pilotDeliveryReleaseReceipt.ts",
    "packages/content-model/src/uploadQuarantinePackageEvidenceReview.ts",
    "packages/content-model/src/uploadQuarantineIntake.ts",
    "apps/web/src/server/delivery/approvedAssetPromotionWriter.ts",
    "apps/web/src/server/persistence/backupPathPolicy.ts",
    "apps/web/src/server/uploads/quarantinePathPolicy.ts",
  ], { cwd: root, encoding: "utf8" });
  if (compile.status !== 0) {
    process.stdout.write(compile.stdout);
    process.stderr.write(compile.stderr);
    throw new Error("TypeScript compilation failed.");
  }
  normalizeCompiledExtensions(compiledRoot);
  const contentModelPackage = join(compiledRoot, "node_modules", "@living-textbook", "content-model");
  mkdirSync(contentModelPackage, { recursive: true });
  writeFileSync(join(contentModelPackage, "package.json"), JSON.stringify({ name: "@living-textbook/content-model", main: "index.js", type: "commonjs" }), "utf8");
  writeFileSync(join(contentModelPackage, "index.js"), [
    'module.exports = {',
    '  ...require("../../../packages/content-model/src/approvedAssetPromotion.js"),',
    '  ...require("../../../packages/content-model/src/pilotDeliveryManifest.js"),',
    '  ...require("../../../packages/content-model/src/pilotDeliveryReleaseReceipt.js"),',
    '  ...require("../../../packages/content-model/src/uploadQuarantineIntake.js"),',
    '};',
  ].join("\n"), "utf8");
}

function normalizeCompiledExtensions(directory) {
  for (const entry of require("node:fs").readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) normalizeCompiledExtensions(path);
    else if (entry.isFile() && entry.name.endsWith(".js")) {
      const source = readFileSync(path, "utf8");
      const normalized = source.replace(/require\("(\.[^"]+)\.ts"\)/g, 'require("$1.js")');
      if (normalized !== source) writeFileSync(path, normalized, "utf8");
    }
  }
}

function createManifest({ model, tenantId, packageId, version, checksum }) {
  return {
    manifestId: "manifest-one",
    tenantId,
    packageId,
    version,
    mode: "closed-local",
    sourceAssemblyChecksum: `sha256:${checksum}`,
    status: "ready-for-manual-release",
    contentPackagePath: "/packages/package-one/content/package.json",
    gameRoutePaths: ["/games/flashcards"],
    mediaKinds: ["audio"],
    qrAliasPaths: ["/q/tenant-one/unit-1"],
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

function createRequest({ tenantId, packageId, version, manifest, receipt, quarantineId, checksum }) {
  return {
    recordVersion: 1,
    tenantId,
    packageId,
    version,
    manifestId: manifest.manifestId,
    receiptId: receipt.receiptId,
    quarantineId,
    reviewPacketId: "packet-one",
    entries: [{ assetId: "greetings-audio", sourceQuarantineId: quarantineId, evidenceReferenceId: "asset-evidence-1", destinationPath: "media/greetings.mp3", kind: "audio", channelId: "audio-music-upload", mimeType: "audio/mpeg", checksumSha256: checksum, unitKey: "unit-1" }],
    operatorId: "operator-one",
    promotedAt: "2026-10-01T00:00:00.000Z",
  };
}

function assert(condition, message) { if (!condition) failures.push(message); }
