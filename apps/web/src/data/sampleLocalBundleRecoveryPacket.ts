import {
  validateLocalBundleRecoveryPacket,
  type LocalBundleRecoveryPacket,
} from "@living-textbook/content-model";

export const sampleLocalBundleRecoveryPacket: LocalBundleRecoveryPacket = {
  packetId: "sample-publisher-local-recovery-review-001",
  tenantId: "sample-publisher",
  bundleId: "sample-publisher-unit-1-planning",
  packageId: "sample-publisher-l1-u1-routines-package",
  mode: "review-only",
  selectedProvider: null,
  backupExecutionAllowed: false,
  restoreExecutionAllowed: false,
  exportExecutionAllowed: false,
  packageWriteAllowed: false,
  studentPromotionAllowed: false,
  routeMutationAllowed: false,
  backup: {
    status: "blocked",
    manifestRef: "local-backup-manifest-review-required",
    checksumRef: "local-backup-sha256-review-required",
    checksumAlgorithm: "sha256",
    schemaVersion: "review-schema-v1",
    rawLearnerAudioExcluded: true,
    learnerTranscriptsExcluded: true,
  },
  restore: {
    status: "blocked",
    sourceManifestRef: "local-backup-manifest-review-required",
    rehearsalRef: "temporary-restore-rehearsal-review-required",
    rollbackRef: "rollback-checkpoint-review-required",
    crossTenantRestoreBlocked: true,
  },
  export: {
    status: "blocked",
    format: "review-json",
    policyRef: "local-export-policy-review-required",
    includesLearnerData: false,
    includesRawMedia: false,
    includesCredentials: false,
  },
  retention: {
    status: "open",
    policyRef: "local-retention-policy-review-required",
    retentionDays: null,
    deletionScope: "tenant-package-session",
    deletionRequiresPolicy: true,
  },
  blockedActions: ["backup-execution", "restore-execution", "export-execution", "package-write", "student-promotion", "route-mutation"],
};

export const sampleLocalBundleRecoveryPacketErrors = validateLocalBundleRecoveryPacket(sampleLocalBundleRecoveryPacket);
