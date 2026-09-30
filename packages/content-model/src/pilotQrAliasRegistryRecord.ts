import { validatePilotDeliveryManifest, type PilotDeliveryManifest } from "./pilotDeliveryManifest";
import { validatePilotDeliveryReleaseReceipt, type PilotDeliveryReleaseReceipt } from "./pilotDeliveryReleaseReceipt";
import type { PilotQrAliasRegistryEntry } from "./pilotQrAliasRegistry";

export type PilotQrAliasRegistryRecordEntry = Omit<PilotQrAliasRegistryEntry, "status"> & {
  status: "registered";
};

export interface PilotQrAliasRegistryRecord {
  registryVersion: 1;
  recordId: string;
  tenantId: string;
  packageId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  sourceAssemblyChecksum: string;
  status: "registered";
  entries: PilotQrAliasRegistryRecordEntry[];
  registeredBy: string;
  registeredAt: string;
  productionPrintAllowed: true;
  routeMutationAllowed: false;
  studentFacingActivationAllowed: false;
  sideEffect: "durable-registry-write";
}

export function createPilotQrAliasRegistryRecord(input: {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  entries: PilotQrAliasRegistryEntry[];
  registeredBy: string;
  registeredAt: string;
}): PilotQrAliasRegistryRecord {
  const errors = validateRecordInput(input);
  if (errors.length > 0) throw new Error(errors.join(" "));

  return {
    registryVersion: 1,
    recordId: `${input.manifest.packageId}:${input.manifest.version}:qr-alias-registry`,
    tenantId: input.manifest.tenantId,
    packageId: input.manifest.packageId,
    version: input.manifest.version,
    manifestId: input.manifest.manifestId,
    receiptId: input.receipt.receiptId,
    sourceAssemblyChecksum: input.manifest.sourceAssemblyChecksum,
    status: "registered",
    entries: input.entries.map((entry) => ({ ...entry, status: "registered", deploymentTargets: [...entry.deploymentTargets] })),
    registeredBy: input.registeredBy,
    registeredAt: input.registeredAt,
    productionPrintAllowed: true,
    routeMutationAllowed: false,
    studentFacingActivationAllowed: false,
    sideEffect: "durable-registry-write",
  };
}

export function validatePilotQrAliasRegistryRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Pilot QR alias registry record must be an object."];
  if (value.registryVersion !== 1) errors.push("Pilot QR alias registry record registryVersion must be 1.");
  if (value.status !== "registered") errors.push("Pilot QR alias registry record must be registered.");
  for (const field of ["recordId", "tenantId", "packageId", "version", "manifestId", "receiptId", "registeredBy", "registeredAt"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Pilot QR alias registry record ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot QR alias registry record sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (!isIsoTimestamp(String(value.registeredAt ?? ""))) errors.push("Pilot QR alias registry record registeredAt must be a valid ISO timestamp.");
  if (value.productionPrintAllowed !== true) errors.push("Pilot QR alias registry record must explicitly allow the approved print artifact.");
  if (value.routeMutationAllowed !== false) errors.push("Pilot QR alias registry record must block route mutation.");
  if (value.studentFacingActivationAllowed !== false) errors.push("Pilot QR alias registry record must block student-facing activation.");
  if (value.sideEffect !== "durable-registry-write") errors.push("Pilot QR alias registry record must declare a durable-registry-write side effect.");
  if (!isNonEmptyString(value.recordId) || value.recordId !== `${String(value.packageId)}:${String(value.version)}:qr-alias-registry`) {
    errors.push("Pilot QR alias registry record recordId must bind package and version.");
  }
  if (!Array.isArray(value.entries) || value.entries.length === 0) {
    errors.push("Pilot QR alias registry record must contain at least one entry.");
  } else {
    const aliasIds = new Set<string>();
    const printedQrIds = new Set<string>();
    const aliasPaths = new Set<string>();
    const fallbackPaths = new Set<string>();
    for (const entry of value.entries) {
      if (!isRecord(entry)) {
        errors.push("Pilot QR alias registry record entries must be objects.");
        continue;
      }
      for (const field of ["aliasId", "printedQrId", "tenantId", "packageId", "version", "aliasPath", "fallbackPath", "targetLabel"] as const) {
        if (!isNonEmptyString(entry[field])) errors.push(`Pilot QR alias registry record entry ${field} must be non-empty.`);
      }
      if (entry.status !== "registered") errors.push("Pilot QR alias registry record entries must be registered.");
      if (entry.tenantId !== value.tenantId) errors.push("Pilot QR alias registry record entries must remain tenant-scoped.");
      if (entry.packageId !== value.packageId || entry.version !== value.version) errors.push("Pilot QR alias registry record entries must bind package and version.");
      if (!Array.isArray(entry.deploymentTargets) || entry.deploymentTargets.length === 0 || entry.deploymentTargets.some((target) => !["hosted-route", "local-bundle", "hybrid"].includes(String(target)))) {
        errors.push("Pilot QR alias registry record entry deployment targets are invalid.");
      }
      if (!isNonEmptyString(entry.rollbackEvidenceId)) errors.push("Pilot QR alias registry record entries require rollback evidence.");
      if (!isSafeInternalPath(entry.aliasPath)) errors.push("Pilot QR alias registry record aliasPath must be a safe internal route.");
      if (!isSafeInternalPath(entry.fallbackPath)) errors.push("Pilot QR alias registry record fallbackPath must be a safe internal route.");
      if (isNonEmptyString(entry.aliasPath) && !entry.aliasPath.startsWith(`/q/${String(value.tenantId)}/`)) errors.push("Pilot QR alias registry record aliasPath must remain tenant-scoped.");
      if (isNonEmptyString(entry.fallbackPath) && !entry.fallbackPath.startsWith(`/local/package/${String(value.tenantId)}/${String(value.packageId)}/${String(value.version)}/`)) errors.push("Pilot QR alias registry record fallbackPath must remain package-scoped.");
      if (isNonEmptyString(entry.aliasId) && !aliasIds.add(entry.aliasId)) errors.push("Pilot QR alias registry record alias ids must be unique.");
      if (isNonEmptyString(entry.printedQrId) && !printedQrIds.add(entry.printedQrId)) errors.push("Pilot QR alias registry record printed QR ids must be unique.");
      if (isNonEmptyString(entry.aliasPath) && !aliasPaths.add(entry.aliasPath)) errors.push("Pilot QR alias registry record alias paths must be unique.");
      if (isNonEmptyString(entry.fallbackPath) && !fallbackPaths.add(entry.fallbackPath)) errors.push("Pilot QR alias registry record fallback paths must be unique.");
    }
  }
  return [...new Set(errors)];
}

function validateRecordInput(input: {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
  entries: PilotQrAliasRegistryEntry[];
  registeredBy: string;
  registeredAt: string;
}): string[] {
  const errors = [...validatePilotDeliveryManifest(input.manifest), ...validatePilotDeliveryReleaseReceipt(input.receipt)];
  if (input.manifest.status !== "ready-for-manual-release" || !input.manifest.deliveryAllowed || !input.manifest.qrPrintAllowed) errors.push("QR alias registry requires a delivery manifest approved for QR printing.");
  if (input.receipt.status !== "manual-release-approved" || !input.receipt.deliveryAllowed || !input.receipt.qrPrintAllowed) errors.push("QR alias registry requires an approved release receipt with QR print authorization.");
  if (input.receipt.manifestId !== input.manifest.manifestId || input.receipt.tenantId !== input.manifest.tenantId || input.receipt.packageId !== input.manifest.packageId || input.receipt.version !== input.manifest.version || input.receipt.sourceAssemblyChecksum !== input.manifest.sourceAssemblyChecksum) errors.push("QR alias registry manifest and receipt identity or checksum does not match.");
  if (!isSafeSegment(input.manifest.tenantId) || !isSafeSegment(input.manifest.packageId) || !isSafeSegment(input.manifest.version)) errors.push("QR alias registry tenant, package, and version must be safe path segments.");
  if (!isSafeSegment(input.registeredBy)) errors.push("QR alias registry requires a bounded operator identity.");
  if (!isIsoTimestamp(input.registeredAt)) errors.push("QR alias registry requires a valid registration timestamp.");
  if (!Array.isArray(input.entries) || input.entries.length === 0) errors.push("QR alias registry requires at least one entry.");
  const manifestAliases = new Set(input.manifest.qrAliasPaths);
  const manifestFallbacks = new Set(input.manifest.localFallbackPaths);
  const entryAliases = new Set(input.entries.map((entry) => entry.aliasPath));
  const entryFallbacks = new Set(input.entries.map((entry) => entry.fallbackPath));
  if (!sameSet(manifestAliases, entryAliases)) errors.push("QR alias registry entries must exactly match the delivery manifest alias set.");
  if (!sameSet(manifestFallbacks, entryFallbacks)) errors.push("QR alias registry entries must exactly match the delivery manifest fallback set.");
  for (const entry of input.entries) {
    if (entry.tenantId !== input.manifest.tenantId || entry.packageId !== input.manifest.packageId || entry.version !== input.manifest.version) errors.push("QR alias registry entry identity does not match the delivery manifest.");
    if (!entry.rollbackEvidenceId) errors.push("QR alias registry entries require rollback evidence.");
  }
  return [...new Set(errors)];
}

function sameSet(left: Set<string>, right: Set<string>): boolean {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function isRecord(value: unknown): value is Record<string, any> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSafeSegment(value: unknown): value is string { return typeof value === "string" && value.length > 0 && value.length <= 160 && /^[A-Za-z0-9._-]+$/.test(value); }
function isSafeInternalPath(value: unknown): boolean { return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("..") && !value.includes("\\") && !/^\/.*(?:localhost|127\.0\.0\.1)/i.test(value) && !/^file:/i.test(value); }
function isSha256(value: unknown): boolean { return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value); }
function isIsoTimestamp(value: string): boolean { return typeof value === "string" && !Number.isNaN(Date.parse(value)); }
