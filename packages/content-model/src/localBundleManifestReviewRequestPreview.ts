export interface LocalBundleManifestReviewRequestPreview {
  requestVersion: 1;
  requestId: string;
  endpoint: "/api/teacher/delivery/local-package/bundle-manifest-review";
  method: "POST";
  tenantId: string;
  packageId: string;
  version: string;
  quarantineId: string;
  reviewPacketId: string;
  sourcePreflightEvidenceId: string;
  manifestChecksumSha256: string;
  reviewerId: string;
  reviewedAt: string;
  status: "review-only";
  authBoundary: "pilot-delivery-api-token";
  requiredFields: string[];
  blockedActions: string[];
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  hostedPersistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
  learnerRecordsIncluded: false;
  sideEffect: "none";
}

export function validateLocalBundleManifestReviewRequestPreview(value: unknown): string[] {
  if (!isRecord(value)) return ["Local bundle manifest review request preview must be an object."];

  const errors: string[] = [];
  if (value.requestVersion !== 1) errors.push("Local bundle manifest review request preview requestVersion must be 1.");
  if (!isNonEmptyString(value.requestId)) errors.push("Local bundle manifest review request preview requestId must be non-empty.");
  if (value.endpoint !== "/api/teacher/delivery/local-package/bundle-manifest-review") errors.push("Local bundle manifest review request preview endpoint is not canonical.");
  if (value.method !== "POST") errors.push("Local bundle manifest review request preview method must be POST.");

  for (const field of [
    "tenantId",
    "packageId",
    "version",
    "quarantineId",
    "reviewPacketId",
    "sourcePreflightEvidenceId",
    "reviewerId",
    "reviewedAt",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Local bundle manifest review request preview ${field} must be non-empty.`);
  }

  if (!/^sha256:[0-9a-f]{64}$/.test(String(value.manifestChecksumSha256 ?? ""))) {
    errors.push("Local bundle manifest review request preview checksum must use sha256:<64 lowercase hexadecimal characters>.");
  }
  if (!isIsoTimestamp(String(value.reviewedAt ?? ""))) errors.push("Local bundle manifest review request preview reviewedAt must be a valid ISO timestamp.");
  if (value.status !== "review-only") errors.push("Local bundle manifest review request preview must remain review-only.");
  if (value.authBoundary !== "pilot-delivery-api-token") errors.push("Local bundle manifest review request preview must require the pilot delivery API token.");
  if (!Array.isArray(value.requiredFields) || value.requiredFields.length === 0) errors.push("Local bundle manifest review request preview must list required fields.");
  if (!Array.isArray(value.blockedActions) || value.blockedActions.length === 0) errors.push("Local bundle manifest review request preview must list blocked actions.");
  for (const field of [
    "packageAssemblyAllowed",
    "promotionAllowed",
    "qrPrintAllowed",
    "hostedPersistenceActivationAllowed",
    "studentFacingUseAllowed",
    "learnerRecordsIncluded",
  ] as const) {
    if (value[field] !== false) errors.push(`Local bundle manifest review request preview must keep ${field}: false.`);
  }
  if (value.sideEffect !== "none") errors.push("Local bundle manifest review request preview sideEffect must be none.");

  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoTimestamp(value: string): boolean {
  return value.length > 0 && !Number.isNaN(Date.parse(value));
}
