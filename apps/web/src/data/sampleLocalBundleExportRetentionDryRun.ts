import {
  validateLocalBundleExportRetentionDryRun,
  type LocalBundleExportRetentionDryRun,
} from "@living-textbook/content-model";
import { sampleStorageSelectionIdentity } from "./sampleStorageSelectionIdentity";

export const sampleLocalBundleExportRetentionDryRun: LocalBundleExportRetentionDryRun = {
  dryRunId: "sample-publisher-local-export-retention-dry-run-001",
  reconciliationId: "sample-publisher-local-recovery-review-001",
  tenantId: "sample-publisher",
  bundleId: "sample-publisher-unit-1-planning",
  packageId: "sample-publisher-l1-u1-routines-package",
  storageSelectionPreflightId: sampleStorageSelectionIdentity.storageSelectionPreflightId,
  storageSelectionGateId: sampleStorageSelectionIdentity.storageSelectionGateId,
  storageSelectionStatus: "blocked",
  storageSelectionAllowed: false,
  mode: "review-only",
  status: "blocked",
  format: "review-json",
  items: [
    { itemId: "content-package", label: "Reviewed content package", category: "content-package", disposition: "include", sourceRef: "content-package.json", reason: "Reviewed curriculum metadata may be represented in a future package manifest." },
    { itemId: "route-registry", label: "QR and route registry", category: "route-registry", disposition: "include", sourceRef: "routes/qr-registry.json", reason: "Stable route metadata is needed for a future closed companion, subject to release approval." },
    { itemId: "game-route-manifest", label: "Curated game route manifest", category: "game-route-manifest", disposition: "include", sourceRef: "games/game-routes.json", reason: "Only reviewed shared-engine routes may be described in a future package." },
    { itemId: "reviewed-media-manifest", label: "Reviewed media manifest", category: "reviewed-media-manifest", disposition: "include", sourceRef: "media/manifest.json", reason: "Rights and checksum references may be carried without copying media files." },
    { itemId: "learner-progress", label: "Learner progress report", category: "learner-progress", disposition: "requires-policy", sourceRef: "policy/report-policy.json", reason: "Retention, teacher access, export, and school policy must be accepted before learner progress is retained or exported." },
    { itemId: "raw-learner-audio", label: "Raw learner audio", category: "raw-learner-audio", disposition: "exclude", sourceRef: "microphone-capture", reason: "Raw learner audio is excluded from the core package and recovery record." },
    { itemId: "learner-transcripts", label: "Learner transcripts", category: "learner-transcripts", disposition: "exclude", sourceRef: "speech-transcription", reason: "Learner transcripts are excluded until a separately approved speech policy exists." },
    { itemId: "credentials", label: "Provider credentials", category: "credentials", disposition: "exclude", sourceRef: "provider-secrets", reason: "Credentials never belong in a content, export, or recovery package." },
  ],
  retention: {
    policyRef: "local-retention-policy-review-required",
    deletionScope: "tenant-package-session",
    retentionDays: null,
    deletionRequiresPolicy: true,
    deletionAction: "blocked",
  },
  exportExecutionAllowed: false,
  retentionDeletionAllowed: false,
  fileCopyAllowed: false,
  learnerDataExportAllowed: false,
  packageWriteAllowed: false,
  routeMutationAllowed: false,
  blockedActions: ["export-execution", "retention-deletion", "file-copy", "learner-data-export", "package-write", "route-mutation"],
  sideEffect: "none",
};

export const sampleLocalBundleExportRetentionDryRunErrors = validateLocalBundleExportRetentionDryRun(sampleLocalBundleExportRetentionDryRun);
