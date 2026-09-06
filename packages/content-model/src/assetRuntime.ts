export type AssetRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";
export type AssetRuntimeOperation = "intake" | "review" | "promote" | "bind" | "export";
export type AssetRuntimeKind = "image" | "audio" | "video" | "font" | "source-document";
export type AssetScanStatus = "pending" | "passed" | "failed";
export type AssetSourceReviewStatus = "unreviewed" | "reviewed" | "approved" | "rejected";
export type AssetRightsStatus = "owned" | "licensed" | "partner-provided" | "unknown";

export interface AssetRuntimeRequest {
  tenantId: string;
  assetId: string;
  unitKey?: string;
  operation: AssetRuntimeOperation;
  kind: AssetRuntimeKind;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  scanStatus: AssetScanStatus;
  rightsStatus: AssetRightsStatus;
  sourceReviewStatus: AssetSourceReviewStatus;
  targetMappingReviewed: boolean;
  storagePolicyAccepted: boolean;
  releaseApproved: boolean;
  sizeBudgetAccepted: boolean;
  containsLearnerMedia: boolean;
  learnerUpload: boolean;
  studentFacingUseRequested: boolean;
}

export interface AssetRuntimeDecision {
  allowed: boolean;
  mode: AssetRuntimeMode;
  reasonCode: string;
  reasons: string[];
}

export interface AssetRuntimeResult {
  request: AssetRuntimeRequest;
  decision: AssetRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface AssetRuntimeAdapter {
  readonly mode: AssetRuntimeMode;
  evaluate(request: AssetRuntimeRequest): AssetRuntimeDecision;
  execute(request: AssetRuntimeRequest): AssetRuntimeResult;
}

export const reviewOnlyAssetBlockedActions = [
  "No file upload",
  "No media transcode or copy",
  "No student-facing asset promotion",
  "No local bundle or hosted object write",
  "No QR, playlist, or game manifest mutation",
] as const;

export function validateAssetRuntimeRequest(request: AssetRuntimeRequest): string[] {
  const errors: string[] = [];

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.assetId.trim()) errors.push("assetId is required");
  if (!request.kind.trim()) errors.push("asset kind is required");
  if (!request.mimeType.trim()) errors.push("MIME type is required");
  if (!request.checksum.trim()) errors.push("asset checksum is required");
  if (!Number.isFinite(request.sizeBytes) || request.sizeBytes <= 0) errors.push("asset size must be a positive number");
  if (!request.storagePolicyAccepted) errors.push("accepted tenant or school storage policy is required");
  if (!request.sizeBudgetAccepted) errors.push("asset size budget review is required");
  if (request.scanStatus !== "passed") errors.push("asset scan must pass before review or promotion");
  if (request.rightsStatus === "unknown") errors.push("media or source rights status cannot be unknown");
  if (request.sourceReviewStatus === "unreviewed" || request.sourceReviewStatus === "rejected") {
    errors.push("source review must be reviewed or approved");
  }
  if (request.containsLearnerMedia) errors.push("learner-recorded media is excluded from the core asset runtime");
  if (request.learnerUpload) errors.push("learner uploads are excluded from the core asset runtime");

  if (["promote", "bind", "export"].includes(request.operation)) {
    if (!request.targetMappingReviewed) errors.push("target unit or game mapping review is required before asset promotion");
    if (request.sourceReviewStatus !== "approved") errors.push("asset promotion requires approved source review");
    if (!request.releaseApproved) errors.push("release approval is required before asset promotion, binding, or export");
  }

  if (request.studentFacingUseRequested) {
    if (request.operation !== "promote") errors.push("student-facing asset use requires the promote operation");
    if (!request.targetMappingReviewed) errors.push("student-facing asset use requires reviewed target mapping");
    if (!request.releaseApproved) errors.push("student-facing asset use requires release approval");
  }

  return [...new Set(errors)];
}

export function createReviewOnlyAssetRuntimeAdapter(): AssetRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateAssetRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyAssetBlockedActions,
        "No asset runtime adapter has been selected for live use",
      ];

      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-asset-runtime-request" : "review-only-asset-runtime",
        reasons: [...new Set(reasons)],
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
