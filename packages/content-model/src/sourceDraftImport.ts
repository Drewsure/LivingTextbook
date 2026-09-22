export type SourceDraftImportPreviewStatus = "blocked" | "ready-preview";

export interface SourceDraftImportPreview {
  importPreviewId: string;
  tenantId: string;
  sourceId: string;
  targetPackageId: string;
  assemblyPacketId: string;
  extractionPreviewId: string;
  draftId: string;
  candidateUnitKey: string;
  sourceChecksum: string;
  mode: "review-only";
  status: SourceDraftImportPreviewStatus;
  requiredRecords: string[];
  blockers: string[];
  draftCreationAllowed: false;
  storageWriteAllowed: false;
  studentFacingPayloadAllowed: false;
  assignmentAllowed: false;
}

const REQUIRED_SOURCE_DRAFT_IMPORT_RECORDS = [
  "source_package_assembly_packet",
  "source_extraction_review_packet",
  "teacher_draft_package_preview",
  "teacher_draft_review_handoff",
] as const;

export function validateSourceDraftImportPreview(preview: SourceDraftImportPreview): string[] {
  const errors: string[] = [];

  for (const [field, value] of [
    ["importPreviewId", preview.importPreviewId],
    ["tenantId", preview.tenantId],
    ["sourceId", preview.sourceId],
    ["targetPackageId", preview.targetPackageId],
    ["assemblyPacketId", preview.assemblyPacketId],
    ["extractionPreviewId", preview.extractionPreviewId],
    ["draftId", preview.draftId],
    ["candidateUnitKey", preview.candidateUnitKey],
    ["sourceChecksum", preview.sourceChecksum],
  ] as const) {
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`Source draft import preview ${field} is required.`);
    }
  }

  if (preview.mode !== "review-only") errors.push("Source draft import preview must remain review-only.");
  if (preview.status !== "blocked" && preview.status !== "ready-preview") {
    errors.push("Source draft import preview has an unsupported status.");
  }

  if (!Array.isArray(preview.requiredRecords) || preview.requiredRecords.some((record) => typeof record !== "string" || !record.trim())) {
    errors.push("Source draft import preview requiredRecords must contain non-blank strings.");
  } else {
    for (const record of REQUIRED_SOURCE_DRAFT_IMPORT_RECORDS) {
      if (!preview.requiredRecords.includes(record)) {
        errors.push(`Source draft import preview is missing required record ${record}.`);
      }
    }
  }

  if (!Array.isArray(preview.blockers) || preview.blockers.some((blocker) => typeof blocker !== "string" || !blocker.trim())) {
    errors.push("Source draft import preview blockers must contain non-blank strings.");
  }

  if (preview.status === "blocked" && preview.blockers.length === 0) {
    errors.push("Blocked source draft import preview must state at least one blocker.");
  }

  for (const [field, value] of [
    ["draftCreationAllowed", preview.draftCreationAllowed],
    ["storageWriteAllowed", preview.storageWriteAllowed],
    ["studentFacingPayloadAllowed", preview.studentFacingPayloadAllowed],
    ["assignmentAllowed", preview.assignmentAllowed],
  ] as const) {
    if (value !== false) errors.push(`Source draft import preview ${field} must remain false.`);
  }

  return [...new Set(errors)];
}

export function validateSourceDraftImportPreviewBinding(
  preview: unknown,
  assembly: unknown,
  extractionPreview: unknown,
  draft: unknown,
): string[] {
  const errors: string[] = [];
  if (!isRecord(preview)) return ["Source draft import preview binding requires an import preview."];
  if (!isRecord(assembly)) return ["Source draft import preview binding requires a source package assembly packet."];
  if (!isRecord(extractionPreview)) return ["Source draft import preview binding requires a source extraction preview."];
  if (!isRecord(draft)) return ["Source draft import preview binding requires a teacher draft preview."];

  for (const [field, previewValue, sourceValue, message] of [
    ["tenantId", preview.tenantId, assembly.tenantId, "Source draft import preview tenant must match the assembly packet."],
    ["sourceId", preview.sourceId, assembly.sourceId, "Source draft import preview source must match the assembly packet."],
    ["targetPackageId", preview.targetPackageId, assembly.targetPackageId, "Source draft import preview package must match the assembly packet."],
    ["assemblyPacketId", preview.assemblyPacketId, assembly.packetId, "Source draft import preview assembly id must match the assembly packet."],
    ["extractionPreviewId", preview.extractionPreviewId, extractionPreview.previewId, "Source draft import preview extraction id must match the extraction preview."],
    ["draftId", preview.draftId, draft.draftId, "Source draft import preview draft id must match the teacher draft preview."],
  ] as const) {
    if (!isNonBlankString(previewValue) || !isNonBlankString(sourceValue) || previewValue !== sourceValue) errors.push(message);
  }

  if (preview.sourceChecksum !== assembly.sourceChecksum || preview.sourceChecksum !== extractionPreview.sourceChecksum) {
    errors.push("Source draft import preview checksum must match both source records.");
  }

  const candidateUnits = readStringList(assembly.candidateUnitKeys);
  const previewUnits = readStringList(extractionPreview.candidateUnitKeys);
  const candidateUnitKey = isNonBlankString(preview.candidateUnitKey) ? preview.candidateUnitKey : undefined;
  if (!candidateUnits || !candidateUnitKey || !candidateUnits.includes(candidateUnitKey)) {
    errors.push("Source draft import preview candidate unit must be declared by the assembly packet.");
  }
  if (!previewUnits || !candidateUnitKey || !previewUnits.includes(candidateUnitKey)) {
    errors.push("Source draft import preview candidate unit must be declared by the extraction preview.");
  }

  if (assembly.mode !== "review-only" || extractionPreview.mode !== "review-only") {
    errors.push("Source draft import preview source records must remain review-only.");
  }
  if (assembly.draftCreationAllowed !== false || assembly.packagePromotionAllowed !== false) {
    errors.push("Source draft import preview requires source assembly promotion flags to remain false.");
  }
  if (extractionPreview.draftCreationAllowed !== false || extractionPreview.storageWriteAllowed !== false) {
    errors.push("Source draft import preview requires extraction promotion flags to remain false.");
  }
  if (draft.canAssignToStudents !== false) {
    errors.push("Source draft import preview requires the teacher draft assignment flag to remain false.");
  }

  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || value.some((item) => !isNonBlankString(item))) return undefined;
  return [...value];
}
