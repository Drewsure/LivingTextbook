import {
  validatePilotReviewDecisionImplementationReadiness,
  type PilotReviewDecisionImplementationReadiness,
} from "@living-textbook/content-model";

export const samplePilotReviewDecisionImplementationReadiness: PilotReviewDecisionImplementationReadiness = {
  readinessId: "sample-publisher-pilot-review-decision-implementation-readiness",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  policyId: "sample-publisher-pilot-review-decision-retention-policy",
  label: "Sample publisher review decision implementation readiness",
  status: "blocked",
  providerNeutral: true,
  snapshotContractValid: true,
  adapterContractValid: true,
  retentionPolicyValid: true,
  retentionPolicyAccepted: false,
  auditPolicyAccepted: false,
  schoolPolicyAccepted: false,
  providerSelectionAllowed: false,
  implementationAllowed: false,
  writesAllowed: false,
  restoreAllowed: false,
  exportAllowed: false,
  activationAllowed: false,
  blockedActions: [
    "No provider selection",
    "No provider implementation",
    "No snapshot write",
    "No snapshot restore",
    "No snapshot export",
    "No review decision activation",
  ],
  requiredEvidence: [
    "Validated snapshot contract",
    "Validated hosted/local adapter rehearsal",
    "Accepted retention and deletion policy",
    "Accepted audit access and retention policy",
    "Accepted school or tenant data policy",
  ],
  nextSteps: [
    "Complete school or publisher policy review.",
    "Select hosted or closed-local deployment only after policy acceptance.",
    "Re-run provider implementation readiness with human approval evidence.",
  ],
  note: "This is the handoff from foundation evidence to a future provider implementation. It is intentionally blocked in the current sample.",
};

export const samplePilotReviewDecisionImplementationReadinessErrors = validatePilotReviewDecisionImplementationReadiness(
  samplePilotReviewDecisionImplementationReadiness,
);
