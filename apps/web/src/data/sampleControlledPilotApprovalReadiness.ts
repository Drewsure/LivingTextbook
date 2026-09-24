import {
  createBrowserPrivacyTenantEvidencePilotBinding,
  createBrowserPrivacyTenantEvidenceReleaseBinding,
  createControlledPilotApprovalReadiness,
  validateControlledPilotApprovalReadiness,
  type ControlledPilotApprovalReadiness,
} from "@living-textbook/content-model";
import { samplePilotReviewDecision } from "@/data/samplePilotReviewDecision";
import { sampleReviewerIdentitySignatureGate } from "@/data/sampleReviewerIdentitySignatureGate";
import { samplePersistenceProviderSelectionPreflight } from "@/data/samplePersistenceProviderSelectionPreflight";
import { sampleWhiteLabelReleaseReadiness } from "@/data/sampleWhiteLabelReleaseReadiness";

const samplePilotBinding = createBrowserPrivacyTenantEvidencePilotBinding(undefined, samplePilotReviewDecision);
const sampleReleaseBinding = createBrowserPrivacyTenantEvidenceReleaseBinding(sampleWhiteLabelReleaseReadiness, samplePilotBinding);

export const sampleControlledPilotApprovalReadiness: ControlledPilotApprovalReadiness = createControlledPilotApprovalReadiness({
  readiness: sampleWhiteLabelReleaseReadiness,
  releaseBinding: sampleReleaseBinding,
  pilotDecision: samplePilotReviewDecision,
    reviewerGate: {
    gateId: sampleReviewerIdentitySignatureGate.gateId,
    tenantId: sampleReviewerIdentitySignatureGate.tenantId,
    identityReady: false,
    signaturePolicyReady: false,
    approvalCaptureReady: false,
      blockedActions: sampleReviewerIdentitySignatureGate.blockedActions,
    },
    storageSelection: samplePersistenceProviderSelectionPreflight,
  });

export const sampleControlledPilotApprovalReadinessErrors = validateControlledPilotApprovalReadiness(
  sampleControlledPilotApprovalReadiness,
);
