import type { PilotDeliveryManifest } from "./pilotDeliveryManifest";
import type { PilotDeliveryReleaseReceipt } from "./pilotDeliveryReleaseReceipt";
import type { PilotQrAliasRegistryPreview } from "./pilotQrAliasRegistry";

export type PilotDeliveryReleasePreflightStatus = "blocked" | "ready-for-human-review";

export interface PilotDeliveryReleasePreflight {
  preflightId: string;
  tenantId: string;
  packageId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  qrRegistryPreviewId: string;
  sourceAssemblyChecksum: string;
  status: PilotDeliveryReleasePreflightStatus;
  unresolvedRequirements: string[];
  blockedActions: string[];
  releaseWriteAllowed: false;
  productionPrintAllowed: false;
  studentFacingActivationAllowed: false;
  sideEffect: "none";
}

const blockedActions = [
  "No release receipt write from this preflight",
  "No QR registry persistence or production printing",
  "No package assembly or student-facing activation",
  "No hosted persistence activation",
] as const;

export function createPilotDeliveryReleasePreflight(input: {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  qrRegistry: PilotQrAliasRegistryPreview;
}): PilotDeliveryReleasePreflight {
  const { manifest, receipt, qrRegistry } = input;
  const identityPairs: Array<[string, string, string]> = [
    [receipt.manifestId, manifest.manifestId, "Release receipt manifest identity does not match the delivery manifest."],
    [receipt.tenantId, manifest.tenantId, "Release receipt tenant identity does not match the delivery manifest."],
    [receipt.packageId, manifest.packageId, "Release receipt package identity does not match the delivery manifest."],
    [receipt.version, manifest.version, "Release receipt version does not match the delivery manifest."],
    [qrRegistry.manifestId, manifest.manifestId, "QR registry manifest identity does not match the delivery manifest."],
    [qrRegistry.tenantId, manifest.tenantId, "QR registry tenant identity does not match the delivery manifest."],
    [qrRegistry.packageId, manifest.packageId, "QR registry package identity does not match the delivery manifest."],
    [qrRegistry.version, manifest.version, "QR registry version does not match the delivery manifest."],
    [receipt.sourceAssemblyChecksum, manifest.sourceAssemblyChecksum, "Release receipt checksum does not match the delivery manifest."],
    [qrRegistry.sourceAssemblyChecksum, manifest.sourceAssemblyChecksum, "QR registry checksum does not match the delivery manifest."],
  ];
  const unresolvedRequirements = [
    ...identityPairs.filter(([left, right]) => left !== right).map(([, , message]) => message),
    ...(manifest.status !== "ready-for-manual-release" ? ["Delivery manifest is not ready for manual release."] : []),
    ...(receipt.status !== "manual-release-approved" ? ["Named human release approval is not recorded."] : []),
    ...(qrRegistry.status !== "review-only" ? ["QR alias registry must remain a review-only preview before durable persistence is selected."] : []),
    ...(qrRegistry.productionPrintAllowed === false ? ["Durable QR alias registry persistence and print authorization remain outstanding."] : []),
    "Release-control writes remain disabled by default and require a separate authenticated operator boundary.",
  ];
  const readyForHumanReview = identityPairs.every(([left, right]) => left === right)
    && manifest.status === "ready-for-manual-release"
    && receipt.status === "manual-release-approved"
    && qrRegistry.status === "review-only";

  return {
    preflightId: `${manifest.packageId}:${manifest.version}:release-preflight`,
    tenantId: manifest.tenantId,
    packageId: manifest.packageId,
    version: manifest.version,
    manifestId: manifest.manifestId,
    receiptId: receipt.receiptId,
    qrRegistryPreviewId: qrRegistry.previewId,
    sourceAssemblyChecksum: manifest.sourceAssemblyChecksum,
    status: readyForHumanReview ? "ready-for-human-review" : "blocked",
    unresolvedRequirements: [...new Set(unresolvedRequirements)],
    blockedActions: [...blockedActions],
    releaseWriteAllowed: false,
    productionPrintAllowed: false,
    studentFacingActivationAllowed: false,
    sideEffect: "none",
  };
}

export function validatePilotDeliveryReleasePreflight(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Pilot delivery release preflight must be an object."];
  for (const field of ["preflightId", "tenantId", "packageId", "version", "manifestId", "receiptId", "qrRegistryPreviewId", "sourceAssemblyChecksum"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Pilot delivery release preflight ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot delivery release preflight sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (!["blocked", "ready-for-human-review"].includes(String(value.status))) errors.push("Pilot delivery release preflight status is unsupported.");
  if (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.some((item) => !isNonEmptyString(item))) errors.push("Pilot delivery release preflight unresolvedRequirements must contain strings.");
  if (!Array.isArray(value.blockedActions) || value.blockedActions.length === 0 || value.blockedActions.some((item) => !isNonEmptyString(item))) errors.push("Pilot delivery release preflight blockedActions must contain non-empty strings.");
  if (value.releaseWriteAllowed !== false || value.productionPrintAllowed !== false || value.studentFacingActivationAllowed !== false) errors.push("Pilot delivery release preflight must keep operational actions blocked.");
  if (value.sideEffect !== "none") errors.push("Pilot delivery release preflight must be side-effect-free.");
  if (value.status === "blocked" && (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.length === 0)) errors.push("Blocked pilot delivery release preflight must list unresolved requirements.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSha256(value: unknown): boolean {
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value);
}
