import type { PilotDeliveryManifest } from "./pilotDeliveryManifest";
import type { PilotDeliveryReleaseReceipt } from "./pilotDeliveryReleaseReceipt";

export type PilotQrAliasRegistryEntryStatus = "draft-only" | "blocked";

export interface PilotQrAliasRegistryEntry {
  aliasId: string;
  printedQrId: string;
  tenantId: string;
  packageId: string;
  version: string;
  aliasPath: string;
  fallbackPath: string;
  targetLabel: string;
  deploymentTargets: string[];
  status: PilotQrAliasRegistryEntryStatus;
  rollbackEvidenceId: string | null;
}

export interface PilotQrAliasRegistryPreview {
  registryVersion: 1;
  previewId: string;
  tenantId: string;
  packageId: string;
  version: string;
  sourceAssemblyChecksum: string;
  manifestId: string;
  receiptId: string;
  status: "review-only";
  entries: PilotQrAliasRegistryEntry[];
  unresolvedRequirements: string[];
  blockedActions: string[];
  productionPrintAllowed: false;
  routeMutationAllowed: false;
  studentFacingActivationAllowed: false;
  sideEffect: "none";
}

const blockedActions = [
  "No durable QR alias registry write",
  "No production QR print authorization",
  "No QR redirect or route mutation",
  "No package or release swap",
  "No student-facing activation",
] as const;

export function createPilotQrAliasRegistryPreview(input: {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  entries: PilotQrAliasRegistryEntry[];
}): PilotQrAliasRegistryPreview {
  const manifestAliasPaths = new Set(input.manifest.qrAliasPaths);
  const entryAliasPaths = new Set(input.entries.map((entry) => entry.aliasPath));
  const identityDrift = input.receipt.manifestId !== input.manifest.manifestId
    || input.receipt.tenantId !== input.manifest.tenantId
    || input.receipt.packageId !== input.manifest.packageId
    || input.receipt.version !== input.manifest.version;
  const unresolvedRequirements = [
    "Durable QR alias registry persistence is not selected.",
    "Human release approval and QR print authorization remain separate gates.",
    "Local fallback and rollback evidence must be confirmed for every printed alias.",
    ...(manifestAliasPaths.size !== entryAliasPaths.size || [...manifestAliasPaths].some((path) => !entryAliasPaths.has(path))
      ? ["Registry entries do not match the delivery manifest QR alias set."]
      : []),
    ...(identityDrift ? ["Release receipt identity does not match the delivery manifest."] : []),
    ...(input.entries.some((entry) => !entry.rollbackEvidenceId) ? ["One or more aliases are missing rollback evidence."] : []),
    ...(!input.receipt.qrPrintAllowed ? ["The release receipt does not authorize QR printing."] : []),
    ...(input.manifest.status === "blocked" ? ["The delivery manifest remains blocked."] : []),
    ...(input.receipt.status === "blocked" ? ["The delivery release receipt remains blocked."] : []),
  ];

  return {
    registryVersion: 1,
    previewId: `${input.manifest.packageId}:${input.manifest.version}:qr-registry-preview`,
    tenantId: input.manifest.tenantId,
    packageId: input.manifest.packageId,
    version: input.manifest.version,
    sourceAssemblyChecksum: input.manifest.sourceAssemblyChecksum,
    manifestId: input.manifest.manifestId,
    receiptId: input.receipt.receiptId,
    status: "review-only",
    entries: input.entries.map((entry) => ({ ...entry, deploymentTargets: [...entry.deploymentTargets] })),
    unresolvedRequirements: [...new Set(unresolvedRequirements)],
    blockedActions: [...blockedActions],
    productionPrintAllowed: false,
    routeMutationAllowed: false,
    studentFacingActivationAllowed: false,
    sideEffect: "none",
  };
}

export function validatePilotQrAliasRegistryPreview(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Pilot QR alias registry preview must be an object."];
  if (value.registryVersion !== 1) errors.push("Pilot QR alias registry preview registryVersion must be 1.");
  if (value.status !== "review-only") errors.push("Pilot QR alias registry preview must remain review-only.");
  for (const field of ["previewId", "tenantId", "packageId", "version", "sourceAssemblyChecksum", "manifestId", "receiptId"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Pilot QR alias registry preview ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot QR alias registry preview sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (!Array.isArray(value.entries) || value.entries.length === 0) {
    errors.push("Pilot QR alias registry preview must contain at least one alias entry.");
  } else {
    const aliasIds = new Set<string>();
    const printedQrIds = new Set<string>();
    const aliasPaths = new Set<string>();
    for (const entry of value.entries) {
      if (!isRecord(entry)) {
        errors.push("Pilot QR alias registry entries must be objects.");
        continue;
      }
      for (const field of ["aliasId", "printedQrId", "tenantId", "packageId", "version", "aliasPath", "fallbackPath", "targetLabel"] as const) {
        if (!isNonEmptyString(entry[field])) errors.push(`Pilot QR alias registry entry ${field} must be non-empty.`);
      }
      if (entry.tenantId !== value.tenantId) errors.push("Pilot QR alias registry entries must remain tenant-scoped.");
      if (entry.packageId !== value.packageId) errors.push("Pilot QR alias registry entries must bind the package.");
      if (entry.version !== value.version) errors.push("Pilot QR alias registry entries must bind the package version.");
      if (entry.status !== "draft-only" && entry.status !== "blocked") errors.push("Pilot QR alias registry entry status is unsupported.");
      if (!Array.isArray(entry.deploymentTargets) || entry.deploymentTargets.length === 0 || entry.deploymentTargets.some((target) => !["hosted-route", "local-bundle", "hybrid"].includes(String(target)))) {
        errors.push("Pilot QR alias registry entry deployment targets are invalid.");
      }
      if (entry.rollbackEvidenceId !== null && !isNonEmptyString(entry.rollbackEvidenceId)) errors.push("Pilot QR alias registry rollback evidence id must be null or non-empty.");
      if (!isSafeInternalPath(entry.aliasPath)) errors.push("Pilot QR alias registry aliasPath must be a safe internal route.");
      if (!isSafeInternalPath(entry.fallbackPath)) errors.push("Pilot QR alias registry fallbackPath must be a safe internal route.");
      if (isNonEmptyString(entry.aliasId) && !aliasIds.add(entry.aliasId)) errors.push("Pilot QR alias registry alias ids must be unique.");
      if (isNonEmptyString(entry.printedQrId) && !printedQrIds.add(entry.printedQrId)) errors.push("Pilot QR alias registry printed QR ids must be unique.");
      if (isNonEmptyString(entry.aliasPath) && !aliasPaths.add(entry.aliasPath)) errors.push("Pilot QR alias registry alias paths must be unique.");
    }
  }
  for (const field of ["unresolvedRequirements", "blockedActions"] as const) {
    if (!Array.isArray(value[field]) || value[field].length === 0 || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Pilot QR alias registry ${field} must contain non-empty strings.`);
  }
  if (value.productionPrintAllowed !== false) errors.push("Pilot QR alias registry production printing must remain blocked.");
  if (value.routeMutationAllowed !== false) errors.push("Pilot QR alias registry route mutation must remain blocked.");
  if (value.studentFacingActivationAllowed !== false) errors.push("Pilot QR alias registry student activation must remain blocked.");
  if (value.sideEffect !== "none") errors.push("Pilot QR alias registry preview must be side-effect-free.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeInternalPath(value: unknown): boolean {
  return typeof value === "string"
    && value.startsWith("/")
    && !value.startsWith("//")
    && !value.includes("..")
    && !value.includes("\\")
    && !/^\/(?:\/|.*(?:localhost|127\.0\.0\.1))/i.test(value)
    && !/^file:/i.test(value);
}

function isSha256(value: unknown): boolean {
  return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value);
}
