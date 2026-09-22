export type PilotReviewDecisionRetentionPolicyReadiness = "review-only" | "accepted-for-implementation";

export interface PilotReviewDecisionRetentionPolicy {
  policyId: string;
  tenantId: string;
  packageId: string;
  label: string;
  readiness: PilotReviewDecisionRetentionPolicyReadiness;
  reviewDecisionSnapshotRetentionDays: number;
  auditTrailRetentionDays: number;
  retentionPolicyAccepted: boolean;
  auditPolicyAccepted: boolean;
  schoolPolicyAccepted: boolean;
  snapshotWriteAllowed: boolean;
  restoreAllowed: boolean;
  exportAllowed: boolean;
  activationAllowed: boolean;
  deletionRequired: true;
  rawAudioRetentionAllowed: false;
  transcriptRetentionAllowed: false;
  requiredEvidence: string[];
  blockedActions: string[];
  nextSteps: string[];
  note: string;
}

const REQUIRED_BLOCKED_ACTIONS = [
  "No snapshot write",
  "No snapshot restore",
  "No snapshot export",
  "No review decision activation",
] as const;

export function validatePilotReviewDecisionRetentionPolicy(policy: PilotReviewDecisionRetentionPolicy): string[] {
  const errors: string[] = [];
  for (const field of ["policyId", "tenantId", "packageId", "label", "note"] as const) {
    if (typeof policy[field] !== "string" || policy[field].trim().length === 0) errors.push(`Pilot review decision retention policy ${field} must be non-empty.`);
  }

  if (!Number.isInteger(policy.reviewDecisionSnapshotRetentionDays) || policy.reviewDecisionSnapshotRetentionDays <= 0) {
    errors.push("Pilot review decision retention policy must define a positive snapshot retention period.");
  }
  if (!Number.isInteger(policy.auditTrailRetentionDays) || policy.auditTrailRetentionDays <= 0) {
    errors.push("Pilot review decision retention policy must define a positive audit retention period.");
  }
  if (policy.deletionRequired !== true) errors.push("Pilot review decision retention policy must require deletion support.");
  if (policy.rawAudioRetentionAllowed !== false) errors.push("Pilot review decision retention policy must reject raw audio retention.");
  if (policy.transcriptRetentionAllowed !== false) errors.push("Pilot review decision retention policy must reject transcript retention.");
  if (!Array.isArray(policy.requiredEvidence) || policy.requiredEvidence.length === 0) errors.push("Pilot review decision retention policy must list required evidence.");
  if (!Array.isArray(policy.nextSteps) || policy.nextSteps.length === 0) errors.push("Pilot review decision retention policy must list next steps.");
  if (!Array.isArray(policy.blockedActions)) errors.push("Pilot review decision retention policy blockedActions must be an array.");
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!policy.blockedActions.includes(action)) errors.push(`Pilot review decision retention policy must block: ${action}.`);
  }

  if (policy.readiness === "review-only") {
    for (const [field, value] of Object.entries({
      snapshotWriteAllowed: policy.snapshotWriteAllowed,
      restoreAllowed: policy.restoreAllowed,
      exportAllowed: policy.exportAllowed,
      activationAllowed: policy.activationAllowed,
    })) {
      if (value !== false) errors.push(`Review-only retention policy ${field} must remain false.`);
    }
  }

  if (policy.snapshotWriteAllowed) {
    if (!policy.retentionPolicyAccepted) errors.push("Snapshot writes require accepted retention policy.");
    if (!policy.auditPolicyAccepted) errors.push("Snapshot writes require accepted audit policy.");
    if (!policy.schoolPolicyAccepted) errors.push("Snapshot writes require accepted school policy.");
    if (policy.readiness !== "accepted-for-implementation") errors.push("Snapshot writes require accepted-for-implementation readiness.");
  }

  if (policy.activationAllowed) errors.push("Pilot review decision retention policy must never authorize activation.");
  return [...new Set(errors)];
}

export function getPilotReviewDecisionRetentionPolicyWarnings(policy: PilotReviewDecisionRetentionPolicy): string[] {
  const warnings: string[] = [];
  if (!policy.retentionPolicyAccepted) warnings.push("Retention policy acceptance is still required.");
  if (!policy.auditPolicyAccepted) warnings.push("Audit policy acceptance is still required.");
  if (!policy.schoolPolicyAccepted) warnings.push("School policy acceptance is still required.");
  if (policy.readiness !== "accepted-for-implementation") warnings.push("Review decision snapshot writes remain unavailable.");
  return warnings;
}
