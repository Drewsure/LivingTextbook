import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-media-release-control-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "localBundleMediaReleaseControlBinding.ts"), "utf8");
writeFileSync(join(output, "localBundleMediaReleaseControlBinding.js"), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText);

const { deriveLocalBundleMediaReleaseControlBinding, validateLocalBundleMediaReleaseControlBinding } = await import(`file://${join(output, "localBundleMediaReleaseControlBinding.js").replaceAll("\\", "/")}`);
const reconciliation = {
  reconciliationId: "binding-1:manifest-1",
  manifestId: "manifest-1",
  bindingId: "binding-1",
  tenantId: "tenant-1",
  bundleId: "bundle-1",
  packageId: "package-1",
  packageVersion: "2026.1-preview",
  status: "needs-evidence",
  identityMatches: true,
  mediaArtifactFound: true,
  mediaArtifactPath: "media/manifest.json",
  pathMatches: true,
  versionMatches: true,
  bindingErrors: [],
  openEvidenceChecks: ["audio: rights evidence"],
  mismatchChecks: [],
  blockedActions: ["media-copy", "package-write", "local-activation", "student-promotion", "qr-mutation"],
  localActivationAllowed: false,
  studentFacingAllowed: false,
  sideEffect: "none",
  reasons: ["Media evidence remains open.", "Media copy remains blocked."],
};

const binding = deriveLocalBundleMediaReleaseControlBinding(reconciliation, {
  releaseGateId: "gate-1",
  releaseGateTenantId: "tenant-1",
  releaseGatePackageId: "package-1",
  releaseGateMediaStatus: "needs-review",
  requiredApprovals: ["Media rights approval", "Package release gate"],
});
assert(binding.decision === "needs-review", "open reconciliation and media gate must remain needs-review");
assert(validateLocalBundleMediaReleaseControlBinding(binding).length === 0, "derived release-control binding must validate");
assert(binding.promotionAllowed === false && binding.studentFacingAllowed === false && binding.localActivationAllowed === false && binding.sideEffect === "none", "release-control binding must remain non-executing");
assert(deriveLocalBundleMediaReleaseControlBinding(reconciliation, {
  releaseGateId: "gate-1",
  releaseGateTenantId: "other-tenant",
  releaseGatePackageId: "package-1",
  releaseGateMediaStatus: "ready",
  requiredApprovals: ["Media rights approval"],
}).decision === "blocked", "release gate tenant drift must block the decision");
assert(validateLocalBundleMediaReleaseControlBinding({ ...binding, blockedActions: [] }).length > 0, "missing blocked actions must fail validation");

console.log("PASS local media release-control binding derives a blocked review decision without enabling promotion.");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
