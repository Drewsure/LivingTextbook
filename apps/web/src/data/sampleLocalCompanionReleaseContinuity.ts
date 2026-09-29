import {
  validateLocalCompanionReleaseContinuityPacket,
  type LocalCompanionReleaseContinuityPacket,
} from "@living-textbook/content-model";

export const sampleLocalCompanionReleaseContinuity: LocalCompanionReleaseContinuityPacket = {
  packetId: "sample-publisher-local-companion-continuity",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  bundleId: "sample-publisher-l1-u1-routines-local-bundle",
  version: "1.0.0",
  status: "blocked",
  installer: {
    status: "blocked",
    artifactRef: "pending:closed-local-installer",
    checksumRef: "pending:installer-sha256",
    supportedPlatforms: ["pending-device-matrix"],
    installInstructionsRef: "pending:operator-install-guide",
    deviceTestRef: "pending:device-rehearsal",
  },
  updates: {
    status: "blocked",
    currentVersion: "1.0.0",
    targetVersion: "pending-next-edition",
    updateStrategy: "replace-package",
    updateInstructionsRef: "pending:edition-update-guide",
    migrationPlanRef: "pending:content-and-local-record-migration",
    rollbackCheckpointRef: "pending:rollback-checkpoint",
  },
  recovery: {
    status: "open",
    backupPacketRef: "sample-publisher-local-bundle-recovery-packet",
    restoreRehearsalRef: "pending:operator-restore-rehearsal",
    retentionPolicyRef: "pending:school-local-retention-policy",
    operatorHandoffRef: "pending:school-operator-handoff",
  },
  evidenceBindings: [
    "package-review:sample-publisher-l1-u1-routines-package",
    "bundle-manifest:sample-publisher-l1-u1-routines-local-bundle",
    "recovery-packet:sample-publisher-local-bundle-recovery-packet",
  ],
  missingEvidence: [
    "Closed-local installer artifact and checksum",
    "Supported device test record",
    "Yearly edition update and migration plan",
    "Operator restore rehearsal and school retention policy",
  ],
  installExecutionAllowed: false,
  updateExecutionAllowed: false,
  recoveryExecutionAllowed: false,
  packageWriteAllowed: false,
  routeMutationAllowed: false,
  studentPromotionAllowed: false,
  exportAllowed: false,
  sideEffect: "none",
  blockedActions: [
    "installer-execution",
    "update-execution",
    "recovery-execution",
    "package-write",
    "route-mutation",
    "student-promotion",
    "export",
  ],
};

export const sampleLocalCompanionReleaseContinuityErrors = validateLocalCompanionReleaseContinuityPacket(
  sampleLocalCompanionReleaseContinuity,
);
