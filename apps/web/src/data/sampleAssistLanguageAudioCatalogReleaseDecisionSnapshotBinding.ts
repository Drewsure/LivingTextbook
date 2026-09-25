import {
  ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_BLOCKED_ACTIONS,
  ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_REQUIRED_RECORDS,
  createReviewOnlyAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding,
  validatePilotReviewDecisionPersistenceSnapshot,
  type AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding,
  type AssistLanguageAudioCatalogReleaseReviewBinding,
  type PilotReviewDecisionPersistenceSnapshot,
} from "@living-textbook/content-model";

export function buildAssistLanguageAudioCatalogReleaseDecisionSnapshotBindings(
  releaseReviewBindings: AssistLanguageAudioCatalogReleaseReviewBinding[],
  snapshots: PilotReviewDecisionPersistenceSnapshot[],
): AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding[] {
  return releaseReviewBindings.flatMap((releaseReviewBinding) => {
    const scopedSnapshots = snapshots.filter(
      (snapshot) => snapshot.tenantId === releaseReviewBinding.tenantId && snapshot.packageId === releaseReviewBinding.packageId,
    );
    const candidates = scopedSnapshots.length > 0 ? scopedSnapshots : [undefined];

    return candidates.map((snapshot) => {
      const scopeDrift = [...releaseReviewBinding.scopeDrift];
      const blockingReasons: string[] = [];
      if (!snapshot) {
        blockingReasons.push("Pilot review decision snapshot is not configured for this tenant and package.");
      } else {
        const snapshotErrors = validatePilotReviewDecisionPersistenceSnapshot(snapshot);
        blockingReasons.push(...snapshotErrors.map((error) => `Decision snapshot: ${error}`));
        if (snapshot.tenantId !== releaseReviewBinding.tenantId) scopeDrift.push("Decision snapshot tenant does not match the assist-audio release scope.");
        if (snapshot.packageId !== releaseReviewBinding.packageId) scopeDrift.push("Decision snapshot package does not match the assist-audio release scope.");
        if (snapshot.decision.status !== "demo-ready-pilot-blocked") {
          blockingReasons.push(`Canonical pilot decision remains ${snapshot.decision.status}.`);
        }
      }
      if (releaseReviewBinding.status !== "review-ready-after-evidence") {
        blockingReasons.push(`Assist-audio release review remains ${releaseReviewBinding.status}.`);
      }
      blockingReasons.push(...scopeDrift);

      const uniqueBlockingReasons = [...new Set(blockingReasons)];
      const snapshotId = snapshot?.snapshotId ?? `not-configured:${releaseReviewBinding.tenantId}:${releaseReviewBinding.packageId}`;
      const decisionId = snapshot?.decisionId ?? `not-configured:${releaseReviewBinding.tenantId}:${releaseReviewBinding.packageId}`;

      return createReviewOnlyAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding({
        releaseReviewBindingId: releaseReviewBinding.bindingId,
        reconciliationId: releaseReviewBinding.reconciliationId,
        reviewerGateBindingId: releaseReviewBinding.reviewerGateBindingId,
        humanReviewPacketId: releaseReviewBinding.humanReviewPacketId,
        snapshotId,
        decisionId,
        tenantId: releaseReviewBinding.tenantId,
        packageId: releaseReviewBinding.packageId,
        unitKey: releaseReviewBinding.unitKey,
        persistenceMode: snapshot?.persistenceMode ?? "hosted-managed",
        decisionFingerprint: snapshot?.decisionFingerprint ?? "not-configured",
        releaseReadinessId: releaseReviewBinding.releaseReadinessId,
        releaseControlGateId: releaseReviewBinding.releaseControlGateId,
        approvalLedgerId: releaseReviewBinding.approvalLedgerId,
        status: uniqueBlockingReasons.length === 0 ? "linked-review-only" : "blocked-preview",
        linkedRecords: [...ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_REQUIRED_RECORDS],
        scopeDrift: [...new Set(scopeDrift)],
        blockingReasons: uniqueBlockingReasons,
        blockedActions: [...ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_BLOCKED_ACTIONS],
        nextGate: [
          "Reconcile the decision snapshot with the same release candidate and evidence packet.",
          "Keep snapshot writes, restore, export, approval capture, promotion, and launch blocked until human review is separately authorized.",
        ],
      });
    });
  });
}
