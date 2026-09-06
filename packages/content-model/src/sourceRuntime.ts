import type { ContentReviewStatus, SourceDocumentType } from "./index";

export type SourceRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";
export type SourceExtractionMethod = "manual-structure" | "pdf-text" | "ocr" | "docx-parse" | "spreadsheet-import" | "ai-assisted";
export type SourceExtractionReviewStatus = "not-started" | "in-review" | "accepted" | "rejected";

export interface SourceRuntimeRequest {
  tenantId: string;
  sourceId: string;
  targetPackageId: string;
  sourceType: SourceDocumentType;
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

export const reviewOnlySourceBlockedActions = [
  "No source file write or replacement",
  "No OCR/parser promotion",
  "No teacher draft creation",
  "No AI extraction direct assignment",
  "No raw source as student payload",
] as const;

export function validateSourceRuntimeRequest(request: SourceRuntimeRequest): string[] {
  const errors: string[] = [];

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.sourceId.trim()) errors.push("sourceId is required");
  if (!request.targetPackageId.trim()) errors.push("targetPackageId is required");
  if (!request.sourceChecksum.trim()) errors.push("source checksum is required");
  if (!request.filePolicyAccepted) errors.push("accepted upload file policy is required");
  if (!request.scanPassed) errors.push("source file scan must pass before extraction");
  if (!request.sourceLineageReviewed) errors.push("source lineage review is required");
  if (!request.rightsReviewAccepted) errors.push("source rights review is required");
  if (request.rawSourceAsStudentPayloadRequested) errors.push("raw source files cannot become student payloads");
  if (request.contentReviewStatus === "rejected") errors.push("rejected source content cannot enter the runtime");

  if (request.ocrUsed && !request.ocrConfidenceReviewed) {
    errors.push("OCR confidence and uncertain spans must be reviewed before promotion");
  }

  if (request.aiExtractionRequested && request.extractionMethod !== "ai-assisted") {
    errors.push("AI extraction requests must declare the ai-assisted extraction method");
  }

  if (request.draftCreationRequested) {
    if (request.extractionReviewStatus !== "accepted") errors.push("teacher draft creation requires accepted extraction review");
    if (!request.segmentationReviewed) errors.push("teacher draft creation requires reviewed unit segmentation");
    if (!request.schemaReviewPassed) errors.push("teacher draft creation requires a passed schema review");
    if (!request.targetMappingReviewed) errors.push("teacher draft creation requires reviewed target mapping");
  }

  if (request.studentFacingUseRequested) {
    if (!request.packageRuntimeApproved) errors.push("student-facing source use requires content package runtime approval");
    if (!request.teacherReleaseApproved) errors.push("student-facing source use requires teacher or tenant release approval");
    if (request.extractionReviewStatus !== "accepted") errors.push("student-facing source use requires accepted extraction review");
    if (!request.draftCreationRequested) errors.push("student-facing source use requires a reviewed teacher draft path");
  }

  return [...new Set(errors)];
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
