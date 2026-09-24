export type LocalBundleProviderDeploymentChannel = "hosted-managed" | "local-classroom" | "hybrid";
export type LocalBundleProviderApprovalCheckStatus = "passed" | "open" | "blocked";

export interface LocalBundleProviderApprovalCheck {
  checkId: string;
  label: string;
  status: LocalBundleProviderApprovalCheckStatus;
  evidenceRef: string;
  detail: string;
}

export interface LocalBundleProviderApprovalControls {
  retentionPolicyRef: string;
  exportPolicyRef: string;
  backupPolicyRef: string;
  restorePolicyRef: string;
  safeFallbackPolicyRef: string;
  tenantIsolationProofRef: string;
}

export interface LocalBundleProviderApprovalPacket {
  approvalId: string;
  tenantId: string;
  bundleId: string;
  packageId: string;
  storageSelectionPreflightId: string;
  storageSelectionGateId: string;
  storageSelectionStatus: "blocked";
  storageSelectionAllowed: false;
  candidateId: string;
  providerKey: string;
  deploymentChannel: LocalBundleProviderDeploymentChannel;
  mode: "review-only";
  selectedProvider: null;
  providerActivationAllowed: false;
  studentFacingAllowed: false;
  controls: LocalBundleProviderApprovalControls;
  checks: LocalBundleProviderApprovalCheck[];
  rawLearnerAudioExcluded: true;
  rawLearnerTranscriptsExcluded: true;
  learnerDataExportBlocked: true;
  blockedActions: string[];
}

const REQUIRED_CHECKS = [
  "tenant-isolation",
  "retention",
  "export",
  "backup",
  "restore",
  "safe-fallback",
  "data-exclusion",
] as const;

const REQUIRED_BLOCKED_ACTIONS = [
  "provider-activation",
  "student-promotion",
  "package-write",
  "learner-data-export",
] as const;

export function validateLocalBundleProviderApprovalPacket(
  packet: LocalBundleProviderApprovalPacket,
): string[] {
  const errors: string[] = [];
  for (const field of [
    "approvalId",
    "tenantId",
    "bundleId",
    "packageId",
    "storageSelectionPreflightId",
    "storageSelectionGateId",
    "candidateId",
    "providerKey",
  ] as const) {
    if (!packet[field].trim()) errors.push(`Local bundle provider approval requires ${field}.`);
  }
  if (packet.mode !== "review-only") errors.push("Local bundle provider approval must remain review-only.");
  if (packet.selectedProvider !== null) errors.push("Local bundle provider approval must not select a provider.");
  if (packet.storageSelectionStatus !== "blocked") errors.push("Local bundle provider approval storage selection must remain blocked.");
  if (packet.storageSelectionAllowed !== false) errors.push("Local bundle provider approval storage selection must remain false.");
  if (packet.providerActivationAllowed !== false) errors.push("Local bundle provider approval must block provider activation.");
  if (packet.studentFacingAllowed !== false) errors.push("Local bundle provider approval must remain non-student-facing.");
  if (packet.rawLearnerAudioExcluded !== true) errors.push("Local bundle provider approval must exclude raw learner audio.");
  if (packet.rawLearnerTranscriptsExcluded !== true) errors.push("Local bundle provider approval must exclude raw learner transcripts.");
  if (packet.learnerDataExportBlocked !== true) errors.push("Local bundle provider approval must block learner-data export.");

  for (const [field, value] of Object.entries(packet.controls)) {
    if (typeof value !== "string" || !value.trim()) {
      errors.push(`Local bundle provider approval requires controls.${field}.`);
    }
  }

  const checksById = new Map<string, LocalBundleProviderApprovalCheck>();
  for (const check of packet.checks) {
    if (checksById.has(check.checkId)) errors.push(`Local bundle provider approval contains duplicate check ${check.checkId}.`);
    if (!check.evidenceRef.trim()) errors.push(`Local bundle provider approval check ${check.checkId} requires evidenceRef.`);
    checksById.set(check.checkId, check);
  }
  for (const checkId of REQUIRED_CHECKS) {
    if (!checksById.has(checkId)) errors.push(`Local bundle provider approval is missing check ${checkId}.`);
  }
  const blockedActions = new Set(packet.blockedActions);
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.has(action)) errors.push(`Local bundle provider approval must block ${action}.`);
  }

  return [...new Set(errors)];
}
