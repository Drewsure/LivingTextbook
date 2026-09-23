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

const assetRuntimeOperations = new Set<AssetRuntimeOperation>(["intake", "review", "promote", "bind", "export"]);
const assetRuntimeKinds = new Set<AssetRuntimeKind>(["image", "audio", "video", "font", "source-document"]);
const assetRuntimeScanStatuses = new Set<AssetScanStatus>(["pending", "passed", "failed"]);
const assetRuntimeRightsStatuses = new Set<AssetRightsStatus>(["owned", "licensed", "partner-provided", "unknown"]);
const assetRuntimeSourceReviewStatuses = new Set<AssetSourceReviewStatus>(["unreviewed", "reviewed", "approved", "rejected"]);
const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const mimeTypePattern = /^[^\s/]+\/[^\s/]+$/;
const maxAssetIdentifierLength = 160;
const maxUnitKeyLength = 240;
const maxMimeTypeLength = 128;
const maxChecksumLength = 256;
export const ASSET_RUNTIME_MAX_BYTES = 256 * 1024 * 1024;
const assetMimeTypes = new Map<AssetRuntimeKind, ReadonlySet<string>>([
  ["image", new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"])],
  ["audio", new Set(["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg"])],
  ["video", new Set(["video/mp4", "video/webm", "video/quicktime"])],
  ["font", new Set(["font/woff", "font/woff2", "font/ttf", "application/font-woff", "application/vnd.ms-fontobject"])],
  ["source-document", new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "text/markdown", "text/csv"])],
]);

export const reviewOnlyAssetBlockedActions = [
  "No file upload",
  "No media transcode or copy",
  "No student-facing asset promotion",
  "No local bundle or hosted object write",
  "No QR, playlist, or game manifest mutation",
] as const;

export function validateAssetRuntimeRequest(request: AssetRuntimeRequest): string[] {
  const errors: string[] = [];

  if (!isRecord(request)) return ["asset runtime request must be an object"];

  for (const field of [
    "targetMappingReviewed",
    "storagePolicyAccepted",
    "releaseApproved",
    "sizeBudgetAccepted",
    "containsLearnerMedia",
    "learnerUpload",
    "studentFacingUseRequested",
  ] as const) {
    if (typeof request[field] !== "boolean") errors.push(`${field} must be a boolean`);
  }

  const targetMappingReviewed = request.targetMappingReviewed === true;
  const storagePolicyAccepted = request.storagePolicyAccepted === true;
  const releaseApproved = request.releaseApproved === true;
  const sizeBudgetAccepted = request.sizeBudgetAccepted === true;
  const containsLearnerMedia = request.containsLearnerMedia === true;
  const learnerUpload = request.learnerUpload === true;
  const studentFacingUseRequested = request.studentFacingUseRequested === true;

  const tenantId = readText(request.tenantId);
  const assetId = readText(request.assetId);
  const unitKey = readText(request.unitKey);
  const kind = readText(request.kind);
  const operation = readText(request.operation);
  const mimeType = readText(request.mimeType);
  const checksum = readText(request.checksum);

  if (!tenantId) errors.push("tenantId is required");
  else if (tenantId.length > maxAssetIdentifierLength || !safeIdentifierPattern.test(tenantId)) errors.push("tenantId must be a bounded safe identifier");
  if (!assetId) errors.push("assetId is required");
  else if (assetId.length > maxAssetIdentifierLength || !safeIdentifierPattern.test(assetId)) errors.push("assetId must be a bounded safe identifier");
  if (unitKey && unitKey.length > maxUnitKeyLength) errors.push("unitKey is too long");
  if (!assetRuntimeOperations.has(operation as AssetRuntimeOperation)) errors.push("asset operation is unsupported");
  if (!assetRuntimeKinds.has(kind as AssetRuntimeKind)) errors.push("asset kind is unsupported");
  if (!mimeType) errors.push("MIME type is required");
  else if (mimeType.length > maxMimeTypeLength || !mimeTypePattern.test(mimeType)) errors.push("MIME type must be a bounded type/subtype value");
  else if (!assetMimeTypes.get(kind as AssetRuntimeKind)?.has(mimeType)) errors.push("asset MIME type is incompatible with asset kind");
  if (!checksum) errors.push("asset checksum is required");
  else if (checksum.length > maxChecksumLength) errors.push("asset checksum is too long");
  if (!assetRuntimeScanStatuses.has(request.scanStatus)) errors.push("asset scan status is unsupported");
  if (!assetRuntimeRightsStatuses.has(request.rightsStatus)) errors.push("asset rights status is unsupported");
  if (!assetRuntimeSourceReviewStatuses.has(request.sourceReviewStatus)) errors.push("asset source review status is unsupported");
  if (!Number.isInteger(request.sizeBytes) || request.sizeBytes <= 0) errors.push("asset size must be a positive integer");
  else if (request.sizeBytes > ASSET_RUNTIME_MAX_BYTES) errors.push(`asset size cannot exceed ${ASSET_RUNTIME_MAX_BYTES} bytes`);
  if (!storagePolicyAccepted) errors.push("accepted tenant or school storage policy is required");
  if (!sizeBudgetAccepted) errors.push("asset size budget review is required");
  if (request.scanStatus !== "passed") errors.push("asset scan must pass before review or promotion");
  if (request.rightsStatus === "unknown") errors.push("media or source rights status cannot be unknown");
  if (request.sourceReviewStatus === "unreviewed" || request.sourceReviewStatus === "rejected") {
    errors.push("source review must be reviewed or approved");
  }
  if (containsLearnerMedia) errors.push("learner-recorded media is excluded from the core asset runtime");
  if (learnerUpload) errors.push("learner uploads are excluded from the core asset runtime");

  if (["promote", "bind", "export"].includes(request.operation)) {
    if (!targetMappingReviewed) errors.push("target unit or game mapping review is required before asset promotion");
    if (request.sourceReviewStatus !== "approved") errors.push("asset promotion requires approved source review");
    if (!releaseApproved) errors.push("release approval is required before asset promotion, binding, or export");
  }

  if (studentFacingUseRequested) {
    if (request.operation !== "promote") errors.push("student-facing asset use requires the promote operation");
    if (!targetMappingReviewed) errors.push("student-facing asset use requires reviewed target mapping");
    if (!releaseApproved) errors.push("student-facing asset use requires release approval");
  }

  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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
