import {
  ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_BLOCKED_ACTIONS,
  ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_IDENTITY_CHECKS,
  ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_REQUIRED_RECORDS,
  createReviewOnlyAssistLanguageAudioCatalogApprovalReconciliation,
  type AssistLanguageAudioCatalogApprovalPacket,
  type AssistLanguageAudioCatalogApprovalReconciliation,
  type AssistLanguageAudioCatalogRecord,
} from "@living-textbook/content-model";

export function buildAssistLanguageAudioCatalogApprovalReconciliations(
  packets: AssistLanguageAudioCatalogApprovalPacket[],
  records: AssistLanguageAudioCatalogRecord[],
): AssistLanguageAudioCatalogApprovalReconciliation[] {
  const recordsById = new Map(records.map((record) => [record.catalogRecordId, record]));

  return packets.map((packet) => {
    const scopedRecords = packet.catalogRecordIds.map((recordId) => recordsById.get(recordId));
    const identityDrift = scopedRecords.flatMap((record, index) => {
      const expectedId = packet.catalogRecordIds[index];
      if (!record) return [`Missing catalog record: ${expectedId}`];
      return [
        record.tenantId === packet.tenantId ? undefined : `Tenant mismatch: ${record.catalogRecordId}`,
        record.packageId === packet.packageId ? undefined : `Package mismatch: ${record.catalogRecordId}`,
        record.unitKey === packet.unitKey ? undefined : `Unit mismatch: ${record.catalogRecordId}`,
      ].filter((value): value is string => Boolean(value));
    });
    const unresolvedEvidence = [
      ...packet.unresolvedEvidence,
      ...scopedRecords.flatMap((record) => record?.blockers ?? []),
    ];
    const actualUnresolvedEvidence = [...new Set(unresolvedEvidence)];
    const status = identityDrift.length === 0 && actualUnresolvedEvidence.length === 0 && packet.status === "ready-for-review"
      ? "reconciliation-review-ready"
      : "blocked-preview";

    return createReviewOnlyAssistLanguageAudioCatalogApprovalReconciliation({
      approvalPacketId: packet.approvalPacketId,
      tenantId: packet.tenantId,
      packageId: packet.packageId,
      unitKey: packet.unitKey,
      catalogRecordIds: [...packet.catalogRecordIds],
      evidenceRecordIds: [...packet.catalogRecordIds],
      linkedStorageRecords: [...ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_REQUIRED_RECORDS],
      identityChecks: [...ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_IDENTITY_CHECKS],
      identityDrift,
      unresolvedEvidence: actualUnresolvedEvidence.length > 0
        ? actualUnresolvedEvidence
        : ["No unresolved catalog evidence in this preview; human approval remains not-recorded."],
      status,
      approvalDecision: packet.decision,
      blockedActions: [...ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_RECONCILIATION_BLOCKED_ACTIONS],
    });
  });
}
