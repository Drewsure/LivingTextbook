import {
  validateLocalBundlePackageManifestRollbackDryRun,
  type LocalBundlePackageManifestRollbackDryRun,
} from "@living-textbook/content-model";
import { sampleStorageSelectionIdentity } from "./sampleStorageSelectionIdentity";

const impactDomains = ["qr", "content", "media", "games", "reports", "learner-progress"] as const;

export const sampleLocalBundlePackageManifestRollbackDryRun: LocalBundlePackageManifestRollbackDryRun = {
  manifestId: "sample-publisher-l1-u1-local-manifest-preview-001",
  rollbackDryRunId: "sample-publisher-l1-u1-rollback-preview-001",
  reconciliationId: "sample-publisher-local-recovery-review-001",
  tenantId: "sample-publisher",
  bundleId: "sample-publisher-unit-1-planning",
  packageId: "sample-publisher-l1-u1-routines-package",
  storageSelectionPreflightId: sampleStorageSelectionIdentity.storageSelectionPreflightId,
  storageSelectionGateId: sampleStorageSelectionIdentity.storageSelectionGateId,
  storageSelectionStatus: "blocked",
  storageSelectionAllowed: false,
  currentVersion: "2026.1-preview",
  previousVersion: "2025.1-legacy",
  mode: "review-only",
  status: "blocked",
  manifestState: "preview-only",
  artifacts: [
    { artifactId: "content", label: "Reviewed content package", kind: "content", relativePath: "content/content-package.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "ready-preview", sourceRef: "content-package.json" },
    { artifactId: "media", label: "Reviewed media manifest", kind: "media", relativePath: "media/manifest.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "review-required", sourceRef: "media-rights-manifest" },
    { artifactId: "routes", label: "Stable QR route registry", kind: "route", relativePath: "routes/qr-registry.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "review-required", sourceRef: "edition-qr-alias-plan" },
    { artifactId: "games", label: "Curated game route manifest", kind: "game", relativePath: "games/game-routes.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "review-required", sourceRef: "curated-activity-pathways" },
    { artifactId: "reporting", label: "Teacher report policy", kind: "reporting", relativePath: "policy/report-policy.json", version: "2026.1-preview", checksumStatus: "review-required", readiness: "review-required", sourceRef: "teacher-report-policy" },
  ],
  rollbackImpacts: impactDomains.map((domain) => ({
    impactId: `rollback-${domain}`,
    domain,
    currentVersion: "2026.1-preview",
    fallbackVersion: "2025.1-legacy",
    fallbackTarget: domain === "qr" ? "/enter/sample-publisher?edition=2025" : `legacy-${domain}-manifest-preview`,
    status: "blocked",
    learnerDataMutationAllowed: false,
    routeMutationAllowed: false,
    mediaReplacementAllowed: false,
    verificationRef: `rollback-${domain}-review-required`,
  })),
  qrFallbackRule: "Printed QR aliases resolve a stable reviewed front door and retain a safe legacy-edition message as fallback.",
  requiredApprovals: ["Package release gate", "Media rights and checksum review", "QR alias rollback review", "Teacher report policy", "School or publisher release acceptance"],
  blockedActions: ["manifest-write", "bundle-activation", "qr-mutation", "media-replacement", "game-route-mutation", "report-schema-mutation", "learner-data-deletion", "rollback-execution"],
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

export const sampleLocalBundlePackageManifestRollbackDryRunErrors = validateLocalBundlePackageManifestRollbackDryRun(sampleLocalBundlePackageManifestRollbackDryRun);
