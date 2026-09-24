import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const output = mkdtempSync(join(tmpdir(), "living-textbook-manifest-rollback-"));
const source = readFileSync(join(root, "packages", "content-model", "src", "localBundlePackageManifestRollbackDryRun.ts"), "utf8");
writeFileSync(join(output, "localBundlePackageManifestRollbackDryRun.js"), ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, "utf8");

try {
  const { validateLocalBundlePackageManifestRollbackDryRun } = require(join(output, "localBundlePackageManifestRollbackDryRun.js"));
  const kinds = ["content", "media", "route", "game", "reporting"];
  const domains = ["qr", "content", "media", "games", "reports", "learner-progress"];
  const dryRun = {
    manifestId: "manifest-1", rollbackDryRunId: "rollback-1", reconciliationId: "reconciliation-1", tenantId: "tenant-1", bundleId: "bundle-1", packageId: "package-1", storageSelectionPreflightId: "storage-preflight-1", storageSelectionGateId: "storage-gate-1", storageSelectionStatus: "blocked", storageSelectionAllowed: false, currentVersion: "2026.1", previousVersion: "2025.1", mode: "review-only", status: "blocked", manifestState: "preview-only",
    artifacts: kinds.map((kind) => ({ artifactId: kind, label: kind, kind, relativePath: `${kind}/manifest.json`, version: "2026.1", checksumStatus: "review-required", readiness: "review-required", sourceRef: `${kind}-source` })),
    rollbackImpacts: domains.map((domain) => ({ impactId: domain, domain, currentVersion: "2026.1", fallbackVersion: "2025.1", fallbackTarget: `${domain}-fallback`, status: "blocked", learnerDataMutationAllowed: false, routeMutationAllowed: false, mediaReplacementAllowed: false, verificationRef: `${domain}-verification` })),
    qrFallbackRule: "Stable QR alias fallback remains reviewed.",
    requiredApprovals: ["release", "rollback"],
    blockedActions: ["manifest-write", "bundle-activation", "qr-mutation", "media-replacement", "game-route-mutation", "report-schema-mutation", "learner-data-deletion", "rollback-execution"],
    manifestWriteAllowed: false, bundleActivationAllowed: false, qrMutationAllowed: false, mediaReplacementAllowed: false, gameRouteMutationAllowed: false, reportSchemaMutationAllowed: false, learnerDataDeletionAllowed: false, rollbackExecutionAllowed: false, sideEffect: "none",
  };
  assert(validateLocalBundlePackageManifestRollbackDryRun(dryRun).length === 0, "complete manifest rollback dry run must validate");
  assert(validateLocalBundlePackageManifestRollbackDryRun({ ...dryRun, artifacts: dryRun.artifacts.map((artifact) => artifact.kind === "route" ? { ...artifact, relativePath: "file:///unsafe" } : artifact) }).some((error) => error.includes("safe relative path")), "unsafe artifact paths must be rejected");
  assert(validateLocalBundlePackageManifestRollbackDryRun({ ...dryRun, rollbackExecutionAllowed: true }).some((error) => error.includes("rollbackExecutionAllowed: false")), "rollback execution must remain blocked");
  assert(validateLocalBundlePackageManifestRollbackDryRun({ ...dryRun, rollbackImpacts: dryRun.rollbackImpacts.filter((impact) => impact.domain !== "qr") }).some((error) => error.includes("cover qr")), "QR rollback impact must be required");
  console.log("PASS local package manifest rollback dry run preserves versions, safe paths, QR fallback, impact coverage, and no-execution boundaries.");
} finally {
  rmSync(output, { recursive: true, force: true });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
