export type UploadQuarantineDeliveryManifestPreviewCheckStatus = "passed" | "open" | "blocked";

export interface UploadQuarantineDeliveryManifestPreviewCheck {
  checkId: string;
  label: string;
  status: UploadQuarantineDeliveryManifestPreviewCheckStatus;
  evidence: string;
  nextAction: string;
}

export interface UploadQuarantineDeliveryManifestPreview {
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
  evidenceReviewId: string | null;
  packageReviewPacketId: string | null;
  status: "blocked";
  checks: UploadQuarantineDeliveryManifestPreviewCheck[];
  unresolvedRequirements: string[];
  blockedActions: string[];
  deliveryAllowed: false;
  packageAssemblyAllowed: false;
  qrPrintAllowed: false;
  hostedPersistenceActivated: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export const UPLOAD_QUARANTINE_DELIVERY_MANIFEST_PREVIEW_CHECKS = [
  "source-evidence",
  "package-review",
  "delivery-mode",
  "package-preview",
  "release-receipt",
  "qr-print",
] as const;

const blockedActions = [
  "No delivery manifest write",
  "No package assembly",
  "No production QR print",
  "No hosted persistence activation",
  "No student-facing use",
] as const;

export function createReviewOnlyUploadQuarantineDeliveryManifestPreview(input: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  sourceChecksumSha256: string;
  selectedMode?: "unselected" | "closed-local" | "hosted-pwa" | "hybrid";
  evidenceReviewId?: string | null;
  packageReviewPacketId?: string | null;
  checks: UploadQuarantineDeliveryManifestPreviewCheck[];
}): UploadQuarantineDeliveryManifestPreview {
  const unresolvedRequirements = input.checks
    .filter((check) => check.status !== "passed")
    .map((check) => `${check.label}: ${check.evidence}`);

  return {
    recordVersion: 1,
    previewId: `${input.packageId}:${input.quarantineId}:delivery-manifest-preview`,
    tenantId: input.tenantId,
    quarantineId: input.quarantineId,
    packageId: input.packageId,
    manifestId: `${input.packageId}:delivery-manifest`,
    releaseReceiptId: `${input.packageId}:delivery-manifest:release-receipt`,
    packageIndexId: `${input.packageId}:delivery-manifest:package-index`,
    sourceChecksumSha256: input.sourceChecksumSha256,
    selectedMode: input.selectedMode ?? "unselected",
    evidenceReviewId: input.evidenceReviewId ?? null,
    packageReviewPacketId: input.packageReviewPacketId ?? null,
    status: "blocked",
    checks: input.checks.map((check) => ({ ...check })),
    unresolvedRequirements: [...new Set(unresolvedRequirements)],
    blockedActions: [...blockedActions],
    deliveryAllowed: false,
    packageAssemblyAllowed: false,
    qrPrintAllowed: false,
    hostedPersistenceActivated: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateUploadQuarantineDeliveryManifestPreview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine delivery manifest preview must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine delivery manifest preview recordVersion must be 1.");
  for (const field of ["previewId", "tenantId", "quarantineId", "packageId", "manifestId", "releaseReceiptId", "packageIndexId", "sourceChecksumSha256"] as const) {
    if (!isSafeIdentifier(value[field])) errors.push(`Upload quarantine delivery manifest preview ${field} must be a bounded safe identifier.`);
  }
  if (!/^([a-f0-9]{64})$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Upload quarantine delivery manifest preview checksum must be lowercase SHA-256.");
  if (!["unselected", "closed-local", "hosted-pwa", "hybrid"].includes(String(value.selectedMode))) errors.push("Upload quarantine delivery manifest preview selectedMode is unsupported.");
  for (const field of ["evidenceReviewId", "packageReviewPacketId"] as const) if (value[field] !== null && !isSafeIdentifier(value[field])) errors.push(`Upload quarantine delivery manifest preview ${field} must be null or a bounded safe identifier.`);
  if (value.status !== "blocked") errors.push("Upload quarantine delivery manifest preview must remain blocked until a separate delivery manifest exists.");
  if (value.deliveryAllowed !== false || value.packageAssemblyAllowed !== false || value.qrPrintAllowed !== false || value.hostedPersistenceActivated !== false || value.studentFacingUseAllowed !== false) errors.push("Upload quarantine delivery manifest preview must remain non-activating.");
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Upload quarantine delivery manifest preview must remain review-only and side-effect-free.");
  if (!Array.isArray(value.checks) || value.checks.length === 0) errors.push("Upload quarantine delivery manifest preview checks must be non-empty.");
  const checks = Array.isArray(value.checks) ? value.checks : [];
  const seen = new Set<string>();
  for (const check of checks) {
    if (!isRecord(check)) { errors.push("Upload quarantine delivery manifest preview checks must be objects."); continue; }
    if (!isSafeIdentifier(check.checkId)) errors.push("Upload quarantine delivery manifest preview check id must be safe.");
    if (seen.has(String(check.checkId))) errors.push(`Upload quarantine delivery manifest preview contains duplicate check ${String(check.checkId)}.`);
    seen.add(String(check.checkId));
    if (!isNonEmptyString(check.label) || !isNonEmptyString(check.evidence) || !isNonEmptyString(check.nextAction)) errors.push("Upload quarantine delivery manifest preview checks require label, evidence, and nextAction.");
    if (!["passed", "open", "blocked"].includes(String(check.status))) errors.push(`Upload quarantine delivery manifest preview check ${String(check.checkId)} status is unsupported.`);
  }
  for (const checkId of UPLOAD_QUARANTINE_DELIVERY_MANIFEST_PREVIEW_CHECKS) if (!seen.has(checkId)) errors.push(`Upload quarantine delivery manifest preview is missing check ${checkId}.`);
  if (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine delivery manifest preview unresolvedRequirements must contain strings.");
  for (const action of blockedActions) if (!Array.isArray(value.blockedActions) || !value.blockedActions.includes(action)) errors.push(`Upload quarantine delivery manifest preview must block action: ${action}.`);
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
