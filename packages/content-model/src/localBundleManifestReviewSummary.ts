export type LocalBundleManifestReviewSummaryStatus = "available" | "not-found" | "blocked";

/**
 * Bounded, metadata-only operator-facing data for a reviewed local bundle manifest.
 * The canonical manifest body and custody path stay server-side.
 */
export interface LocalBundleManifestReviewSummary {
  status: LocalBundleManifestReviewSummaryStatus;
  tenantId: string;
  packageId: string;
  version: string | null;
  recordId: string | null;
  reviewPacketId: string | null;
  sourcePreflightEvidenceId: string | null;
  manifestChecksumSha256: string | null;
  reviewerId: string | null;
  reviewedAt: string | null;
  errors: string[];
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  hostedPersistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export function validateLocalBundleManifestReviewSummary(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local bundle manifest review summary must be an object."];
  if (!(["available", "not-found", "blocked"] as const).includes(value.status as LocalBundleManifestReviewSummaryStatus)) errors.push("Local bundle manifest review summary status is unsupported.");
  for (const field of ["tenantId", "packageId"] as const) if (!isNonEmptyString(value[field])) errors.push(`Local bundle manifest review summary ${field} must be non-empty.`);
  for (const field of ["version", "recordId", "reviewPacketId", "sourcePreflightEvidenceId", "manifestChecksumSha256", "reviewerId", "reviewedAt"] as const) {
    if (value[field] !== null && !isNonEmptyString(value[field])) errors.push(`Local bundle manifest review summary ${field} must be null or non-empty.`);
  }
  if (value.manifestChecksumSha256 !== null && !/^sha256:[0-9a-f]{64}$/.test(String(value.manifestChecksumSha256))) errors.push("Local bundle manifest review summary checksum must use sha256:<64 lowercase hexadecimal characters>.");
  if (!Array.isArray(value.errors) || value.errors.some((item) => !isNonEmptyString(item))) errors.push("Local bundle manifest review summary errors must contain strings.");
  for (const field of ["packageAssemblyAllowed", "promotionAllowed", "qrPrintAllowed", "hostedPersistenceActivationAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`Local bundle manifest review summary must keep ${field}: false.`);
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Local bundle manifest review summary must remain review-only and side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
