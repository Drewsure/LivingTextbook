import {
  validateLocalBundleProviderApprovalPacket,
  type LocalBundleProviderApprovalPacket,
} from "@living-textbook/content-model";
import { sampleStorageSelectionIdentity } from "./sampleStorageSelectionIdentity";

export const sampleLocalBundleProviderApproval: LocalBundleProviderApprovalPacket = {
  approvalId: "sample-publisher-local-provider-review-001",
  tenantId: "sample-publisher",
  bundleId: "sample-publisher-unit-1-planning",
  packageId: "sample-publisher-l1-u1-routines-package",
  storageSelectionPreflightId: sampleStorageSelectionIdentity.storageSelectionPreflightId,
  storageSelectionGateId: sampleStorageSelectionIdentity.storageSelectionGateId,
  storageSelectionStatus: "blocked",
  storageSelectionAllowed: false,
  candidateId: "closed-local-companion-candidate",
  providerKey: "unselected-provider-candidate",
  deploymentChannel: "local-classroom",
  mode: "review-only",
  selectedProvider: null,
  providerActivationAllowed: false,
  studentFacingAllowed: false,
  controls: {
    retentionPolicyRef: "retention-policy-review-required",
    exportPolicyRef: "export-policy-review-required",
    backupPolicyRef: "backup-policy-review-required",
    restorePolicyRef: "restore-policy-review-required",
    safeFallbackPolicyRef: "safe-fallback-policy-review-required",
    tenantIsolationProofRef: "tenant-isolation-proof-review-required",
  },
  checks: [
    { checkId: "tenant-isolation", label: "Tenant isolation", status: "open", evidenceRef: "tenant-isolation-proof-review-required", detail: "Provider scope and cross-tenant rejection evidence remain open." },
    { checkId: "retention", label: "Retention", status: "open", evidenceRef: "retention-policy-review-required", detail: "Retention and deletion rules require school or publisher policy." },
    { checkId: "export", label: "Export", status: "open", evidenceRef: "export-policy-review-required", detail: "Export format, authorization, and learner-data exclusions require review." },
    { checkId: "backup", label: "Backup", status: "open", evidenceRef: "backup-policy-review-required", detail: "Backup manifest, checksum, and restore-point rules require review." },
    { checkId: "restore", label: "Restore", status: "open", evidenceRef: "restore-policy-review-required", detail: "Restore rehearsal and rollback evidence require review." },
    { checkId: "safe-fallback", label: "Safe fallback", status: "open", evidenceRef: "safe-fallback-policy-review-required", detail: "Closed-package fallback must preserve printed QR and child-safe route behavior." },
    { checkId: "data-exclusion", label: "Data exclusion", status: "passed", evidenceRef: "core-storage-data-boundary-v1", detail: "Raw learner audio and transcripts remain outside the core record." },
  ],
  rawLearnerAudioExcluded: true,
  rawLearnerTranscriptsExcluded: true,
  learnerDataExportBlocked: true,
  blockedActions: ["provider-activation", "student-promotion", "package-write", "learner-data-export"],
};

export const sampleLocalBundleProviderApprovalErrors = validateLocalBundleProviderApprovalPacket(sampleLocalBundleProviderApproval);
