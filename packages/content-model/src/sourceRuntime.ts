import type { ContentReviewStatus, SourceDocumentType } from "./index";

export type SourceRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";
export type SourceExtractionMethod = "manual-structure" | "pdf-text" | "ocr" | "docx-parse" | "spreadsheet-import" | "ai-assisted";
export type SourceExtractionReviewStatus = "not-started" | "in-review" | "accepted" | "rejected";

export interface SourceRuntimeRequest {
  tenantId: string;
  sourceId: string;
  targetPackageId: string;
  sourceType: SourceDocumentType;
  sourceMimeType: string;
  sourceByteLength: number;
  sourceChecksum: string;
  extractionMethod: SourceExtractionMethod;
  contentReviewStatus: ContentReviewStatus;
  filePolicyAccepted: boolean;
  scanPassed: boolean;
  sourceLineageReviewed: boolean;
  rightsReviewAccepted: boolean;
  extractionReviewStatus: SourceExtractionReviewStatus;
  ocrUsed: boolean;
  ocrConfidenceReviewed: boolean;
  segmentationReviewed: boolean;
  schemaReviewPassed: boolean;
  targetMappingReviewed: boolean;
  packageRuntimeApproved: boolean;
  teacherReleaseApproved: boolean;
  rawSourceAsStudentPayloadRequested: boolean;
  draftCreationRequested: boolean;
  aiExtractionRequested: boolean;
  studentFacingUseRequested: boolean;
}

export interface SourceRuntimeDecision {
  allowed: boolean;
  mode: SourceRuntimeMode;
  reasonCode: string;
  reasons: string[];
  extractionReviewStatus: SourceExtractionReviewStatus;
}

export interface SourceRuntimeResult {
  request: SourceRuntimeRequest;
  decision: SourceRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface SourceRuntimeAdapter {
  readonly mode: SourceRuntimeMode;
  evaluate(request: SourceRuntimeRequest): SourceRuntimeDecision;
  execute(request: SourceRuntimeRequest): SourceRuntimeResult;
}

const sourceDocumentTypes = new Set<SourceDocumentType>(["pdf", "docx", "spreadsheet", "manual", "ai-draft"]);
const sourceExtractionMethods = new Set<SourceExtractionMethod>(["manual-structure", "pdf-text", "ocr", "docx-parse", "spreadsheet-import", "ai-assisted"]);
const contentReviewStatuses = new Set<ContentReviewStatus>(["draft", "reviewed", "verified", "approved", "rejected"]);
const sourceExtractionReviewStatuses = new Set<SourceExtractionReviewStatus>(["not-started", "in-review", "accepted", "rejected"]);
const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const maxSourceIdentifierLength = 160;
const maxTargetPackageIdentifierLength = 200;
const maxSourceChecksumLength = 256;
const sourceChecksumPattern = /^sha256:[0-9a-f]{64}$/i;
export const SOURCE_RUNTIME_MAX_BYTES = 50 * 1024 * 1024;
const sourceMimeTypes = new Map<SourceDocumentType, ReadonlySet<string>>([
  ["pdf", new Set(["application/pdf"])],
  ["docx", new Set(["application/vnd.openxmlformats-officedocument.wordprocessingml.document"])],
  ["spreadsheet", new Set(["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"])],
  ["manual", new Set(["text/plain", "text/markdown"])],
  ["ai-draft", new Set(["application/json", "text/plain"])],
]);

export const reviewOnlySourceBlockedActions = [
  "No source file write or replacement",
  "No OCR/parser promotion",
  "No teacher draft creation",
  "No AI extraction direct assignment",
  "No raw source as student payload",
] as const;

export function validateSourceRuntimeRequest(request: SourceRuntimeRequest): string[] {
  const errors: string[] = [];

  if (!isRecord(request)) return ["source runtime request must be an object"];

  for (const field of [
    "filePolicyAccepted",
    "scanPassed",
    "sourceLineageReviewed",
    "rightsReviewAccepted",
    "ocrUsed",
    "ocrConfidenceReviewed",
    "segmentationReviewed",
    "schemaReviewPassed",
    "targetMappingReviewed",
    "packageRuntimeApproved",
    "teacherReleaseApproved",
    "rawSourceAsStudentPayloadRequested",
    "draftCreationRequested",
    "aiExtractionRequested",
    "studentFacingUseRequested",
  ] as const) {
    if (typeof request[field] !== "boolean") errors.push(`${field} must be a boolean`);
  }

  const filePolicyAccepted = request.filePolicyAccepted === true;
  const scanPassed = request.scanPassed === true;
  const sourceLineageReviewed = request.sourceLineageReviewed === true;
  const rightsReviewAccepted = request.rightsReviewAccepted === true;
  const ocrUsed = request.ocrUsed === true;
  const ocrConfidenceReviewed = request.ocrConfidenceReviewed === true;
  const segmentationReviewed = request.segmentationReviewed === true;
  const schemaReviewPassed = request.schemaReviewPassed === true;
  const targetMappingReviewed = request.targetMappingReviewed === true;
  const packageRuntimeApproved = request.packageRuntimeApproved === true;
  const teacherReleaseApproved = request.teacherReleaseApproved === true;
  const rawSourceAsStudentPayloadRequested = request.rawSourceAsStudentPayloadRequested === true;
  const draftCreationRequested = request.draftCreationRequested === true;
  const aiExtractionRequested = request.aiExtractionRequested === true;
  const studentFacingUseRequested = request.studentFacingUseRequested === true;

  const tenantId = readText(request.tenantId);
  const sourceId = readText(request.sourceId);
  const targetPackageId = readText(request.targetPackageId);
  const sourceChecksum = readText(request.sourceChecksum);
  const sourceMimeType = readText(request.sourceMimeType);
  const sourceType = readText(request.sourceType);
  const extractionMethod = readText(request.extractionMethod);
  const contentReviewStatus = readText(request.contentReviewStatus);
  const extractionReviewStatus = readText(request.extractionReviewStatus);

  if (!tenantId) errors.push("tenantId is required");
  else if (tenantId.length > maxSourceIdentifierLength || !safeIdentifierPattern.test(tenantId)) errors.push("tenantId must be a bounded safe identifier");
  if (!sourceId) errors.push("sourceId is required");
  else if (sourceId.length > maxSourceIdentifierLength || !safeIdentifierPattern.test(sourceId)) errors.push("sourceId must be a bounded safe identifier");
  if (!targetPackageId) errors.push("targetPackageId is required");
  else if (targetPackageId.length > maxTargetPackageIdentifierLength || !safeIdentifierPattern.test(targetPackageId)) errors.push("targetPackageId must be a bounded safe identifier");
  if (!sourceChecksum) errors.push("source checksum is required");
  else if (sourceChecksum.length > maxSourceChecksumLength) errors.push("source checksum is too long");
  else if (!sourceChecksumPattern.test(sourceChecksum)) errors.push("source checksum must use sha256:<64 hexadecimal characters> format");
  if (!sourceMimeType) errors.push("source MIME type is required");
  else if (!sourceMimeTypes.get(sourceType as SourceDocumentType)?.has(sourceMimeType)) errors.push("source MIME type is incompatible with source document type");
  if (!Number.isInteger(request.sourceByteLength) || request.sourceByteLength <= 0) errors.push("source byte length must be a positive integer");
  else if (request.sourceByteLength > SOURCE_RUNTIME_MAX_BYTES) errors.push(`source byte length cannot exceed ${SOURCE_RUNTIME_MAX_BYTES} bytes`);
  if (!sourceDocumentTypes.has(sourceType as SourceDocumentType)) errors.push("source document type is unsupported");
  if (!sourceExtractionMethods.has(extractionMethod as SourceExtractionMethod)) errors.push("source extraction method is unsupported");
  if (!contentReviewStatuses.has(contentReviewStatus as ContentReviewStatus)) errors.push("source content review status is unsupported");
  if (!sourceExtractionReviewStatuses.has(extractionReviewStatus as SourceExtractionReviewStatus)) errors.push("source extraction review status is unsupported");
  if (!filePolicyAccepted) errors.push("accepted upload file policy is required");
  if (!scanPassed) errors.push("source file scan must pass before extraction");
  if (!sourceLineageReviewed) errors.push("source lineage review is required");
  if (!rightsReviewAccepted) errors.push("source rights review is required");
  if (rawSourceAsStudentPayloadRequested) errors.push("raw source files cannot become student payloads");
  if (request.contentReviewStatus === "rejected") errors.push("rejected source content cannot enter the runtime");

  if (ocrUsed && !ocrConfidenceReviewed) {
    errors.push("OCR confidence and uncertain spans must be reviewed before promotion");
  }

  if (aiExtractionRequested && request.extractionMethod !== "ai-assisted") {
    errors.push("AI extraction requests must declare the ai-assisted extraction method");
  }

  if (draftCreationRequested) {
    if (request.extractionReviewStatus !== "accepted") errors.push("teacher draft creation requires accepted extraction review");
    if (!segmentationReviewed) errors.push("teacher draft creation requires reviewed unit segmentation");
    if (!schemaReviewPassed) errors.push("teacher draft creation requires a passed schema review");
    if (!targetMappingReviewed) errors.push("teacher draft creation requires reviewed target mapping");
  }

  if (studentFacingUseRequested) {
    if (!packageRuntimeApproved) errors.push("student-facing source use requires content package runtime approval");
    if (!teacherReleaseApproved) errors.push("student-facing source use requires teacher or tenant release approval");
    if (request.extractionReviewStatus !== "accepted") errors.push("student-facing source use requires accepted extraction review");
    if (!draftCreationRequested) errors.push("student-facing source use requires a reviewed teacher draft path");
  }

  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function createReviewOnlySourceRuntimeAdapter(): SourceRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateSourceRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlySourceBlockedActions,
        "No source runtime adapter has been selected for live use",
      ];

      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-source-runtime-request" : "review-only-source-runtime",
        reasons: [...new Set(reasons)],
        extractionReviewStatus: request.extractionReviewStatus,
      };
    },
    execute(request) {
      return {
        request,
        decision: this.evaluate(request),
        sideEffect: "none",
      };
    },
  };
}
