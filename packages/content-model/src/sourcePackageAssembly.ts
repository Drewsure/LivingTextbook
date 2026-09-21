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
