import type { UploadQuarantineDeliveryManifestPreview } from "./uploadQuarantineDeliveryManifestPreview";

export type UploadQuarantineReleaseReceiptPreviewCheckStatus = "passed" | "open" | "blocked";

export interface UploadQuarantineReleaseReceiptPreviewCheck {
  checkId: string;
  label: string;
  status: UploadQuarantineReleaseReceiptPreviewCheckStatus;
  evidence: string;
  nextAction: string;
}

export interface UploadQuarantineReleaseReceiptPreview {
  recordVersion: 1;
  previewId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  manifestId: string;
  releaseReceiptId: string;
  packageIndexId: string;
  sourceChecksumSha256: string;
  selectedMode: "unselected" | "closed-local" | "hosted-pwa" | "hybrid";
  reviewerId: null;
  reviewerRole: null;
  rollbackReference: null;
  status: "blocked";
  releaseApproval: "pending";
  qrPrintAuthorization: "pending";
  checks: UploadQuarantineReleaseReceiptPreviewCheck[];
  unresolvedRequirements: string[];
  blockedActions: string[];
  deliveryAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export const UPLOAD_QUARANTINE_RELEASE_RECEIPT_PREVIEW_CHECKS = [
  "delivery-manifest",
  "release-approval",
  "qr-print",
  "rollback",
  "package-index",
] as const;

const blockedActions = [
  "No release receipt write from this preview",
  "No QR alias mutation or production print from this preview",
  "No local or hosted package handoff from this preview",
  "No student-facing activation from this preview",
] as const;

export function createReviewOnlyUploadQuarantineReleaseReceiptPreview(input: {
  deliveryManifestPreview: UploadQuarantineDeliveryManifestPreview;
  checks: UploadQuarantineReleaseReceiptPreviewCheck[];
}): UploadQuarantineReleaseReceiptPreview {
  const { deliveryManifestPreview } = input;
  const unresolvedRequirements = input.checks
    .filter((check) => check.status !== "passed")
    .map((check) => `${check.label}: ${check.evidence}`);
  return {
    recordVersion: 1,
    previewId: `${deliveryManifestPreview.previewId}:release-receipt-preview`,
    tenantId: deliveryManifestPreview.tenantId,
    quarantineId: deliveryManifestPreview.quarantineId,
    packageId: deliveryManifestPreview.packageId,
    manifestId: deliveryManifestPreview.manifestId,
    releaseReceiptId: deliveryManifestPreview.releaseReceiptId,
    packageIndexId: deliveryManifestPreview.packageIndexId,
    sourceChecksumSha256: deliveryManifestPreview.sourceChecksumSha256,
    selectedMode: deliveryManifestPreview.selectedMode,
    reviewerId: null,
    reviewerRole: null,
    rollbackReference: null,
    status: "blocked",
    releaseApproval: "pending",
    qrPrintAuthorization: "pending",
    checks: input.checks.map((check) => ({ ...check })),
    unresolvedRequirements: [...new Set(unresolvedRequirements)],
    blockedActions: [...blockedActions],
    deliveryAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateUploadQuarantineReleaseReceiptPreview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine release receipt preview must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine release receipt preview recordVersion must be 1.");
  for (const field of ["previewId", "tenantId", "quarantineId", "packageId", "manifestId", "releaseReceiptId", "packageIndexId"] as const) {
    if (!isSafeIdentifier(value[field])) errors.push(`Upload quarantine release receipt preview ${field} must be a bounded safe identifier.`);
  }
  if (!/^([a-f0-9]{64})$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Upload quarantine release receipt preview checksum must be lowercase SHA-256.");
  if (!["unselected", "closed-local", "hosted-pwa", "hybrid"].includes(String(value.selectedMode))) errors.push("Upload quarantine release receipt preview selectedMode is unsupported.");
  if (value.reviewerId !== null || value.reviewerRole !== null || value.rollbackReference !== null) errors.push("Upload quarantine release receipt preview reviewer and rollback fields must remain null.");
  if (value.status !== "blocked" || value.releaseApproval !== "pending" || value.qrPrintAuthorization !== "pending") errors.push("Upload quarantine release receipt preview must remain pending and blocked.");
  if (value.deliveryAllowed !== false || value.qrPrintAllowed !== false || value.studentFacingUseAllowed !== false) errors.push("Upload quarantine release receipt preview must remain non-activating.");
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Upload quarantine release receipt preview must remain review-only and side-effect-free.");
  if (!Array.isArray(value.checks) || value.checks.length === 0) errors.push("Upload quarantine release receipt preview checks must be non-empty.");
  const checks = Array.isArray(value.checks) ? value.checks : [];
  const seen = new Set<string>();
  for (const check of checks) {
    if (!isRecord(check)) { errors.push("Upload quarantine release receipt preview checks must be objects."); continue; }
    if (!isSafeIdentifier(check.checkId)) errors.push("Upload quarantine release receipt preview check id must be safe.");
    if (seen.has(String(check.checkId))) errors.push(`Upload quarantine release receipt preview contains duplicate check ${String(check.checkId)}.`);
    seen.add(String(check.checkId));
    if (!isNonEmptyString(check.label) || !isNonEmptyString(check.evidence) || !isNonEmptyString(check.nextAction)) errors.push("Upload quarantine release receipt preview checks require label, evidence, and nextAction.");
    if (!["passed", "open", "blocked"].includes(String(check.status))) errors.push(`Upload quarantine release receipt preview check ${String(check.checkId)} status is unsupported.`);
  }
  for (const checkId of UPLOAD_QUARANTINE_RELEASE_RECEIPT_PREVIEW_CHECKS) if (!seen.has(checkId)) errors.push(`Upload quarantine release receipt preview is missing check ${checkId}.`);
  if (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine release receipt preview unresolvedRequirements must contain strings.");
  for (const action of blockedActions) if (!Array.isArray(value.blockedActions) || !value.blockedActions.includes(action)) errors.push(`Upload quarantine release receipt preview must block action: ${action}.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeIdentifier(value: unknown): value is string {
  return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value);
}
