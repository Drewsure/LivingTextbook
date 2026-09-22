export type PilotReviewDecisionImplementationReadinessStatus = "blocked" | "ready-for-provider-selection" | "implementation-approved";

export interface PilotReviewDecisionImplementationReadiness {
  readinessId: string;
  tenantId: string;
  packageId: string;
  policyId: string;
  label: string;
  status: PilotReviewDecisionImplementationReadinessStatus;
  providerNeutral: true;
  snapshotContractValid: boolean;
  adapterContractValid: boolean;
  retentionPolicyValid: boolean;
  retentionPolicyAccepted: boolean;
  auditPolicyAccepted: boolean;
  schoolPolicyAccepted: boolean;
  providerSelectionAllowed: boolean;
  implementationAllowed: boolean;
  writesAllowed: false;
  restoreAllowed: false;
  exportAllowed: false;
  activationAllowed: false;
  blockedActions: string[];
  requiredEvidence: string[];
  nextSteps: string[];
  note: string;
}

const REQUIRED_BLOCKED_ACTIONS = [
  "No provider selection",
  "No provider implementation",
  "No snapshot write",
  "No snapshot restore",
  "No snapshot export",
  "No review decision activation",
] as const;

export function validatePilotReviewDecisionImplementationReadiness(
  readiness: PilotReviewDecisionImplementationReadiness,
): string[] {
  const errors: string[] = [];
  for (const field of ["readinessId", "tenantId", "packageId", "policyId", "label", "note"] as const) {
    if (typeof readiness[field] !== "string" || readiness[field].trim().length === 0) errors.push(`Pilot review decision implementation readiness ${field} must be non-empty.`);
  }

  if (readiness.providerNeutral !== true) errors.push("Pilot review decision implementation readiness must remain provider-neutral.");
  for (const field of ["snapshotContractValid", "adapterContractValid", "retentionPolicyValid", "retentionPolicyAccepted", "auditPolicyAccepted", "schoolPolicyAccepted", "providerSelectionAllowed", "implementationAllowed"] as const) {
    if (typeof readiness[field] !== "boolean") errors.push(`Pilot review decision implementation readiness ${field} must be boolean.`);
  }
  for (const field of ["writesAllowed", "restoreAllowed", "exportAllowed", "activationAllowed"] as const) {
    if (readiness[field] !== false) errors.push(`Pilot review decision implementation readiness ${field} must remain false.`);
  }
  if (!Array.isArray(readiness.blockedActions)) errors.push("Pilot review decision implementation readiness blockedActions must be an array.");
  for (const action of REQUIRED_BLOCKED_ACTIONS) {
    if (!readiness.blockedActions.includes(action)) errors.push(`Pilot review decision implementation readiness must block: ${action}.`);
  }
  if (!Array.isArray(readiness.requiredEvidence) || readiness.requiredEvidence.length === 0) errors.push("Pilot review decision implementation readiness must list required evidence.");
  if (!Array.isArray(readiness.nextSteps) || readiness.nextSteps.length === 0) errors.push("Pilot review decision implementation readiness must list next steps.");

  const contractsValid = readiness.snapshotContractValid && readiness.adapterContractValid && readiness.retentionPolicyValid;
  const policiesAccepted = readiness.retentionPolicyAccepted && readiness.auditPolicyAccepted && readiness.schoolPolicyAccepted;
  if (readiness.implementationAllowed && (!contractsValid || !policiesAccepted)) errors.push("Implementation approval requires valid contracts and accepted retention, audit, and school policy.");
  if (readiness.providerSelectionAllowed && !policiesAccepted) errors.push("Provider selection requires accepted retention, audit, and school policy.");
  if (readiness.status === "blocked" && (readiness.providerSelectionAllowed || readiness.implementationAllowed)) errors.push("Blocked readiness cannot allow provider selection or implementation.");
  if (readiness.status === "implementation-approved" && !readiness.implementationAllowed) errors.push("Implementation-approved readiness must allow implementation.");
  return [...new Set(errors)];
}
