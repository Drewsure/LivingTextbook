export type LocalBundleRecoveryLaneStatus = "passed" | "open" | "blocked";

export interface LocalBundleRecoveryBackupLane {
  status: LocalBundleRecoveryLaneStatus;
  manifestRef: string;
  checksumRef: string;
  checksumAlgorithm: "sha256";
  schemaVersion: string;
  rawLearnerAudioExcluded: true;
  learnerTranscriptsExcluded: true;
}

export interface LocalBundleRecoveryRestoreLane {
  status: LocalBundleRecoveryLaneStatus;
  sourceManifestRef: string;
  rehearsalRef: string;
  rollbackRef: string;
  crossTenantRestoreBlocked: true;
}

export interface LocalBundleRecoveryExportLane {
  status: LocalBundleRecoveryLaneStatus;
  format: "review-json" | "bundle-manifest";
  policyRef: string;
  includesLearnerData: false;
  includesRawMedia: false;
  includesCredentials: false;
}

export interface LocalBundleRecoveryRetentionLane {
  status: LocalBundleRecoveryLaneStatus;
  policyRef: string;
  retentionDays: number | null;
  deletionScope: "tenant-package-session";
  deletionRequiresPolicy: true;
}

export interface LocalBundleRecoveryPacket {
  packetId: string;
  tenantId: string;
  bundleId: string;
  packageId: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionStatus: "blocked";
  storageSelectionAllowed: false;
  mode: "review-only";
  selectedProvider: null;
  backupExecutionAllowed: false;
  restoreExecutionAllowed: false;
  exportExecutionAllowed: false;
  packageWriteAllowed: false;
  studentPromotionAllowed: false;
  routeMutationAllowed: false;
  backup: LocalBundleRecoveryBackupLane;
  restore: LocalBundleRecoveryRestoreLane;
  export: LocalBundleRecoveryExportLane;
  retention: LocalBundleRecoveryRetentionLane;
  blockedActions: string[];
}

const REQUIRED_BLOCKED_ACTIONS = [
  "backup-execution",
  "restore-execution",
  "export-execution",
  "package-write",
  "student-promotion",
  "route-mutation",
] as const;

export function validateLocalBundleRecoveryPacket(packet: LocalBundleRecoveryPacket): string[] {
  const errors: string[] = [];
  for (const field of ["packetId", "tenantId", "bundleId", "packageId", "storageSelectionPreflightId", "storageSelectionGateId"] as const) {
    if (!packet[field].trim()) errors.push(`Local bundle recovery packet requires ${field}.`);
  }
  if (packet.mode !== "review-only") errors.push("Local bundle recovery packet must remain review-only.");
  if (packet.selectedProvider !== null) errors.push("Local bundle recovery packet must not select a provider.");
  if (packet.storageSelectionStatus !== "blocked") errors.push("Local bundle recovery packet storage selection must remain blocked.");
  if (packet.storageSelectionAllowed !== false) errors.push("Local bundle recovery packet storage selection must remain false.");
  for (const [field, value] of Object.entries({
    backupExecutionAllowed: packet.backupExecutionAllowed,
    restoreExecutionAllowed: packet.restoreExecutionAllowed,
    exportExecutionAllowed: packet.exportExecutionAllowed,
    packageWriteAllowed: packet.packageWriteAllowed,
    studentPromotionAllowed: packet.studentPromotionAllowed,
    routeMutationAllowed: packet.routeMutationAllowed,
  })) {
    if (value !== false) errors.push(`Local bundle recovery packet must keep ${field}: false.`);
  }

  if (!packet.backup.manifestRef.trim() || !packet.backup.checksumRef.trim()) {
    errors.push("Local bundle recovery backup lane requires manifest and checksum references.");
  }
  if (packet.backup.checksumAlgorithm !== "sha256") {
    errors.push("Local bundle recovery backup lane must use SHA-256 checksums.");
  }
  if (packet.backup.schemaVersion.trim() === "") errors.push("Local bundle recovery backup lane requires schemaVersion.");
  if (packet.backup.rawLearnerAudioExcluded !== true) errors.push("Local bundle recovery backup lane must exclude raw learner audio.");
  if (packet.backup.learnerTranscriptsExcluded !== true) errors.push("Local bundle recovery backup lane must exclude learner transcripts.");

  for (const field of ["sourceManifestRef", "rehearsalRef", "rollbackRef"] as const) {
    if (!packet.restore[field].trim()) errors.push(`Local bundle recovery restore lane requires ${field}.`);
  }
  if (packet.restore.crossTenantRestoreBlocked !== true) errors.push("Local bundle recovery restore lane must block cross-tenant restore.");

  if (!packet.export.policyRef.trim()) errors.push("Local bundle recovery export lane requires policyRef.");
  if (packet.export.includesLearnerData !== false) errors.push("Local bundle recovery export must exclude learner data.");
  if (packet.export.includesRawMedia !== false) errors.push("Local bundle recovery export must exclude raw media.");
  if (packet.export.includesCredentials !== false) errors.push("Local bundle recovery export must exclude credentials.");

  if (!packet.retention.policyRef.trim()) errors.push("Local bundle recovery retention lane requires policyRef.");
  if (packet.retention.retentionDays !== null && (!Number.isInteger(packet.retention.retentionDays) || packet.retention.retentionDays <= 0)) {
    errors.push("Local bundle recovery retentionDays must be null or a positive integer.");
  }
  if (packet.retention.deletionScope !== "tenant-package-session") errors.push("Local bundle recovery retention must use tenant-package-session scope.");
  if (packet.retention.deletionRequiresPolicy !== true) errors.push("Local bundle recovery deletion must require policy.");

  const blockedActions = new Set(packet.blockedActions);
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.has(action)) errors.push(`Local bundle recovery packet must block ${action}.`);
  }
  return [...new Set(errors)];
}
