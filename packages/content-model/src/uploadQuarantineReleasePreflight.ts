import type { UploadQuarantineDeliveryManifestPreview } from "./uploadQuarantineDeliveryManifestPreview";
import type { UploadQuarantinePackageIndexPreview } from "./uploadQuarantinePackageIndexPreview";
import type { UploadQuarantineReleaseReceiptPreview } from "./uploadQuarantineReleaseReceiptPreview";

export interface UploadQuarantineReleasePreflight {
  recordVersion: 1;
  preflightId: string;
  tenantId: string;
  quarantineId: string;
  packageId: string;
  manifestId: string;
  releaseReceiptId: string;
  packageIndexId: string;
  sourceChecksumSha256: string;
  selectedMode: UploadQuarantineDeliveryManifestPreview["selectedMode"];
  status: "blocked";
  unresolvedRequirements: string[];
  blockedActions: string[];
  releaseWriteAllowed: false;
  packageAssemblyAllowed: false;
  qrPrintAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const blockedActions = [
  "No release receipt write from a live preflight",
  "No package assembly or local bundle handoff",
  "No QR alias persistence or production printing",
  "No hosted persistence activation or student-facing use",
] as const;

export function createUploadQuarantineReleasePreflight(input: {
  deliveryManifestPreview: UploadQuarantineDeliveryManifestPreview;
  releaseReceiptPreview: UploadQuarantineReleaseReceiptPreview;
  packageIndexPreview: UploadQuarantinePackageIndexPreview;
}): UploadQuarantineReleasePreflight {
  const { deliveryManifestPreview: manifest, releaseReceiptPreview: receipt, packageIndexPreview: index } = input;
  const identityPairs: Array<[unknown, unknown, string]> = [
    [receipt.tenantId, manifest.tenantId, "Release receipt preview tenant does not match the delivery manifest preview."],
    [index.tenantId, manifest.tenantId, "Package index preview tenant does not match the delivery manifest preview."],
    [receipt.quarantineId, manifest.quarantineId, "Release receipt preview quarantine does not match the delivery manifest preview."],
    [index.quarantineId, manifest.quarantineId, "Package index preview quarantine does not match the delivery manifest preview."],
    [receipt.packageId, manifest.packageId, "Release receipt preview package does not match the delivery manifest preview."],
    [index.packageId, manifest.packageId, "Package index preview package does not match the delivery manifest preview."],
    [receipt.manifestId, manifest.manifestId, "Release receipt preview manifest does not match the delivery manifest preview."],
    [index.manifestId, manifest.manifestId, "Package index preview manifest does not match the delivery manifest preview."],
    [receipt.releaseReceiptId, manifest.releaseReceiptId, "Release receipt preview identity does not match the delivery manifest preview."],
    [index.releaseReceiptId, manifest.releaseReceiptId, "Package index preview receipt identity does not match the delivery manifest preview."],
    [index.packageIndexId, manifest.packageIndexId, "Package index preview identity does not match the delivery manifest preview."],
    [receipt.sourceChecksumSha256, manifest.sourceChecksumSha256, "Release receipt preview checksum does not match the delivery manifest preview."],
    [index.sourceChecksumSha256, manifest.sourceChecksumSha256, "Package index preview checksum does not match the delivery manifest preview."],
    [receipt.selectedMode, manifest.selectedMode, "Release receipt preview delivery mode does not match the delivery manifest preview."],
    [index.selectedMode, manifest.selectedMode, "Package index preview delivery mode does not match the delivery manifest preview."],
  ];
  const unresolvedRequirements = [
    ...identityPairs.filter(([left, right]) => left !== right).map(([, , message]) => message),
    ...(manifest.status !== "blocked" ? ["The live delivery manifest preview must remain blocked until a separate approved manifest exists."] : []),
    ...(receipt.status !== "blocked" || receipt.releaseApproval !== "pending" ? ["The live release receipt preview must remain pending and blocked."] : []),
    ...(index.status !== "blocked" ? ["The live package index preview must remain blocked until an approved manifest and receipt exist."] : []),
    "A durable QR registry, named release approval, rollback evidence, and explicit print authorization are still required.",
  ];

  return {
    recordVersion: 1,
    preflightId: `${manifest.packageId}:${manifest.quarantineId}:release-preflight`,
    tenantId: manifest.tenantId,
    quarantineId: manifest.quarantineId,
    packageId: manifest.packageId,
    manifestId: manifest.manifestId,
    releaseReceiptId: manifest.releaseReceiptId,
    packageIndexId: manifest.packageIndexId,
    sourceChecksumSha256: manifest.sourceChecksumSha256,
    selectedMode: manifest.selectedMode,
    status: "blocked",
    unresolvedRequirements: [...new Set(unresolvedRequirements)],
    blockedActions: [...blockedActions],
    releaseWriteAllowed: false,
    packageAssemblyAllowed: false,
    qrPrintAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validateUploadQuarantineReleasePreflight(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Upload quarantine release preflight must be an object."];
  if (value.recordVersion !== 1) errors.push("Upload quarantine release preflight recordVersion must be 1.");
  for (const field of ["preflightId", "tenantId", "quarantineId", "packageId", "manifestId", "releaseReceiptId", "packageIndexId"] as const) {
    if (!isSafeIdentifier(value[field])) errors.push(`Upload quarantine release preflight ${field} must be a bounded safe identifier.`);
  }
  if (!/^([a-f0-9]{64})$/.test(String(value.sourceChecksumSha256 ?? ""))) errors.push("Upload quarantine release preflight checksum must be lowercase SHA-256.");
  if (!['unselected', 'closed-local', 'hosted-pwa', 'hybrid'].includes(String(value.selectedMode))) errors.push("Upload quarantine release preflight selectedMode is unsupported.");
  if (value.status !== "blocked" || value.mode !== "review-only" || value.sideEffect !== "none") errors.push("Upload quarantine release preflight must remain blocked, review-only, and side-effect-free.");
  for (const field of ["releaseWriteAllowed", "packageAssemblyAllowed", "qrPrintAllowed", "studentFacingUseAllowed"] as const) if (value[field] !== false) errors.push(`Upload quarantine release preflight ${field} must remain false.`);
  if (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.length === 0 || value.unresolvedRequirements.some((item) => !isNonEmptyString(item))) errors.push("Upload quarantine release preflight unresolvedRequirements must contain non-empty strings.");
  for (const action of blockedActions) if (!Array.isArray(value.blockedActions) || !value.blockedActions.includes(action)) errors.push(`Upload quarantine release preflight must block action: ${action}.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeIdentifier(value: unknown): value is string { return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:@/-]*$/.test(value); }
