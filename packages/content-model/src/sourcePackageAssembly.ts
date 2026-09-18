export type SourcePackageAssemblyMode = "review-only";
export type SourcePackageAssemblyStatus = "evidence-only" | "draft-candidate" | "blocked";

export interface SourcePackageAssemblyPacket {
  packetId: string;
  tenantId: string;
  sourceId: string;
  targetPackageId: string;
  extractionPacketId: string;
  label: string;
  mode: SourcePackageAssemblyMode;
  status: SourcePackageAssemblyStatus;
  sourceChecksum: string;
  candidateUnitKeys: string[];
  candidateMediaAssetIds: string[];
  approvalLedgerId: string;
  approvalLedgerLinked: boolean;
  requiredRecords: string[];
  blockers: string[];
  sourceLineageReviewed: boolean;
  extractionReviewAccepted: boolean;
  mediaRightsReviewed: boolean;
  targetMappingReviewed: boolean;
  teacherReviewHandoffPresent: boolean;
  draftCreationAllowed: false;
  studentFacingPayloadAllowed: false;
  packagePromotionAllowed: false;
  approvalCaptureAllowed: false;
}

const REQUIRED_ASSEMBLY_RECORDS = [
  "source_extraction_review_packet",
  "teacher_draft_package",
  "teacher_draft_review_handoff",
] as const;

export function validateSourcePackageAssemblyPacket(packet: SourcePackageAssemblyPacket): string[] {
  const errors: string[] = [];

  for (const [field, value] of [
    ["packetId", packet.packetId],
    ["tenantId", packet.tenantId],
    ["sourceId", packet.sourceId],
    ["targetPackageId", packet.targetPackageId],
    ["extractionPacketId", packet.extractionPacketId],
    ["label", packet.label],
    ["sourceChecksum", packet.sourceChecksum],
    ["approvalLedgerId", packet.approvalLedgerId],
  ] as const) {
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`Source package assembly ${field} is required.`);
    }
  }

  if (packet.mode !== "review-only") {
    errors.push("Source package assembly must remain review-only.");
  }

  if (!["evidence-only", "draft-candidate", "blocked"].includes(packet.status)) {
    errors.push("Source package assembly has an unsupported status.");
  }

  for (const [field, value] of [
    ["sourceLineageReviewed", packet.sourceLineageReviewed],
    ["extractionReviewAccepted", packet.extractionReviewAccepted],
    ["mediaRightsReviewed", packet.mediaRightsReviewed],
    ["targetMappingReviewed", packet.targetMappingReviewed],
    ["teacherReviewHandoffPresent", packet.teacherReviewHandoffPresent],
    ["approvalLedgerLinked", packet.approvalLedgerLinked],
    ["draftCreationAllowed", packet.draftCreationAllowed],
    ["studentFacingPayloadAllowed", packet.studentFacingPayloadAllowed],
    ["packagePromotionAllowed", packet.packagePromotionAllowed],
    ["approvalCaptureAllowed", packet.approvalCaptureAllowed],
  ] as const) {
    if (typeof value !== "boolean") errors.push(`Source package assembly ${field} must be a boolean.`);
  }

  if (!Array.isArray(packet.candidateUnitKeys) || packet.candidateUnitKeys.length === 0) {
    errors.push("Source package assembly must include at least one candidate unit key.");
  }
  if (!Array.isArray(packet.candidateMediaAssetIds)) {
    errors.push("Source package assembly candidateMediaAssetIds must be an array.");
  }
  if (!Array.isArray(packet.requiredRecords)) {
    errors.push("Source package assembly requiredRecords must be an array.");
  }
  if (!Array.isArray(packet.blockers)) {
    errors.push("Source package assembly blockers must be an array.");
  }

  const requiredRecords = Array.isArray(packet.requiredRecords) ? packet.requiredRecords : [];
  for (const record of REQUIRED_ASSEMBLY_RECORDS) {
    if (!requiredRecords.includes(record)) {
      errors.push(`Source package assembly is missing required record ${record}.`);
    }
  }

  const blockers = Array.isArray(packet.blockers) ? packet.blockers : [];
  if (packet.status === "blocked" && blockers.length === 0) {
    errors.push("Blocked source package assembly must state at least one blocker.");
  }

  if (packet.draftCreationAllowed || packet.studentFacingPayloadAllowed || packet.packagePromotionAllowed || packet.approvalCaptureAllowed) {
    errors.push("Source package assembly promotion flags must remain false in review-only mode.");
  }

  if (packet.approvalLedgerLinked !== true) {
    errors.push("Source package assembly must link to an evidence-only approval ledger.");
  }

  return [...new Set(errors)];
}
