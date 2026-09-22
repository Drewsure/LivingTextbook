import {
  validateTeacherDraftAcceptanceReadiness,
  validateTeacherDraftAcceptanceReadinessSources,
  type TeacherDraftAcceptanceReadiness,
} from "@living-textbook/content-model";
import { sampleLocalBundleExportRetentionDryRun } from "./sampleLocalBundleExportRetentionDryRun";
import { sampleLocalBundleRecoveryPacket } from "./sampleLocalBundleRecoveryPacket";
import { sampleLocalBundleRecoveryReconciliation } from "./sampleLocalBundleRecoveryReconciliation";
import { samplePersistenceActivationPreflight } from "./samplePersistenceActivationPreflight";
import { samplePilotReviewDecisionRetentionPolicy } from "./samplePilotReviewDecisionRetentionPolicy";
import { sampleSchoolPolicyAcceptanceRecordPreview } from "./sampleSchoolPolicyAcceptanceRecordPreview";
import { sampleTeacherDraftOwnerPolicyBinding } from "./sampleTeacherDraftOwnerPolicyBinding";

export const sampleTeacherDraftAcceptanceReadiness: TeacherDraftAcceptanceReadiness = {
  readinessId: "teacher-draft-acceptance-readiness-sample-publisher-l1-u1",
  tenantId: sampleTeacherDraftOwnerPolicyBinding.tenantId,
  draftId: sampleTeacherDraftOwnerPolicyBinding.draftId,
  sourcePackageId: sampleTeacherDraftOwnerPolicyBinding.sourcePackageId,
  releaseCandidate: sampleSchoolPolicyAcceptanceRecordPreview.releaseCandidate,
  ownerPolicyBindingId: sampleTeacherDraftOwnerPolicyBinding.bindingId,
  acceptanceRecordPreviewId: sampleSchoolPolicyAcceptanceRecordPreview.previewId,
  retentionPolicyId: samplePilotReviewDecisionRetentionPolicy.policyId,
  persistenceActivationPreflightId: samplePersistenceActivationPreflight.packetId,
  exportRetentionDryRunId: sampleLocalBundleExportRetentionDryRun.dryRunId,
  recoveryPacketId: sampleLocalBundleRecoveryPacket.packetId,
  mode: "review-only",
  status: "blocked",
  policyAcceptanceStatus: "not-accepted",
  providerNeutral: true,
  retentionAccepted: false,
  exportAllowed: false,
  rollbackAllowed: false,
  persistenceActivationAllowed: false,
  assignmentAllowed: false,
  signatureCaptureAllowed: false,
  requiredEvidence: [
    "Tenant-scoped owner/policy identity binding",
    "Versioned acceptance record preview bound to the release candidate",
    "Retention and deletion policy with raw audio/transcript exclusion",
    "Hosted/local activation, export, backup, restore, and rollback evidence",
  ],
  blockers: [
    "School policy acceptance remains blocked and no accepted terms may be stored.",
    "Retention, provider activation, export, backup, restore, and rollback evidence remains review-only.",
    "The teacher draft is not eligible for persistence, assignment, or package promotion.",
  ],
  blockedActions: [
    "No accepted terms stored",
    "No storage activation",
    "No learner data export",
    "No retention deletion execution",
    "No rollback execution",
    "No signature capture",
    "No direct student assignment",
  ],
  nextSteps: [
    "Complete school or publisher policy review for the exact release candidate and package scope.",
    "Bind retention, deletion, export, backup, restore, and rollback owners without storing learner media or transcripts.",
    "Reconcile the provider-specific implementation plan only after the acceptance and activation gates are accepted by the appropriate human owners.",
  ],
};

export const sampleTeacherDraftAcceptanceReadinessErrors = [
  ...validateTeacherDraftAcceptanceReadiness(sampleTeacherDraftAcceptanceReadiness),
  ...validateTeacherDraftAcceptanceReadinessSources(
    sampleTeacherDraftAcceptanceReadiness,
    sampleTeacherDraftOwnerPolicyBinding,
    sampleSchoolPolicyAcceptanceRecordPreview,
    samplePilotReviewDecisionRetentionPolicy,
    samplePersistenceActivationPreflight,
    sampleLocalBundleExportRetentionDryRun,
    sampleLocalBundleRecoveryReconciliation,
  ),
];
