import {
  createReviewOnlyControlledPilotHumanReviewAdjudication,
  validateControlledPilotHumanReviewAdjudication,
  type ControlledPilotHumanReviewAdjudication,
  type AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding,
  type AssistLanguageAudioCatalogReleaseReviewBinding,
  type ControlledPilotHumanReviewPacket,
} from "@living-textbook/content-model";

export function buildSampleControlledPilotHumanReviewAdjudication(
  decisionSnapshotBinding: AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding,
  releaseReviewBinding: AssistLanguageAudioCatalogReleaseReviewBinding,
  packet: ControlledPilotHumanReviewPacket,
): ControlledPilotHumanReviewAdjudication {
  return createReviewOnlyControlledPilotHumanReviewAdjudication(
    decisionSnapshotBinding,
    releaseReviewBinding,
    packet,
    {
      reviewerRole: "publisher-admin",
      reviewerRef: "publisher-admin:sample-publisher-review-room",
      decision: "blocked",
      reviewerNote: "Evidence remains blocked pending release, storage, and human-review records.",
      recordedAt: "2026-09-25T09:00:00.000Z",
    },
  );
}

export function validateSampleControlledPilotHumanReviewAdjudication(
  adjudication: ControlledPilotHumanReviewAdjudication,
  decisionSnapshotBinding: AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding,
  releaseReviewBinding: AssistLanguageAudioCatalogReleaseReviewBinding,
  packet: ControlledPilotHumanReviewPacket,
): string[] {
  return validateControlledPilotHumanReviewAdjudication(adjudication, decisionSnapshotBinding, releaseReviewBinding, packet);
}
