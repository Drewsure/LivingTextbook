import {
  createReviewOnlyAssistLanguageAudioCatalogApprovalPacket,
  type AssistLanguageAudioCatalogApprovalPacket,
  type AssistLanguageAudioCatalogRecord,
} from "@living-textbook/content-model";

export function buildAssistLanguageAudioCatalogApprovalPackets(records: AssistLanguageAudioCatalogRecord[]): AssistLanguageAudioCatalogApprovalPacket[] {
  return buildApprovalPackets(records);
}

function buildApprovalPackets(records: AssistLanguageAudioCatalogRecord[]): AssistLanguageAudioCatalogApprovalPacket[] {
  const groups = new Map<string, AssistLanguageAudioCatalogRecord[]>();
  for (const record of records) {
    const groupKey = `${record.tenantId}:${record.packageId}:${record.unitKey}`;
    const group = groups.get(groupKey) ?? [];
    group.push(record);
    groups.set(groupKey, group);
  }

  return [...groups.values()].map((group) => createReviewOnlyAssistLanguageAudioCatalogApprovalPacket({
    approvalPacketId: `assist-audio-approval-${group[0].tenantId}-${group[0].packageId}-${group[0].unitKey}`,
    tenantId: group[0].tenantId,
    packageId: group[0].packageId,
    unitKey: group[0].unitKey,
    catalogRecordIds: group.map((record) => record.catalogRecordId),
    storageRecordName: "assist_language_audio_catalog_admission",
    status: group.every((record) => record.decision === "admission-ready") ? "ready-for-review" : "blocked",
    reviewerRole: "teacher-or-publisher-audio-owner",
    requiredEvidence: [],
    unresolvedEvidence: [...new Set(group.flatMap((record) => record.blockers))],
    decision: "not-recorded",
    decisionCaptured: false,
    approvalAllowed: false,
    catalogAdmissionAllowed: false,
    studentFacingAllowed: false,
    blockedActions: [],
    nextRequiredRecords: [
      "assist_language_audio_catalog_admission",
      "teacher_approval_ledger",
      "media_rights_evidence_attachment",
      "local_or_hosted_delivery_binding",
    ],
    mode: "review-only",
    sideEffect: "none",
  }));
}
