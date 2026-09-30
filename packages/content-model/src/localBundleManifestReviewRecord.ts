import type { LocalBundleManifest } from "./localBundleManifest";
import { validateLocalBundleManifest } from "./localBundleManifest";

export interface LocalBundleManifestReviewRecord {
  recordVersion: 1;
  recordId: string;
  tenantId: string;
  packageId: string;
  version: string;
  quarantineId: string;
  reviewPacketId: string;
  sourcePreflightEvidenceId: string;
  manifestChecksumSha256: string;
  manifest: LocalBundleManifest;
  status: "reviewed-for-assembly";
  reviewerId: string;
  reviewedAt: string;
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  qrPrintAllowed: false;
  hostedPersistenceActivationAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
  learnerRecordsIncluded: false;
}

export function createLocalBundleManifestReviewRecord(input: Omit<
  LocalBundleManifestReviewRecord,
  "recordVersion" | "recordId" | "status" | "packageAssemblyAllowed" | "promotionAllowed" | "qrPrintAllowed" | "hostedPersistenceActivationAllowed" | "studentFacingUseAllowed" | "mode" | "sideEffect" | "learnerRecordsIncluded"
> & { recordId?: string; manifestChecksumSha256: string }): LocalBundleManifestReviewRecord {
  return {
    recordVersion: 1,
    recordId: input.recordId ?? `${input.tenantId}:${input.packageId}:${input.version}:bundle-manifest-review`,
    tenantId: input.tenantId,
    packageId: input.packageId,
    version: input.version,
    quarantineId: input.quarantineId,
    reviewPacketId: input.reviewPacketId,
    sourcePreflightEvidenceId: input.sourcePreflightEvidenceId,
    manifestChecksumSha256: input.manifestChecksumSha256,
    manifest: input.manifest,
    status: "reviewed-for-assembly",
    reviewerId: input.reviewerId,
    reviewedAt: input.reviewedAt,
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    qrPrintAllowed: false,
    hostedPersistenceActivationAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
    learnerRecordsIncluded: false,
  };
}

export function validateLocalBundleManifestReviewRecord(value: unknown): string[] {
  if (!isRecord(value)) return ["Local bundle manifest review record must be an object."];
  const errors: string[] = [];
  if (value.recordVersion !== 1) errors.push("Local bundle manifest review record recordVersion must be 1.");
  for (const field of ["recordId", "tenantId", "packageId", "version", "quarantineId", "reviewPacketId", "sourcePreflightEvidenceId", "reviewerId", "reviewedAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Local bundle manifest review record ${field} must be non-empty.`);
  }
  if (!/^sha256:[0-9a-f]{64}$/.test(String(value.manifestChecksumSha256 ?? ""))) errors.push("Local bundle manifest review record checksum must use sha256:<64 lowercase hexadecimal characters>.");
  errors.push(...validateLocalBundleManifest(value.manifest).errors);
  if (value.status !== "reviewed-for-assembly") errors.push("Local bundle manifest review record must be reviewed-for-assembly.");
  for (const field of ["packageAssemblyAllowed", "promotionAllowed", "qrPrintAllowed", "hostedPersistenceActivationAllowed", "studentFacingUseAllowed", "learnerRecordsIncluded"] as const) {
    if (value[field] !== false) errors.push(`Local bundle manifest review record must keep ${field}: false.`);
  }
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Local bundle manifest review record must remain review-only and side-effect-free.");
  if (!isIsoTimestamp(String(value.reviewedAt ?? ""))) errors.push("Local bundle manifest review record reviewedAt must be a valid ISO timestamp.");
  if (isRecord(value.manifest)) {
    if (value.manifest.tenant_id !== value.tenantId) errors.push("Local bundle manifest review record tenant does not match the manifest.");
    if (value.manifest.version !== value.version) errors.push("Local bundle manifest review record version does not match the manifest.");
  }
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isIsoTimestamp(value: string): boolean { return value.length > 0 && !Number.isNaN(Date.parse(value)); }
