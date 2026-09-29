import { isUploadQuarantineSafeTenantId } from "./uploadQuarantineIntake";

export type UploadQuarantineReviewDecisionStatus = "accepted-for-package-review" | "changes-required";

export interface UploadQuarantineReviewDecisionRecord {
  recordVersion: 1;
  decisionId: string;
  tenantId: string;
  quarantineId: string;
  sourceId: string;
  packageId: string;
  unitKey?: string;
  evidencePacketId: string;
  reviewerId: string;
  decision: UploadQuarantineReviewDecisionStatus;
  reviewerNote: string;
  reviewedFields: string[];
  unresolvedBlockers: string[];
  capturedAt: string;
  storageMode: "local-quarantine-review-metadata";
  approvalCaptured: false;
  evidenceAttachmentWriteAllowed: false;
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function createUploadQuarantineReviewDecisionRecord(input: Omit<UploadQuarantineReviewDecisionRecord, "recordVersion" | "storageMode" | "approvalCaptured" | "evidenceAttachmentWriteAllowed" | "packageAssemblyAllowed" | "promotionAllowed" | "studentFacingUseAllowed" | "mode" | "sideEffect">): UploadQuarantineReviewDecisionRecord {
  const record: UploadQuarantineReviewDecisionRecord = {
    ...input,
    recordVersion: 1,
    storageMode: "local-quarantine-review-metadata",
    approvalCaptured: false,
    evidenceAttachmentWriteAllowed: false,
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
  const errors = validateUploadQuarantineReviewDecisionRecord(record);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return record;
}

export function validateUploadQuarantineReviewDecisionRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine review decision record must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine review decision recordVersion must be 1.");
  for (const field of ["decisionId", "tenantId", "quarantineId", "sourceId", "packageId", "evidencePacketId", "reviewerId", "reviewerNote", "capturedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Upload quarantine review decision ${field} must be non-empty.`);
  }
  if (value.unitKey !== undefined && !isNonEmptyString(value.unitKey)) errors.push("Upload quarantine review decision unitKey must be non-empty when present.");
  if (!isUploadQuarantineSafeTenantId(value.tenantId)) errors.push("Upload quarantine review decision tenant identity is unsafe.");
  if (!/^q-[0-9a-f-]{36}$/.test(String(value.quarantineId ?? ""))) errors.push("Upload quarantine review decision quarantine identity is not opaque.");
  if (!isSafeIdentifier(value.decisionId) || !isSafeIdentifier(value.sourceId) || !isSafeIdentifier(value.packageId) || !isSafeIdentifier(value.evidencePacketId)) {
    errors.push("Upload quarantine review decision identities must be bounded safe identifiers.");
  }
  if (!isSafeReviewerId(value.reviewerId)) errors.push("Upload quarantine review decision reviewerId must be a bounded operator identifier.");
  if (!(value.decision === "accepted-for-package-review" || value.decision === "changes-required")) errors.push("Upload quarantine review decision status is unsupported.");
  if (typeof value.reviewerNote === "string" && (value.reviewerNote.length > 2000 || value.reviewerNote.trim().length === 0)) errors.push("Upload quarantine review decision reviewerNote must be between 1 and 2000 characters.");
  if (!Array.isArray(value.reviewedFields) || value.reviewedFields.length === 0 || value.reviewedFields.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine review decision reviewedFields must contain non-empty strings.");
  if (!Array.isArray(value.unresolvedBlockers) || value.unresolvedBlockers.length === 0 || value.unresolvedBlockers.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine review decision unresolvedBlockers must contain non-empty strings.");
  if (typeof value.capturedAt === "string" && Number.isNaN(Date.parse(value.capturedAt))) errors.push("Upload quarantine review decision capturedAt must be a valid timestamp.");
  for (const field of ["approvalCaptured", "evidenceAttachmentWriteAllowed", "packageAssemblyAllowed", "promotionAllowed", "studentFacingUseAllowed"] as const) {
    if (value[field] !== false) errors.push(`Upload quarantine review decision ${field} must remain false.`);
  }
  if (value.storageMode !== "local-quarantine-review-metadata") errors.push("Upload quarantine review decision storageMode must remain local metadata only.");
  if (value.mode !== "review-only") errors.push("Upload quarantine review decision must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Upload quarantine review decision must remain side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeIdentifier(value: unknown): value is string {
  return isNonEmptyString(value) && value.length <= 200 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value);
}

function isSafeReviewerId(value: unknown): value is string {
  return isNonEmptyString(value) && value.length <= 160 && /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(value);
}
