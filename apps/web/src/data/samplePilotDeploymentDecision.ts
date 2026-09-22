import {
  validatePilotDeploymentDecision,
  type PilotDeploymentDecision,
} from "@living-textbook/content-model";
import { sampleDeploymentDecisionGuide } from "@/data/sampleDeploymentDecisionGuide";
import {
  samplePilotDeploymentDecisionId,
  sampleSchoolPolicyAcceptancePreflightId,
  sampleSchoolPolicyAcceptanceRecordPreviewId,
} from "@/data/samplePilotLineageIds";

export const samplePilotDeploymentDecision: PilotDeploymentDecision = {
  decisionId: samplePilotDeploymentDecisionId,
  tenantId: "sample-publisher",
  packageId: "sample-publisher-l1-u1-routines-package",
  guideId: sampleDeploymentDecisionGuide.guideId,
  recommendedOptionId: "hosted-pwa",
  selectedOptionId: null,
  selectionStatus: "unselected",
  policyAcceptancePreflightId: sampleSchoolPolicyAcceptancePreflightId,
  acceptanceRecordPreviewId: sampleSchoolPolicyAcceptanceRecordPreviewId,
  policyAcceptanceStatus: "not-accepted",
  status: "review-only",
  policyAccepted: false,
  persistenceActivationAllowed: false,
  classroomLaunchAllowed: false,
  sideEffect: "none",
  blockers: [
    "A school or publisher owner has not selected the first pilot deployment model.",
    "Privacy, retention, authorization, release, operations, and cost evidence remain open.",
    "Selecting an option must not activate persistence or classroom launch by itself.",
  ],
  evidenceBindings: [
    `deployment-guide:${sampleDeploymentDecisionGuide.guideId}`,
    "persistence-activation-preflight:sample-publisher-durable-write-activation-preflight",
    "pilot-handoff:sample-publisher-l1-u1-routines-package",
    `school-policy-acceptance-preflight:${sampleSchoolPolicyAcceptancePreflightId}`,
    `school-policy-acceptance-record-preview:${sampleSchoolPolicyAcceptanceRecordPreviewId}`,
  ],
};

export const samplePilotDeploymentDecisionErrors = validatePilotDeploymentDecision(samplePilotDeploymentDecision);
