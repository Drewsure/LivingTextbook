import { validateTargetLanguagePolicy } from "./targetLanguagePolicy";
import type { TargetLanguagePolicy } from "./targetLanguagePolicy";

export type SourcePackageAssemblyMode = "review-only";
export type SourcePackageAssemblyStatus = "evidence-only" | "draft-candidate" | "blocked";

export interface SourcePackageAssemblyPacket {
  packetId: string;
  tenantId: string;
  sourceId: string;
  targetPackageId: string;
  targetLanguage: string;
  assistLanguages: string[];
  targetLanguagePolicy?: TargetLanguagePolicy;
  extractionPacketId: string;
  extractionPreviewId: string;
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

const SHA256_CHECKSUM_PATTERN = /^sha256:[0-9a-f]{64}$/i;

function validateUniqueStringList(values: unknown, field: string, minimumLength = 0): string[] {
  if (!Array.isArray(values)) return [`Source package assembly ${field} must be an array.`];
  const errors: string[] = [];
  if (values.length < minimumLength) {
    errors.push(`Source package assembly must include at least one ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
  }
  if (values.some((value) => typeof value !== "string" || value.trim().length === 0)) {
    errors.push(`Source package assembly ${field} must contain only non-blank strings.`);
  }
  if (new Set(values).size !== values.length) {
    errors.push(`Source package assembly ${field} must contain unique identifiers.`);
  }
  return errors;
}

export function validateSourcePackageAssemblyPacket(packet: SourcePackageAssemblyPacket): string[] {
  const errors: string[] = [];

  for (const [field, value] of [
    ["packetId", packet.packetId],
    ["tenantId", packet.tenantId],
    ["sourceId", packet.sourceId],
    ["targetPackageId", packet.targetPackageId],
    ["targetLanguage", packet.targetLanguage],
    ["extractionPacketId", packet.extractionPacketId],
    ["extractionPreviewId", packet.extractionPreviewId],
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

  if (!Array.isArray(packet.assistLanguages)) {
    errors.push("Source package assembly assistLanguages must be an array.");
  } else {
    if (packet.assistLanguages.some((language) => typeof language !== "string" || language.trim().length === 0)) {
      errors.push("Source package assembly assistLanguages must contain only non-blank strings.");
    }
    if (new Set(packet.assistLanguages).size !== packet.assistLanguages.length) {
      errors.push("Source package assembly assistLanguages must contain unique languages.");
    }
    if (packet.assistLanguages.some((language) => typeof packet.targetLanguage === "string" && language.trim().toLowerCase() === packet.targetLanguage.trim().toLowerCase())) {
      errors.push("Source package assembly assist languages must not equal the target language.");
    }
  }

  const normalizedTargetLanguage = typeof packet.targetLanguage === "string" ? packet.targetLanguage.trim().toLowerCase() : "";
  if (normalizedTargetLanguage && normalizedTargetLanguage !== "en" && !packet.targetLanguagePolicy) {
    errors.push("Non-English source package assembly requires an explicit target-language policy.");
  }
  if (packet.targetLanguagePolicy) {
    errors.push(...validateTargetLanguagePolicy({
      tenantId: packet.tenantId,
      targetLanguage: packet.targetLanguage,
      assistLanguages: packet.assistLanguages,
      policy: packet.targetLanguagePolicy,
    }));
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
  errors.push(...validateUniqueStringList(packet.candidateUnitKeys, "candidateUnitKeys", 1));
  errors.push(...validateUniqueStringList(packet.candidateMediaAssetIds, "candidateMediaAssetIds"));
  errors.push(...validateUniqueStringList(packet.requiredRecords, "requiredRecords"));
  if (!Array.isArray(packet.blockers)) {
    errors.push("Source package assembly blockers must be an array.");
  } else {
    errors.push(...validateUniqueStringList(packet.blockers, "blockers"));
  }

  if (typeof packet.sourceChecksum === "string" && !SHA256_CHECKSUM_PATTERN.test(packet.sourceChecksum)) {
    errors.push("Source package assembly sourceChecksum must use the sha256:<64 hexadecimal characters> format.");
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

  if (packet.status === "draft-candidate") {
    for (const [field, value] of [
      ["sourceLineageReviewed", packet.sourceLineageReviewed],
      ["extractionReviewAccepted", packet.extractionReviewAccepted],
      ["targetMappingReviewed", packet.targetMappingReviewed],
      ["teacherReviewHandoffPresent", packet.teacherReviewHandoffPresent],
    ] as const) {
      if (value !== true) {
        errors.push(`Draft-candidate source package assembly requires ${field}.`);
      }
    }
  }

  if (packet.draftCreationAllowed || packet.studentFacingPayloadAllowed || packet.packagePromotionAllowed || packet.approvalCaptureAllowed) {
    errors.push("Source package assembly promotion flags must remain false in review-only mode.");
  }

  if (packet.approvalLedgerLinked !== true) {
    errors.push("Source package assembly must link to an evidence-only approval ledger.");
  }

  return [...new Set(errors)];
}

export function validateSourcePackageAssemblyExtractionPreviewBinding(packet: unknown, preview: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(packet)) return ["Source package assembly extraction preview binding requires an assembly packet."];
  if (!isRecord(preview)) return ["Source package assembly extraction preview binding requires a preview."];

  const bindings = [
    ["tenantId", packet.tenantId, preview.tenantId],
    ["sourceId", packet.sourceId, preview.sourceId],
    ["targetPackageId", packet.targetPackageId, preview.targetPackageId],
    ["sourceChecksum", packet.sourceChecksum, preview.sourceChecksum],
    ["extractionPreviewId", packet.extractionPreviewId, preview.previewId],
  ] as const;

  for (const [field, packetValue, previewValue] of bindings) {
    if (!isNonBlankString(packetValue) || !isNonBlankString(previewValue)) {
      errors.push(`Source package assembly extraction preview binding requires ${field} on both records.`);
    } else if (packetValue !== previewValue) {
      errors.push(`Source package assembly extraction preview binding ${field} does not match the preview.`);
    }
  }

  if (preview.mode !== "review-only") errors.push("Source package assembly extraction preview must remain review-only.");
  if (preview.storageWriteAllowed !== false) errors.push("Source package assembly extraction preview storage writes must remain blocked.");
  if (preview.studentFacingPayloadAllowed !== false) errors.push("Source package assembly extraction preview student payloads must remain blocked.");

  const packetUnitKeys = readStringList(packet.candidateUnitKeys);
  const previewUnitKeys = readStringList(preview.candidateUnitKeys);
  if (!packetUnitKeys) errors.push("Source package assembly extraction preview binding requires candidateUnitKeys on the assembly packet.");
  if (!previewUnitKeys) errors.push("Source package assembly extraction preview binding requires candidateUnitKeys on the preview.");
  if (packetUnitKeys && previewUnitKeys) {
    for (const unitKey of packetUnitKeys) {
      if (!previewUnitKeys.includes(unitKey)) {
        errors.push(`Source package assembly extraction preview binding candidate unit ${unitKey} is not declared by the preview.`);
      }
    }
  }
  return [...new Set(errors)];
}

export function validateSourcePackageAssemblyContentPackageBinding(packet: unknown, contentPackage: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(packet)) return ["Source package assembly content package binding requires an assembly packet."];
  if (!isRecord(contentPackage)) return ["Source package assembly content package binding requires a content package."];
  const meta = isRecord(contentPackage.meta) ? contentPackage.meta : undefined;
  if (!meta) return ["Source package assembly content package binding requires package metadata."];

  for (const [field, packetValue, packageValue] of [
    ["tenantId", packet.tenantId, meta.tenantId],
    ["targetPackageId", packet.targetPackageId, meta.packageId],
  ] as const) {
    if (!isNonBlankString(packetValue) || !isNonBlankString(packageValue)) {
      errors.push(`Source package assembly content package binding requires ${field} on both records.`);
    } else if (packetValue !== packageValue) {
      errors.push(`Source package assembly content package binding ${field} does not match the content package.`);
    }
  }

  const candidateUnitKeys = readStringList(packet.candidateUnitKeys) ?? [];
  const packageUnits = Array.isArray(contentPackage.units) ? contentPackage.units : [];
  const packageUnitKeys = new Set<string>();
  for (const unit of packageUnits) {
    if (!isRecord(unit) || !isRecord(unit.unitMeta)) continue;
    const unitMeta = unit.unitMeta;
    if (
      isNonBlankString(unitMeta.tenantId)
      && isNonBlankString(unitMeta.curriculumId)
      && Number.isInteger(unitMeta.level)
      && Number.isInteger(unitMeta.unit)
    ) {
      packageUnitKeys.add(`${unitMeta.tenantId}:${unitMeta.curriculumId}:L${unitMeta.level}:U${unitMeta.unit}`);
    }
  }
  for (const unitKey of candidateUnitKeys) {
    if (!packageUnitKeys.has(unitKey)) {
      errors.push(`Source package assembly content package binding candidate unit ${unitKey} is not declared by the content package.`);
    }
  }

  const candidateMediaAssetIds = readStringList(packet.candidateMediaAssetIds) ?? [];
  const mediaAssets = Array.isArray(contentPackage.mediaAssets) ? contentPackage.mediaAssets : [];
  for (const mediaAssetId of candidateMediaAssetIds) {
    const mediaAsset = mediaAssets.find((asset) => isRecord(asset) && asset.mediaAssetId === mediaAssetId);
    if (!mediaAsset || !isRecord(mediaAsset)) {
      errors.push(`Source package assembly content package binding media asset ${mediaAssetId} is not declared by the content package.`);
      continue;
    }
    if (mediaAsset.tenantId !== packet.tenantId) {
      errors.push(`Source package assembly content package binding media asset ${mediaAssetId} has a different tenant.`);
    }
    if (isNonBlankString(mediaAsset.unitKey) && !candidateUnitKeys.includes(mediaAsset.unitKey)) {
      errors.push(`Source package assembly content package binding media asset ${mediaAssetId} is outside the candidate unit scope.`);
    }
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
