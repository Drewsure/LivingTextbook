import {
  validateTeacherDraftOwnerPolicyBinding,
  validateTeacherDraftOwnerPolicyBindingSources,
  type TeacherDraftOwnerPolicyBinding,
} from "@living-textbook/content-model";
import { sampleSchoolPolicyAcceptancePreflight } from "./sampleSchoolPolicyAcceptancePreflight";
import { sampleSchoolPolicyAcceptanceRecordPreview } from "./sampleSchoolPolicyAcceptanceRecordPreview";
import { sampleTeacherDraftPersistencePreflight } from "./sampleTeacherDraftPersistencePreflight";

export const sampleTeacherDraftOwnerPolicyBinding: TeacherDraftOwnerPolicyBinding = {
  bindingId: "teacher-draft-owner-policy-binding-sample-publisher-l1-u1",
  tenantId: sampleTeacherDraftPersistencePreflight.tenantId,
  draftId: sampleTeacherDraftPersistencePreflight.draftId,
  sourcePackageId: sampleTeacherDraftPersistencePreflight.sourcePackageId,
  draftPersistencePreflightId: sampleTeacherDraftPersistencePreflight.preflightId,
  policyAcceptancePreflightId: sampleSchoolPolicyAcceptancePreflight.preflightId,
  acceptanceRecordPreviewId: sampleSchoolPolicyAcceptanceRecordPreview.previewId,
  mode: "review-only",
  status: "blocked",
  authorizationScope: "tenant-scoped-review-only",
  ownerIdentityRequired: true,
  ownerIdentityBound: false,
  policyAcceptanceStatus: "not-accepted",
  schoolPolicyAccepted: false,
  providerNeutral: true,
  persistenceActivationAllowed: false,
  assignmentAllowed: false,
  blockedActions: [
    "No owner authorization inferred from policy evidence",
    "No policy acceptance inferred from teacher authorization",
    "No persistence activation",
    "No direct student assignment",
    "No acceptance or signature capture",
  ],
  requiredEvidence: [
    "Expiring tenant-scoped teacher operations session",
    "Exact draft persistence admission preflight",
    "School policy acceptance preflight and blocked acceptance preview",
    "Separate school approver identity and policy acceptance record when enabled later",
  ],
  blockers: [
    "No teacher owner identity is bound to this draft persistence preflight.",
    "School policy remains not-accepted and the acceptance record is only a future preview.",
    "Tenant authorization is review-only and cannot activate persistence or assignment.",
  ],
  nextSteps: [
    "Define the tenant-scoped teacher owner role and expiry/revocation rules for a future provider implementation.",
    "Complete school policy and release-candidate review without treating review access as acceptance.",
    "Re-run draft, policy, owner, rights, audio, and persistence reconciliation before a future write work order.",
  ],
};

export const sampleTeacherDraftOwnerPolicyBindingErrors = [
  ...validateTeacherDraftOwnerPolicyBinding(sampleTeacherDraftOwnerPolicyBinding),
  ...validateTeacherDraftOwnerPolicyBindingSources(sampleTeacherDraftOwnerPolicyBinding, sampleTeacherDraftPersistencePreflight, sampleSchoolPolicyAcceptancePreflight, sampleSchoolPolicyAcceptanceRecordPreview),
];
