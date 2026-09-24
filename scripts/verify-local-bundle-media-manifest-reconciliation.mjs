import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-media-reconciliation-"));
const bindingSource = readFileSync(join(root, "packages", "content-model", "src", "localBundleMediaEvidenceBinding.ts"), "utf8");
const reconciliationSource = readFileSync(join(root, "packages", "content-model", "src", "localBundleMediaManifestReconciliation.ts"), "utf8");
writeFileSync(join(output, "localBundleMediaEvidenceBinding.js"), ts.transpileModule(bindingSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);
writeFileSync(join(output, "localBundleMediaManifestReconciliation.js"), ts.transpileModule(reconciliationSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);

const { reconcileLocalBundleMediaManifest } = await import(`file://${join(output, "localBundleMediaManifestReconciliation.js").replaceAll("\\", "/")}`);

const binding = {
  bindingId: "binding-1",
  manifestId: "manifest-1",
  tenantId: "tenant-1",
  bundleId: "bundle-1",
  packageId: "package-1",
  packageVersion: "2026.1-preview",
  unitIds: ["unit-1"],
  storageSelectionPreflightId: "storage-preflight-1",
  storageSelectionGateId: "storage-gate-1",
  storageSelectionStatus: "blocked",
  storageSelectionAllowed: false,
  mode: "review-only",
  status: "blocked",
  assets: [
    { assetId: "audio", unitId: "unit-1", label: "Audio", kind: "audio", relativePath: "media/audio/a.mp3", sourceRef: "source", rightsStatus: "unknown", rightsEvidenceRef: "rights-review", checksum: "missing", scanStatus: "pending", targetMappingReviewed: false, transcriptOrCaptionRef: "caption.txt", posterRef: null, altTextReady: true, localEligibility: "blocked", blockers: ["rights"] },
    { assetId: "video", unitId: "unit-1", label: "Video", kind: "video", relativePath: "media/video/v.mp4", sourceRef: "source", rightsStatus: "unknown", rightsEvidenceRef: "rights-review", checksum: "missing", scanStatus: "pending", targetMappingReviewed: false, transcriptOrCaptionRef: "caption.vtt", posterRef: "poster.jpg", altTextReady: true, localEligibility: "blocked", blockers: ["rights"] },
    { assetId: "image", unitId: "unit-1", label: "Image", kind: "image", relativePath: "media/images/i.png", sourceRef: "source", rightsStatus: "unknown", rightsEvidenceRef: "rights-review", checksum: "missing", scanStatus: "pending", targetMappingReviewed: false, transcriptOrCaptionRef: null, posterRef: null, altTextReady: false, localEligibility: "blocked", blockers: ["rights"] },
  ],
  assetCopyAllowed: false,
  packageWriteAllowed: false,
  studentFacingAllowed: false,
  localActivationAllowed: false,
  blockedActions: ["file-upload", "media-copy", "package-write", "local-activation", "student-promotion", "qr-mutation"],
  sideEffect: "none",
};
const manifest = {
  manifestId: "manifest-1",
  rollbackDryRunId: "rollback-1",
  reconciliationId: "reconciliation-1",
  tenantId: "tenant-1",
  bundleId: "bundle-1",
  packageId: "package-1",
  currentVersion: "2026.1-preview",
  storageSelectionPreflightId: "storage-preflight-1",
  storageSelectionGateId: "storage-gate-1",
  previousVersion: null,
  mode: "review-only",
  status: "blocked",
  manifestState: "preview-only",
  artifacts: [
    { artifactId: "content", label: "Content", kind: "content", relativePath: "content/content.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "ready-preview", sourceRef: "content" },
    { artifactId: "media", label: "Media", kind: "media", relativePath: "media/manifest.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "review-required", sourceRef: "media" },
    { artifactId: "route", label: "Route", kind: "route", relativePath: "routes/routes.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "review-required", sourceRef: "route" },
    { artifactId: "game", label: "Game", kind: "game", relativePath: "games/games.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "review-required", sourceRef: "game" },
    { artifactId: "reporting", label: "Reporting", kind: "reporting", relativePath: "policy/reporting.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "review-required", sourceRef: "reporting" },
  ],
  rollbackImpacts: [],
  qrFallbackRule: "Stable QR fallback",
  requiredApprovals: ["review"],
  blockedActions: ["manifest-write"],
  manifestWriteAllowed: false,
  bundleActivationAllowed: false,
  qrMutationAllowed: false,
  mediaReplacementAllowed: false,
  gameRouteMutationAllowed: false,
  reportSchemaMutationAllowed: false,
  learnerDataDeletionAllowed: false,
  rollbackExecutionAllowed: false,
  sideEffect: "none",
};

const needsEvidence = reconcileLocalBundleMediaManifest(manifest, binding);
assert(needsEvidence.status === "needs-evidence", "matching identity with open media evidence must need evidence");
assert(needsEvidence.identityMatches && needsEvidence.storageSelectionMatches && needsEvidence.unitScopeMatches && needsEvidence.mediaArtifactFound && needsEvidence.pathMatches && needsEvidence.versionMatches, "matching manifest identity, storage identity, unit scope, artifact, path, and version must be reported");
assert(needsEvidence.localActivationAllowed === false && needsEvidence.studentFacingAllowed === false && needsEvidence.sideEffect === "none", "reconciliation must remain non-executing");

const completeBinding = {
  ...binding,
  assets: binding.assets.map((asset) => ({
    ...asset,
    rightsStatus: "owned",
    checksum: `sha256-${"0".repeat(64)}`,
    scanStatus: "passed",
    targetMappingReviewed: true,
    localEligibility: "review-required",
    altTextReady: true,
  })),
};
assert(reconcileLocalBundleMediaManifest(manifest, completeBinding).status === "aligned", "complete media evidence with matching identity must align");
assert(reconcileLocalBundleMediaManifest(manifest, { ...binding, tenantId: "other-tenant" }).status === "mismatch", "tenant drift must be a mismatch");
assert(reconcileLocalBundleMediaManifest(manifest, { ...binding, assets: binding.assets.map((asset) => asset.assetId === "image" ? { ...asset, relativePath: "outside/image.png" } : asset) }).status === "mismatch", "asset path drift must be a mismatch");
assert(reconcileLocalBundleMediaManifest({ ...manifest, artifacts: manifest.artifacts.filter((artifact) => artifact.kind !== "media") }, binding).status === "mismatch", "missing media artifact must be a mismatch");
assert(reconcileLocalBundleMediaManifest({ ...manifest, storageSelectionGateId: "other-storage-gate" }, binding).status === "mismatch", "storage selection drift must be a mismatch");
assert(reconcileLocalBundleMediaManifest(manifest, { ...binding, assets: binding.assets.map((asset) => asset.assetId === "image" ? { ...asset, unitId: "unit-2" } : asset) }).status === "mismatch", "media unit scope drift must be a mismatch");

console.log("PASS local media manifest reconciliation separates identity drift from open evidence without enabling execution.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
