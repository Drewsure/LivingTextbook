import { validatePilotDeliveryManifest, type PilotDeliveryManifest } from "./pilotDeliveryManifest";
import { validatePilotDeliveryReleaseReceipt, type PilotDeliveryReleaseReceipt } from "./pilotDeliveryReleaseReceipt";
import { validatePilotQrAliasRegistryPreview, type PilotQrAliasRegistryPreview } from "./pilotQrAliasRegistry";

export type PilotQrPrintAuthorizationPreflightStatus = "blocked" | "ready-for-authorization";

export interface PilotQrPrintAuthorizationPreflight {
  preflightId: string;
  tenantId: string;
  packageId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  registryPreviewId: string;
  sourceAssemblyChecksum: string;
  aliasCount: number;
  printArtifactId: string;
  printArtifactFormat: "qr-review-sheet";
  status: PilotQrPrintAuthorizationPreflightStatus;
  authorizationStatus: "pending";
  unresolvedRequirements: string[];
  blockedActions: string[];
  printArtifactAllowed: false;
  routeMutationAllowed: false;
  studentFacingActivationAllowed: false;
  sideEffect: "none";
}

const blockedActions = [
  "No production QR print from this preflight",
  "No durable QR alias registry write",
  "No QR redirect or route mutation",
  "No package or release swap",
  "No student-facing activation",
] as const;

export function createPilotQrPrintAuthorizationPreflight(input: {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  registry: PilotQrAliasRegistryPreview;
}): PilotQrPrintAuthorizationPreflight {
  const { manifest, receipt, registry } = input;
  const identityPairs: Array<[string, string, string]> = [
    [receipt.manifestId, manifest.manifestId, "Release receipt manifest identity does not match the delivery manifest."],
    [receipt.tenantId, manifest.tenantId, "Release receipt tenant identity does not match the delivery manifest."],
    [receipt.packageId, manifest.packageId, "Release receipt package identity does not match the delivery manifest."],
    [receipt.version, manifest.version, "Release receipt version does not match the delivery manifest."],
    [registry.manifestId, manifest.manifestId, "QR registry manifest identity does not match the delivery manifest."],
    [registry.tenantId, manifest.tenantId, "QR registry tenant identity does not match the delivery manifest."],
    [registry.packageId, manifest.packageId, "QR registry package identity does not match the delivery manifest."],
    [registry.version, manifest.version, "QR registry version does not match the delivery manifest."],
    [receipt.sourceAssemblyChecksum, manifest.sourceAssemblyChecksum, "Release receipt checksum does not match the delivery manifest."],
    [registry.sourceAssemblyChecksum, manifest.sourceAssemblyChecksum, "QR registry checksum does not match the delivery manifest."],
  ];
  const manifestAliasPaths = new Set(manifest.qrAliasPaths);
  const registryAliasPaths = new Set(registry.entries.map((entry) => entry.aliasPath));
  const unresolvedRequirements = [
    ...identityPairs.filter(([left, right]) => left !== right).map(([, , message]) => message),
    ...validatePilotDeliveryManifest(manifest).map((error) => `Manifest: ${error}`),
    ...validatePilotDeliveryReleaseReceipt(receipt).map((error) => `Release receipt: ${error}`),
    ...validatePilotQrAliasRegistryPreview(registry).map((error) => `QR registry: ${error}`),
    ...(manifest.status !== "ready-for-manual-release" ? ["Delivery manifest is not ready for manual release."] : []),
    ...(!manifest.deliveryAllowed ? ["Delivery manifest does not allow handoff."] : []),
    ...(receipt.status !== "manual-release-approved" ? ["Named human release approval is not recorded."] : []),
    ...(!receipt.qrPrintAllowed ? ["The release receipt does not authorize QR printing."] : []),
    ...(registry.status !== "review-only" ? ["QR alias registry must remain a review-only preview before durable persistence is selected."] : []),
    ...(manifestAliasPaths.size !== registryAliasPaths.size || [...manifestAliasPaths].some((path) => !registryAliasPaths.has(path))
      ? ["QR registry entries do not match the manifest alias set."]
      : []),
    ...(registry.entries.some((entry) => !entry.rollbackEvidenceId) ? ["Every printed alias requires rollback evidence."] : []),
    "A separate human QR print authorization must be recorded before production printing.",
    "Durable QR alias registry persistence must be selected before production printing.",
  ];
  const readyForAuthorization = !identityPairs.some(([left, right]) => left !== right)
    && validatePilotDeliveryManifest(manifest).length === 0
    && validatePilotDeliveryReleaseReceipt(receipt).length === 0
    && validatePilotQrAliasRegistryPreview(registry).length === 0
    && manifest.status === "ready-for-manual-release"
    && manifest.deliveryAllowed
    && receipt.status === "manual-release-approved"
    && receipt.qrPrintAllowed
    && registry.status === "review-only"
    && manifestAliasPaths.size === registryAliasPaths.size
    && [...manifestAliasPaths].every((path) => registryAliasPaths.has(path))
    && registry.entries.every((entry) => Boolean(entry.rollbackEvidenceId));

  return {
    preflightId: `${manifest.packageId}:${manifest.version}:qr-print-authorization-preflight`,
    tenantId: manifest.tenantId,
    packageId: manifest.packageId,
    version: manifest.version,
    manifestId: manifest.manifestId,
    receiptId: receipt.receiptId,
    registryPreviewId: registry.previewId,
    sourceAssemblyChecksum: manifest.sourceAssemblyChecksum,
    aliasCount: registry.entries.length,
    printArtifactId: `${manifest.packageId}:${manifest.version}:qr-review-sheet`,
    printArtifactFormat: "qr-review-sheet",
    status: readyForAuthorization ? "ready-for-authorization" : "blocked",
    authorizationStatus: "pending",
    unresolvedRequirements: [...new Set(unresolvedRequirements)],
    blockedActions: [...blockedActions],
    printArtifactAllowed: false,
    routeMutationAllowed: false,
    studentFacingActivationAllowed: false,
    sideEffect: "none",
  };
}

export function validatePilotQrPrintAuthorizationPreflight(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Pilot QR print authorization preflight must be an object."];
  for (const field of ["preflightId", "tenantId", "packageId", "version", "manifestId", "receiptId", "registryPreviewId", "sourceAssemblyChecksum", "printArtifactId"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Pilot QR print authorization preflight ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot QR print authorization preflight sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (!Number.isInteger(value.aliasCount) || Number(value.aliasCount) < 1) errors.push("Pilot QR print authorization preflight aliasCount must be a positive integer.");
  if (value.printArtifactFormat !== "qr-review-sheet") errors.push("Pilot QR print authorization preflight printArtifactFormat is unsupported.");
  if (!["blocked", "ready-for-authorization"].includes(String(value.status))) errors.push("Pilot QR print authorization preflight status is unsupported.");
  if (value.authorizationStatus !== "pending") errors.push("Pilot QR print authorization preflight authorizationStatus must remain pending.");
  if (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.some((item) => !isNonEmptyString(item))) errors.push("Pilot QR print authorization preflight unresolvedRequirements must contain strings.");
  if (!Array.isArray(value.blockedActions) || value.blockedActions.length === 0 || value.blockedActions.some((item) => !isNonEmptyString(item))) errors.push("Pilot QR print authorization preflight blockedActions must contain non-empty strings.");
  if (value.printArtifactAllowed !== false || value.routeMutationAllowed !== false || value.studentFacingActivationAllowed !== false) errors.push("Pilot QR print authorization preflight must keep operational actions blocked.");
  if (value.sideEffect !== "none") errors.push("Pilot QR print authorization preflight must be side-effect-free.");
  if ((value.status === "blocked" || value.status === "ready-for-authorization") && (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.length === 0)) errors.push("Pilot QR print authorization preflight must explain its remaining human or storage gates.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSha256(value: unknown): boolean {
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value);
}
