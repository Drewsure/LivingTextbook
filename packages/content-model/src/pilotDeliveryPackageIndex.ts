import type { PilotDeliveryManifest } from "./pilotDeliveryManifest";
import type { PilotDeliveryReleaseReceipt } from "./pilotDeliveryReleaseReceipt";

export interface PilotDeliveryPackageIndex {
  indexVersion: 1;
  tenantId: string;
  packageId: string;
  version: string;
  manifestId: string;
  receiptId: string;
  sourceAssemblyChecksum: string;
  mode: PilotDeliveryManifest["mode"];
  contentPackagePath: string;
  gameRoutePaths: string[];
  mediaKinds: string[];
  qrAliasPaths: string[];
  localFallbackPaths: string[];
  hostedPersistence: PilotDeliveryManifest["hostedPersistence"];
  hostedPersistenceDecisionPacketId: PilotDeliveryManifest["hostedPersistenceDecisionPacketId"];
  releaseStatus: "review-only" | "manual-release-approved";
  rawPayloadIncluded: false;
  learnerRecordsIncluded: false;
  sideEffect: "metadata-only";
}

export function createPilotDeliveryPackageIndex({
  manifest,
  receipt,
}: {
  manifest: PilotDeliveryManifest;
  receipt: PilotDeliveryReleaseReceipt;
}): PilotDeliveryPackageIndex {
  return {
    indexVersion: 1,
    tenantId: manifest.tenantId,
    packageId: manifest.packageId,
    version: manifest.version,
    manifestId: manifest.manifestId,
    receiptId: receipt.receiptId,
    sourceAssemblyChecksum: manifest.sourceAssemblyChecksum,
    mode: manifest.mode,
    contentPackagePath: manifest.contentPackagePath,
    gameRoutePaths: manifest.gameRoutePaths.slice(),
    mediaKinds: manifest.mediaKinds.slice(),
    qrAliasPaths: manifest.qrAliasPaths.slice(),
    localFallbackPaths: manifest.localFallbackPaths.slice(),
    hostedPersistence: manifest.hostedPersistence,
    hostedPersistenceDecisionPacketId: manifest.hostedPersistenceDecisionPacketId,
    releaseStatus: manifest.status === "ready-for-manual-release" && receipt.status === "manual-release-approved"
      ? "manual-release-approved"
      : "review-only",
    rawPayloadIncluded: false,
    learnerRecordsIncluded: false,
    sideEffect: "metadata-only",
  };
}

export function validatePilotDeliveryPackageIndex(value: unknown): string[] {
  if (!isRecord(value)) return ["Pilot delivery package index must be an object."];
  const errors: string[] = [];
  if (value.indexVersion !== 1 || value.rawPayloadIncluded !== false || value.learnerRecordsIncluded !== false || value.sideEffect !== "metadata-only" || !["review-only", "manual-release-approved"].includes(String(value.releaseStatus))) {
    errors.push("Pilot delivery package index has an unsafe release or side-effect marker.");
  }
  for (const field of ["tenantId", "packageId", "version", "manifestId", "receiptId", "sourceAssemblyChecksum", "contentPackagePath"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Pilot delivery package index ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot delivery package index checksum is invalid.");
  for (const field of ["gameRoutePaths", "mediaKinds", "qrAliasPaths", "localFallbackPaths"] as const) {
    if (!Array.isArray(value[field]) || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Pilot delivery package index ${field} must contain non-empty strings.`);
  }
  if (!["hosted-pwa", "closed-local", "hybrid"].includes(String(value.mode))) errors.push("Pilot delivery package index mode is unsupported.");
  if (!["not-selected", "opt-in-pending", "opt-in-approved"].includes(String(value.hostedPersistence))) errors.push("Pilot delivery package index hosted persistence status is unsupported.");
  const modeUsesHosted = value.mode === "hosted-pwa" || value.mode === "hybrid";
  if (modeUsesHosted && !isNonEmptyString(value.hostedPersistenceDecisionPacketId)) errors.push("Hosted or hybrid package indexes require a hosted persistence opt-in decision packet id.");
  if (!modeUsesHosted && value.hostedPersistenceDecisionPacketId !== null) errors.push("Closed-local package indexes must not carry a hosted persistence opt-in decision packet id.");
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
