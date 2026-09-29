export type LocalCompanionContinuityStatus = "blocked" | "review-only" | "review-ready";
export type LocalCompanionContinuityLaneStatus = "open" | "passed" | "blocked";

export interface LocalCompanionInstallerEvidence {
  status: LocalCompanionContinuityLaneStatus;
  artifactRef: string;
  checksumRef: string;
  supportedPlatforms: string[];
  installInstructionsRef: string;
  deviceTestRef: string;
}

export interface LocalCompanionUpdateEvidence {
  status: LocalCompanionContinuityLaneStatus;
  currentVersion: string;
  targetVersion: string;
  updateStrategy: "replace-package" | "in-place-migration" | "manual-operator";
  updateInstructionsRef: string;
  migrationPlanRef: string;
  rollbackCheckpointRef: string;
}

export interface LocalCompanionRecoveryEvidence {
  status: LocalCompanionContinuityLaneStatus;
  backupPacketRef: string;
  restoreRehearsalRef: string;
  retentionPolicyRef: string;
  operatorHandoffRef: string;
}

export interface LocalCompanionReleaseContinuityPacket {
  packetId: string;
  tenantId: string;
  packageId: string;
  bundleId: string;
  version: string;
  status: LocalCompanionContinuityStatus;
  installer: LocalCompanionInstallerEvidence;
  updates: LocalCompanionUpdateEvidence;
  recovery: LocalCompanionRecoveryEvidence;
  evidenceBindings: string[];
  missingEvidence: string[];
  installExecutionAllowed: false;
  updateExecutionAllowed: false;
  recoveryExecutionAllowed: false;
  packageWriteAllowed: false;
  routeMutationAllowed: false;
  studentPromotionAllowed: false;
  exportAllowed: false;
  sideEffect: "none";
  blockedActions: string[];
}

const REQUIRED_BLOCKED_ACTIONS = [
  "installer-execution",
  "update-execution",
  "recovery-execution",
  "package-write",
  "route-mutation",
  "student-promotion",
  "export",
] as const;

export function validateLocalCompanionReleaseContinuityPacket(
  packet: LocalCompanionReleaseContinuityPacket,
): string[] {
  const errors: string[] = [];
  for (const field of ["packetId", "tenantId", "packageId", "bundleId", "version"] as const) {
    if (!packet[field].trim()) errors.push(`Local companion continuity packet requires ${field}.`);
  }
  if (!["blocked", "review-only", "review-ready"].includes(packet.status)) {
    errors.push("Local companion continuity packet status is unsupported.");
  }

  if (!packet.installer.artifactRef.trim()) errors.push("Installer evidence requires artifactRef.");
  if (!packet.installer.checksumRef.trim()) errors.push("Installer evidence requires checksumRef.");
  if (packet.installer.supportedPlatforms.length === 0) errors.push("Installer evidence requires supported platforms.");
  if (!packet.installer.installInstructionsRef.trim()) errors.push("Installer evidence requires install instructions.");
  if (!packet.installer.deviceTestRef.trim()) errors.push("Installer evidence requires device test evidence.");

  for (const field of ["currentVersion", "targetVersion", "updateInstructionsRef", "migrationPlanRef", "rollbackCheckpointRef"] as const) {
    if (!packet.updates[field].trim()) errors.push(`Update evidence requires ${field}.`);
  }
  if (!["replace-package", "in-place-migration", "manual-operator"].includes(packet.updates.updateStrategy)) {
    errors.push("Update evidence strategy is unsupported.");
  }

  for (const field of ["backupPacketRef", "restoreRehearsalRef", "retentionPolicyRef", "operatorHandoffRef"] as const) {
    if (!packet.recovery[field].trim()) errors.push(`Recovery evidence requires ${field}.`);
  }

  if (packet.evidenceBindings.length < 3) errors.push("Local companion continuity packet requires evidence bindings.");
  if (packet.missingEvidence.length === 0 && packet.status === "blocked") {
    errors.push("Blocked local companion continuity packet must explain missing evidence.");
  }

  for (const field of [
    "installExecutionAllowed",
    "updateExecutionAllowed",
    "recoveryExecutionAllowed",
    "packageWriteAllowed",
    "routeMutationAllowed",
    "studentPromotionAllowed",
    "exportAllowed",
  ] as const) {
    if (packet[field] !== false) errors.push(`Local companion continuity packet must keep ${field}: false.`);
  }
  if (packet.sideEffect !== "none") errors.push("Local companion continuity packet must have no side effect.");

  const blockedActions = new Set(packet.blockedActions);
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.has(action)) errors.push(`Local companion continuity packet must block ${action}.`);
  }
  return [...new Set(errors)];
}
