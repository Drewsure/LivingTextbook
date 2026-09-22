import type { SourceDocumentType } from "./index";

export type SourceExtractionPreviewMode = "review-only";
export type SourceExtractionSegmentKind =
  | "heading"
  | "body"
  | "activity"
  | "instruction"
  | "media-callout"
  | "teacher-note";

export interface SourceExtractionPreviewSegment {
  segmentId: string;
  pageNumber: number;
  sequence: number;
  kind: SourceExtractionSegmentKind;
  unitKey: string;
  text: string;
}

export interface SourceExtractionPreviewRequest {
  previewId: string;
  tenantId: string;
  sourceId: string;
  targetPackageId: string;
  sourceType: SourceDocumentType;
  sourceChecksum: string;
  extractionMethod: "manual-structure" | "pdf-text" | "ocr" | "docx-parse" | "spreadsheet-import" | "ai-assisted";
  candidateUnitKeys: string[];
  segments: SourceExtractionPreviewSegment[];
  mode: SourceExtractionPreviewMode;
}

export interface SourceExtractionUnitSummary {
  unitKey: string;
  segmentCount: number;
  pageStart: number;
  pageEnd: number;
}

export interface SourceExtractionPreview {
  previewId: string;
  tenantId: string;
  sourceId: string;
  targetPackageId: string;
  sourceType: SourceDocumentType;
  sourceChecksum: string;
  extractionMethod: SourceExtractionPreviewRequest["extractionMethod"];
  candidateUnitKeys: string[];
  mode: SourceExtractionPreviewMode;
  segments: Array<SourceExtractionPreviewSegment & { normalizedText: string }>;
  unitSummaries: SourceExtractionUnitSummary[];
  blockedActions: readonly string[];
  draftCreationAllowed: false;
  studentFacingPayloadAllowed: false;
  storageWriteAllowed: false;
}

export interface SourceExtractionPreviewResult {
  valid: boolean;
  mode: SourceExtractionPreviewMode;
  sideEffect: "none";
  errors: string[];
  warnings: string[];
  preview?: SourceExtractionPreview;
}

export const sourceExtractionPreviewBlockedActions = [
  "No source file write or replacement",
  "No parser or OCR promotion",
  "No teacher draft creation",
  "No package assembly or route creation",
  "No student-facing payload",
] as const;

const sourceTypes = new Set<SourceDocumentType>(["pdf", "docx", "spreadsheet", "manual", "ai-draft"]);
const segmentKinds = new Set<SourceExtractionSegmentKind>([
  "heading",
  "body",
  "activity",
  "instruction",
  "media-callout",
  "teacher-note",
]);
const extractionMethods = new Set<SourceExtractionPreviewRequest["extractionMethod"]>([
  "manual-structure",
  "pdf-text",
  "ocr",
  "docx-parse",
  "spreadsheet-import",
  "ai-assisted",
]);
const checksumPattern = /^sha256:[0-9a-f]{64}$/i;

export function validateSourceExtractionPreviewRequest(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Source extraction preview request must be an object."];

  for (const field of ["previewId", "tenantId", "sourceId", "targetPackageId", "sourceChecksum"] as const) {
    if (!isNonBlankString(value[field])) errors.push(`Source extraction preview ${field} is required.`);
  }
  if (!sourceTypes.has(value.sourceType as SourceDocumentType)) errors.push("Source extraction preview sourceType is unsupported.");
  if (!extractionMethods.has(value.extractionMethod as SourceExtractionPreviewRequest["extractionMethod"])) {
    errors.push("Source extraction preview extractionMethod is unsupported.");
  }
  if (value.mode !== "review-only") errors.push("Source extraction preview mode must remain review-only.");
  if (isNonBlankString(value.sourceChecksum) && !checksumPattern.test(value.sourceChecksum)) {
    errors.push("Source extraction preview sourceChecksum must use sha256:<64 hexadecimal characters>.");
  }

  const candidateUnitKeys = value.candidateUnitKeys;
  if (!Array.isArray(candidateUnitKeys) || candidateUnitKeys.length === 0) {
    errors.push("Source extraction preview must include at least one candidate unit key.");
  } else {
    if (candidateUnitKeys.some((unitKey) => !isNonBlankString(unitKey))) errors.push("Source extraction preview candidate unit keys must be non-blank strings.");
    if (new Set(candidateUnitKeys).size !== candidateUnitKeys.length) errors.push("Source extraction preview candidate unit keys must be unique.");
  }

  const segments = value.segments;
  if (!Array.isArray(segments) || segments.length === 0) {
    errors.push("Source extraction preview must include at least one segment.");
  } else {
    const segmentIds = new Set<string>();
    const sequenceKeys = new Set<string>();
    for (const [index, segment] of segments.entries()) {
      if (!isRecord(segment)) {
        errors.push(`Source extraction segment ${index + 1} must be an object.`);
        continue;
      }
      const segmentId = readString(segment.segmentId);
      const unitKey = readString(segment.unitKey);
      const pageNumber = typeof segment.pageNumber === "number" ? segment.pageNumber : Number.NaN;
      const sequence = typeof segment.sequence === "number" ? segment.sequence : Number.NaN;
      if (!segmentId) errors.push(`Source extraction segment ${index + 1} requires segmentId.`);
      else if (segmentIds.has(segmentId)) errors.push(`Source extraction segment ${segmentId} must be unique.`);
      else segmentIds.add(segmentId);
      if (!Number.isInteger(pageNumber) || pageNumber < 1) errors.push(`Source extraction segment ${segmentId || index + 1} pageNumber must be a positive integer.`);
      if (!Number.isInteger(sequence) || sequence < 0) errors.push(`Source extraction segment ${segmentId || index + 1} sequence must be a non-negative integer.`);
      if (Number.isInteger(pageNumber) && Number.isInteger(sequence)) {
        const sequenceKey = `${pageNumber}:${sequence}`;
        if (sequenceKeys.has(sequenceKey)) errors.push(`Source extraction segment order ${sequenceKey} must be unique.`);
        sequenceKeys.add(sequenceKey);
      }
      if (!segmentKinds.has(segment.kind as SourceExtractionSegmentKind)) errors.push(`Source extraction segment ${segmentId || index + 1} kind is unsupported.`);
      if (!unitKey) errors.push(`Source extraction segment ${segmentId || index + 1} requires unitKey.`);
      if (!isNonBlankString(segment.text)) errors.push(`Source extraction segment ${segmentId || index + 1} requires text.`);
      if (Array.isArray(candidateUnitKeys) && unitKey && !candidateUnitKeys.includes(unitKey)) errors.push(`Source extraction segment ${segmentId || index + 1} references an undeclared candidate unit.`);
    }
    if (Array.isArray(candidateUnitKeys)) {
      for (const candidateUnitKey of candidateUnitKeys) {
        if (!segments.some((segment) => isRecord(segment) && readString(segment.unitKey) === candidateUnitKey)) {
          errors.push(`Source extraction candidate unit ${candidateUnitKey} must have at least one segment.`);
        }
      }
    }
  }

  return [...new Set(errors)];
}

export function createReviewOnlySourceExtractionPreview(value: unknown): SourceExtractionPreviewResult {
  const errors = validateSourceExtractionPreviewRequest(value);
  const mode: SourceExtractionPreviewMode = "review-only";
  if (errors.length > 0 || !isRecord(value)) return { valid: false, mode, sideEffect: "none", errors, warnings: [] };

  const request = value as unknown as SourceExtractionPreviewRequest;
  const segments = request.segments
    .map((segment) => ({ ...segment, normalizedText: normalizeExtractedText(segment.text) }))
    .sort((left, right) => left.pageNumber - right.pageNumber || left.sequence - right.sequence || left.segmentId.localeCompare(right.segmentId));
  const unitSummaries = request.candidateUnitKeys.map((unitKey) => {
    const unitSegments = segments.filter((segment) => segment.unitKey === unitKey);
    const pages = unitSegments.map((segment) => segment.pageNumber);
    return { unitKey, segmentCount: unitSegments.length, pageStart: Math.min(...pages), pageEnd: Math.max(...pages) };
  });
  const warnings = request.extractionMethod === "ai-assisted"
    ? ["AI-assisted extraction remains a reviewer suggestion and cannot create a draft or student payload."]
    : [];

  return {
    valid: true,
    mode,
    sideEffect: "none",
    errors: [],
    warnings,
    preview: {
      previewId: request.previewId,
      tenantId: request.tenantId,
      sourceId: request.sourceId,
      targetPackageId: request.targetPackageId,
      sourceType: request.sourceType,
      sourceChecksum: request.sourceChecksum,
      extractionMethod: request.extractionMethod,
      candidateUnitKeys: [...request.candidateUnitKeys],
      mode,
      segments,
      unitSummaries,
      blockedActions: sourceExtractionPreviewBlockedActions,
      draftCreationAllowed: false,
      studentFacingPayloadAllowed: false,
      storageWriteAllowed: false,
    },
  };
}

export function validateSourceExtractionPreview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Source extraction preview must be an object."];

  const segments = Array.isArray(value.segments) ? value.segments : [];
  const requestSegments = segments.map((segment) => {
    if (!isRecord(segment)) return segment;
    const { normalizedText: _normalizedText, ...requestSegment } = segment;
    return requestSegment;
  });
  errors.push(...validateSourceExtractionPreviewRequest({ ...value, segments: requestSegments }));

  if (value.mode !== "review-only") errors.push("Source extraction preview mode must remain review-only.");
  if (!Array.isArray(value.blockedActions)) {
    errors.push("Source extraction preview blockedActions must be an array.");
  } else {
    for (const blockedAction of sourceExtractionPreviewBlockedActions) {
      if (!value.blockedActions.includes(blockedAction)) {
        errors.push(`Source extraction preview must block action: ${blockedAction}.`);
      }
    }
  }
  for (const [field, expected] of [
    ["draftCreationAllowed", false],
    ["studentFacingPayloadAllowed", false],
    ["storageWriteAllowed", false],
  ] as const) {
    if (value[field] !== expected) errors.push(`Source extraction preview ${field} must remain false.`);
  }

  const candidateUnitKeys = readStringList(value.candidateUnitKeys) ?? [];
  const summaries = Array.isArray(value.unitSummaries) ? value.unitSummaries : [];
  if (!Array.isArray(value.unitSummaries)) {
    errors.push("Source extraction preview unitSummaries must be an array.");
  } else if (summaries.length !== candidateUnitKeys.length) {
    errors.push("Source extraction preview unitSummaries must contain one summary per candidate unit.");
  }

  const summaryKeys = new Set<string>();
  for (const [index, summary] of summaries.entries()) {
    if (!isRecord(summary)) {
      errors.push(`Source extraction preview unit summary ${index + 1} must be an object.`);
      continue;
    }
    const unitKey = readString(summary.unitKey);
    if (!unitKey || !candidateUnitKeys.includes(unitKey)) {
      errors.push(`Source extraction preview unit summary ${index + 1} references an undeclared candidate unit.`);
    }
    if (summaryKeys.has(unitKey)) errors.push(`Source extraction preview unit summary ${unitKey} must be unique.`);
    summaryKeys.add(unitKey);
    const segmentCount = typeof summary.segmentCount === "number" ? summary.segmentCount : Number.NaN;
    const pageStart = typeof summary.pageStart === "number" ? summary.pageStart : Number.NaN;
    const pageEnd = typeof summary.pageEnd === "number" ? summary.pageEnd : Number.NaN;
    if (!Number.isInteger(segmentCount) || segmentCount < 1) {
      errors.push(`Source extraction preview unit summary ${unitKey || index + 1} segmentCount must be a positive integer.`);
    }
    if (!Number.isInteger(pageStart) || pageStart < 1) {
      errors.push(`Source extraction preview unit summary ${unitKey || index + 1} pageStart must be a positive integer.`);
    }
    if (!Number.isInteger(pageEnd) || pageEnd < 1 || pageEnd < pageStart) {
      errors.push(`Source extraction preview unit summary ${unitKey || index + 1} pageEnd must be at least pageStart.`);
    }
  }

  for (const [index, segment] of segments.entries()) {
    if (!isRecord(segment)) continue;
    const text = readString(segment.text);
    const normalizedText = readString(segment.normalizedText);
    if (!normalizedText) {
      errors.push(`Source extraction preview segment ${segment.segmentId || index + 1} requires normalizedText.`);
    } else if (normalizedText !== normalizeExtractedText(text)) {
      errors.push(`Source extraction preview segment ${segment.segmentId || index + 1} normalizedText must match normalized text.`);
    }
  }

  for (const candidateUnitKey of candidateUnitKeys) {
    const unitSegments = segments.filter((segment) => isRecord(segment) && readString(segment.unitKey) === candidateUnitKey);
    const summary = summaries.find((candidate) => isRecord(candidate) && readString(candidate.unitKey) === candidateUnitKey);
    if (!summary || !isRecord(summary)) continue;
    const pages = unitSegments.map((segment) => (typeof segment.pageNumber === "number" ? segment.pageNumber : Number.NaN));
    const segmentCount = typeof summary.segmentCount === "number" ? summary.segmentCount : Number.NaN;
    const pageStart = typeof summary.pageStart === "number" ? summary.pageStart : Number.NaN;
    const pageEnd = typeof summary.pageEnd === "number" ? summary.pageEnd : Number.NaN;
    if (segmentCount !== unitSegments.length) {
      errors.push(`Source extraction preview unit summary ${candidateUnitKey} segmentCount does not match segments.`);
    }
    if (unitSegments.length > 0 && (pageStart !== Math.min(...pages) || pageEnd !== Math.max(...pages))) {
      errors.push(`Source extraction preview unit summary ${candidateUnitKey} page range does not match segments.`);
    }
  }

  return [...new Set(errors)];
}

function normalizeExtractedText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
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

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
