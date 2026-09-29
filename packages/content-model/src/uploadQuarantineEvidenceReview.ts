import {
  isUploadQuarantineSafeTenantId,
  type UploadQuarantineIntakeRecord,
} from "./uploadQuarantineIntake";
import type {
  UploadQuarantineRightsStatus,
  UploadQuarantineScanStatus,
  UploadQuarantineSourceReviewStatus,
} from "./uploadQuarantineAdmission";

export interface UploadQuarantineEvidenceReviewRecord {
  recordVersion: 1;
  reviewId: string;
  tenantId: string;
  quarantineId: string;
  sourceId: string;
  packageId: string;
  evidencePacketId: string;
  scanStatus: UploadQuarantineScanStatus;
  rightsStatus: UploadQuarantineRightsStatus;
  sourceReviewStatus: UploadQuarantineSourceReviewStatus;
  targetMappingReviewed: boolean;
  accessibilityReviewed: boolean;
  releaseApproved: boolean;
  reviewerId: string;
  reviewerNote: string;
  reviewedFields: string[];
  unresolvedBlockers: string[];
  status: "blocked" | "evidence-ready";
  capturedAt: string;
  storageMode: "local-quarantine-evidence-review-metadata";
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantineEvidenceReviewRecord(input: {
  intake: UploadQuarantineIntakeRecord;
  sourceId: string;
  packageId: string;
  evidencePacketId: string;
  scanStatus: UploadQuarantineScanStatus;
  rightsStatus: UploadQuarantineRightsStatus;
  sourceReviewStatus: UploadQuarantineSourceReviewStatus;
  targetMappingReviewed: boolean;
  accessibilityReviewed: boolean;
  releaseApproved: boolean;
  reviewerId: string;
  reviewerNote: string;
  reviewedFields: string[];
  capturedAt: string;
}): UploadQuarantineEvidenceReviewRecord {
  const unresolvedBlockers = [
    ...(input.scanStatus === "passed" ? [] : [input.scanStatus === "failed" ? "Security scan failed." : "Security scan evidence is not recorded as passed."]),
    ...(input.rightsStatus === "unknown" ? ["Rights proof is required."] : []),
    ...(input.sourceReviewStatus === "approved" ? [] : ["Source review approval is required."]),
    ...(input.targetMappingReviewed ? [] : ["Target mapping review is required."]),
    ...(input.accessibilityReviewed ? [] : ["Accessibility review is required."]),
    ...(input.releaseApproved ? [] : ["Release-control evidence is required before package review can advance."]),
  ];
  const record: UploadQuarantineEvidenceReviewRecord = {
    recordVersion: 1,
    reviewId: `${input.packageId}:${input.intake.intakeId}:evidence-review`,
    tenantId: input.intake.tenantId,
    quarantineId: input.intake.intakeId,
    sourceId: input.sourceId,
    packageId: input.packageId,
    evidencePacketId: input.evidencePacketId,
    scanStatus: input.scanStatus,
    rightsStatus: input.rightsStatus,
    sourceReviewStatus: input.sourceReviewStatus,
    targetMappingReviewed: input.targetMappingReviewed,
    accessibilityReviewed: input.accessibilityReviewed,
    releaseApproved: input.releaseApproved,
    reviewerId: input.reviewerId,
    reviewerNote: input.reviewerNote,
    reviewedFields: [...input.reviewedFields],
    unresolvedBlockers: [...new Set(unresolvedBlockers)],
    status: unresolvedBlockers.length === 0 ? "evidence-ready" : "blocked",
    capturedAt: input.capturedAt,
    storageMode: "local-quarantine-evidence-review-metadata",
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateUploadQuarantineEvidenceReviewRecord(record);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return record;
}

export function validateUploadQuarantineEvidenceReviewRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine evidence review record must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine evidence review recordVersion must be 1.");
  for (const field of ["reviewId", "tenantId", "quarantineId", "sourceId", "packageId", "evidencePacketId", "reviewerId", "reviewerNote", "capturedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine evidence review ${field} must be non-empty.`);
  }
  if (!isUploadQuarantineSafeTenantId(value.tenantId)) errors.push("Upload quarantine evidence review tenant identity is unsafe.");
  if (!/^q-[0-9a-f-]{36}$/.test(String(value.quarantineId ?? ""))) errors.push("Upload quarantine evidence review quarantine identity is not opaque.");
  if (!isSafeIdentifier(value.reviewId) || !isSafeIdentifier(value.sourceId) || !isSafeIdentifier(value.packageId) || !isSafeIdentifier(value.evidencePacketId)) errors.push("Upload quarantine evidence review identities must be bounded safe identifiers.");
  if (!isSafeReviewerId(value.reviewerId)) errors.push("Upload quarantine evidence review reviewerId must be bounded and safe.");
  if (typeof value.reviewerNote === "string" && (value.reviewerNote.length > 2000 || value.reviewerNote.trim().length === 0)) errors.push("Upload quarantine evidence review reviewerNote must be between 1 and 2000 characters.");
  if (!isScanStatus(value.scanStatus)) errors.push("Upload quarantine evidence review scanStatus is unsupported.");
  if (!isRightsStatus(value.rightsStatus)) errors.push("Upload quarantine evidence review rightsStatus is unsupported.");
  if (!isSourceReviewStatus(value.sourceReviewStatus)) errors.push("Upload quarantine evidence review sourceReviewStatus is unsupported.");
  for (const field of ["targetMappingReviewed", "accessibilityReviewed", "releaseApproved"] as const) if (typeof value[field] !== "boolean") errors.push(`Upload quarantine evidence review ${field} must be boolean.`);
  if (!Array.isArray(value.reviewedFields) || value.reviewedFields.length === 0 || value.reviewedFields.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine evidence review reviewedFields must contain non-empty strings.");
  if (!Array.isArray(value.unresolvedBlockers) || value.unresolvedBlockers.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine evidence review unresolvedBlockers must contain strings.");
  if (value.status !== "blocked" && value.status !== "evidence-ready") errors.push("Upload quarantine evidence review status is unsupported.");
  if (value.status === "evidence-ready" && Array.isArray(value.unresolvedBlockers) && value.unresolvedBlockers.length > 0) errors.push("Evidence-ready review cannot contain blockers.");
  if (value.status === "blocked" && (!Array.isArray(value.unresolvedBlockers) || value.unresolvedBlockers.length === 0)) errors.push("Blocked evidence review must list unresolved blockers.");
  if (value.packageAssemblyAllowed !== false || value.promotionAllowed !== false || value.studentFacingUseAllowed !== false) errors.push("Upload quarantine evidence review must remain non-activating.");
  if (value.storageMode !== "local-quarantine-evidence-review-metadata") errors.push("Upload quarantine evidence review storageMode must remain local metadata only.");
  if (value.mode !== "review-only") errors.push("Upload quarantine evidence review must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Upload quarantine evidence review must remain side-effect-free.");
  if (typeof value.capturedAt === "string" && Number.isNaN(Date.parse(value.capturedAt))) errors.push("Upload quarantine evidence review capturedAt must be a valid timestamp.");
  return [...new Set(errors)];
}

function isScanStatus(value: unknown): value is UploadQuarantineScanStatus { return value === "pending" || value === "passed" || value === "failed"; }
function isRightsStatus(value: unknown): value is UploadQuarantineRightsStatus { return value === "owned" || value === "licensed" || value === "partner-provided" || value === "unknown"; }
function isSourceReviewStatus(value: unknown): value is UploadQuarantineSourceReviewStatus { return value === "unreviewed" || value === "reviewed" || value === "approved" || value === "rejected"; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeIdentifier(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value); }
function isSafeReviewerId(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 160 && /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(value); }
