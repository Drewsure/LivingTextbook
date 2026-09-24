import {
  ASSIST_LANGUAGE_AUDIO_REVIEWER_GATE_BINDING_BLOCKED_ACTIONS,
  createReviewOnlyAssistLanguageAudioCatalogReviewerGateBinding,
  type AssistLanguageAudioCatalogApprovalReconciliation,
  type AssistLanguageAudioCatalogReviewerGateBinding,
} from "@living-textbook/content-model";
import type { ReviewerIdentitySignatureGate } from "./sampleReviewerIdentitySignatureGate";

const requiredReviewerLanes = [
  "Authenticated reviewer identity lane",
  "Approval intent lane",
  "Signature policy lane",
  "Audit and retention lane",
];

export function buildAssistLanguageAudioCatalogReviewerGateBindings(
  reconciliations: AssistLanguageAudioCatalogApprovalReconciliation[],
  gate?: ReviewerIdentitySignatureGate,
): AssistLanguageAudioCatalogReviewerGateBinding[] {
  return reconciliations.map((reconciliation) => {
    const scopeDrift = gate && gate.tenantId !== reconciliation.tenantId
      ? [`Reviewer gate tenant ${gate.tenantId} does not match ${reconciliation.tenantId}`]
      : [];
    const unresolvedRequirements = gate
      ? [
        gate.identityStatus,
        gate.signatureStatus,
        gate.approvalCaptureStatus,
        ...gate.lanes.flatMap((lane) => lane.requiredBeforeApproval.map((requirement) => `${lane.label}: ${requirement}`)),
      ]
      : ["Reviewer identity and signature gate is not configured for this tenant."];
    const status = gate && scopeDrift.length === 0 && reconciliation.status === "reconciliation-review-ready"
      ? "reviewer-gate-review-ready"
      : "blocked-preview";

    return createReviewOnlyAssistLanguageAudioCatalogReviewerGateBinding({
      reconciliationId: reconciliation.reconciliationId,
      reviewerGateId: gate?.gateId ?? `not-configured:${reconciliation.tenantId}`,
      tenantId: reconciliation.tenantId,
      packageId: reconciliation.packageId,
      unitKey: reconciliation.unitKey,
      status,
      gateIdentityStatus: gate?.identityStatus ?? "Reviewer gate not configured",
      gateSignatureStatus: gate?.signatureStatus ?? "Signature policy not configured",
      gateApprovalCaptureStatus: gate?.approvalCaptureStatus ?? "Approval capture not configured",
      requiredReviewerLanes: gate?.lanes.map((lane) => lane.label) ?? requiredReviewerLanes,
      unresolvedRequirements: [...new Set(unresolvedRequirements)],
      scopeDrift,
      blockedActions: [...ASSIST_LANGUAGE_AUDIO_REVIEWER_GATE_BINDING_BLOCKED_ACTIONS],
    });
  });
}
