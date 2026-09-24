import {
  ASSIST_LANGUAGE_AUDIO_RELEASE_REVIEW_BLOCKED_ACTIONS,
  ASSIST_LANGUAGE_AUDIO_RELEASE_REVIEW_REQUIRED_RECORDS,
  createReviewOnlyAssistLanguageAudioCatalogReleaseReviewBinding,
  type AssistLanguageAudioCatalogApprovalReconciliation,
  type AssistLanguageAudioCatalogReleaseReviewBinding,
  type AssistLanguageAudioCatalogReviewerGateBinding,
  type ControlledPilotHumanReviewPacket,
  type WhiteLabelReleaseReadiness,
} from "@living-textbook/content-model";

export function buildAssistLanguageAudioCatalogReleaseReviewBindings(
  reconciliations: AssistLanguageAudioCatalogApprovalReconciliation[],
  reviewerBindings: AssistLanguageAudioCatalogReviewerGateBinding[],
  releaseReadiness?: WhiteLabelReleaseReadiness,
  humanReviewPacket?: ControlledPilotHumanReviewPacket,
): AssistLanguageAudioCatalogReleaseReviewBinding[] {
  return reconciliations.map((reconciliation) => {
    const reviewerBinding = reviewerBindings.find((candidate) => candidate.reconciliationId === reconciliation.reconciliationId);
    const scopeDrift: string[] = [];
    if (!reviewerBinding) scopeDrift.push("Reviewer gate binding is missing for this reconciliation.");
    if (releaseReadiness && (releaseReadiness.tenantId !== reconciliation.tenantId || releaseReadiness.packageId !== reconciliation.packageId)) {
      scopeDrift.push("Release readiness scope does not match the assist-audio reconciliation scope.");
    }
    if (humanReviewPacket && (humanReviewPacket.tenantId !== reconciliation.tenantId || humanReviewPacket.packageId !== reconciliation.packageId)) {
      scopeDrift.push("Human review packet scope does not match the assist-audio reconciliation scope.");
    }

    const blockingReasons = [
      ...ASSIST_LANGUAGE_AUDIO_RELEASE_REVIEW_BLOCKED_ACTIONS,
      ...(reconciliation.status === "reconciliation-review-ready" ? [] : ["Assist-audio evidence reconciliation remains blocked."]),
      ...(reviewerBinding?.status === "reviewer-gate-review-ready" ? [] : ["Reviewer identity/signature gate remains blocked."]),
      ...(reviewerBinding?.unresolvedRequirements ?? ["Reviewer gate binding is not configured for this tenant."]),
      ...(releaseReadiness?.status === "pilot-ready" ? [] : [releaseReadiness ? `White-label release readiness remains ${releaseReadiness.status}.` : "White-label release readiness is not configured for this tenant."]),
      ...(releaseReadiness && releaseReadiness.releaseControlEvidence.status === "pilot-ready" ? [] : [releaseReadiness ? `Release control remains ${releaseReadiness.releaseControlEvidence.status}.` : "Release-control evidence is not configured for this tenant."]),
      ...(humanReviewPacket?.status === "awaiting-human-review" ? [] : [humanReviewPacket ? `Human review packet remains ${humanReviewPacket.status}.` : "Human review packet is not configured for this tenant."]),
      ...scopeDrift,
    ];
    const uniqueBlockingReasons = [...new Set(blockingReasons)];
    const status = uniqueBlockingReasons.length === ASSIST_LANGUAGE_AUDIO_RELEASE_REVIEW_BLOCKED_ACTIONS.length
      ? "review-ready-after-evidence"
      : "blocked-preview";

    return createReviewOnlyAssistLanguageAudioCatalogReleaseReviewBinding({
      reconciliationId: reconciliation.reconciliationId,
      reviewerGateBindingId: reviewerBinding?.bindingId ?? `not-configured:${reconciliation.tenantId}`,
      releaseReadinessId: releaseReadiness?.readinessId ?? `not-configured:${reconciliation.tenantId}`,
      releaseControlGateId: releaseReadiness?.releaseControlEvidence.releaseGateId ?? `not-configured:${reconciliation.tenantId}`,
      approvalLedgerId: releaseReadiness?.releaseControlEvidence.approvalLedgerId ?? `not-configured:${reconciliation.tenantId}`,
      humanReviewPacketId: humanReviewPacket?.packetId ?? `not-configured:${reconciliation.tenantId}`,
      tenantId: reconciliation.tenantId,
      packageId: reconciliation.packageId,
      unitKey: reconciliation.unitKey,
      releaseControlStatus: releaseReadiness?.releaseControlEvidence.status ?? "blocked",
      humanReviewStatus: humanReviewPacket?.status ?? "blocked",
      status,
      linkedRecords: [...ASSIST_LANGUAGE_AUDIO_RELEASE_REVIEW_REQUIRED_RECORDS],
      scopeDrift,
      blockingReasons: uniqueBlockingReasons,
      nextGate: [
        "Reconcile assist-audio evidence with the same release candidate.",
        "Keep approval capture and production activation blocked until all human records exist.",
      ],
    });
  });
}
