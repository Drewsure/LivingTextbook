import {
  getPilotReviewDecisionRetentionPolicyWarnings,
  validatePilotReviewDecisionRetentionPolicy,
  type PilotReviewDecisionRetentionPolicy,
} from "@living-textbook/content-model";

export const samplePilotReviewDecisionRetentionPolicy: PilotReviewDecisionRetentionPolicy = {
  policyId: "sample-publisher-pilot-review-decision-retention-policy",
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  label: "Sample publisher pilot review decision retention policy",
  readiness: "review-only",
  reviewDecisionSnapshotRetentionDays: 90,
  auditTrailRetentionDays: 365,
  retentionPolicyAccepted: false,
  auditPolicyAccepted: false,
  schoolPolicyAccepted: false,
  snapshotWriteAllowed: false,
  restoreAllowed: false,
  exportAllowed: false,
  activationAllowed: false,
  deletionRequired: true,
  rawAudioRetentionAllowed: false,
  transcriptRetentionAllowed: false,
  requiredEvidence: [
    "Retention period and deletion owner",
    "Audit access and review schedule",
    "School or tenant policy approval",
    "Hosted/local backup and restore boundary",
  ],
  blockedActions: [
    "No snapshot write",
    "No snapshot restore",
    "No snapshot export",
    "No review decision activation",
  ],
  nextSteps: [
    "Agree retention and deletion periods with the school or publisher.",
    "Define audit access, reviewer identity, and evidence retention.",
    "Accept the policy before any production snapshot write is implemented.",
  ],
  note: "This policy is review-only. It describes the gates a real provider must satisfy without enabling storage or classroom launch.",
};

export const samplePilotReviewDecisionRetentionPolicyErrors = validatePilotReviewDecisionRetentionPolicy(samplePilotReviewDecisionRetentionPolicy);
export const samplePilotReviewDecisionRetentionPolicyWarnings = getPilotReviewDecisionRetentionPolicyWarnings(samplePilotReviewDecisionRetentionPolicy);
