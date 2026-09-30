import type { PilotDeliveryHostedPersistenceStatus, PilotDeliveryMode } from "./pilotDeliveryManifest";

export interface LocalPilotPackageHandoff {
  handoffVersion: 1;
  handoffId: string;
  tenantId: string;
  packageId: string;
  version: string;
  bundleId: string;
  mode: PilotDeliveryMode;
  manifestId: string;
  receiptId: string;
  sourceAssemblyChecksum: string;
  qrPrintArtifactId: string;
  qrPrintHtmlChecksum: string;
  qrAliasRegistryRecordId: string;
  routeCount: number;
  gameRouteCount: number;
  mediaKinds: string[];
  hostedPersistence: PilotDeliveryHostedPersistenceStatus;
  hostedPersistenceDecisionPacketId: string | null;
  status: "verified-local-package";
  learnerRecordsIncluded: false;
  writesAllowed: false;
  hostedPersistenceActivated: false;
  qrAliasesMutated: false;
  sideEffect: "none";
}

export function validateLocalPilotPackageHandoff(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Local pilot package handoff must be an object."];
  if (value.handoffVersion !== 1) errors.push("Local pilot package handoff handoffVersion must be 1.");
  for (const field of ["handoffId", "tenantId", "packageId", "version", "bundleId", "manifestId", "receiptId", "qrPrintArtifactId", "qrPrintHtmlChecksum", "qrAliasRegistryRecordId", "sourceAssemblyChecksum"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Local pilot package handoff ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum) || !isSha256(value.qrPrintHtmlChecksum)) errors.push("Local pilot package handoff checksums must be sha256:<64 hexadecimal characters>.");
  if (!["hosted-pwa", "closed-local", "hybrid"].includes(String(value.mode))) errors.push("Local pilot package handoff mode is unsupported.");
  if (!["not-selected", "opt-in-pending", "opt-in-approved"].includes(String(value.hostedPersistence))) errors.push("Local pilot package handoff hosted persistence status is unsupported.");
  if (value.mode === "closed-local" && value.hostedPersistenceDecisionPacketId !== null) errors.push("Closed-local handoffs must not carry a hosted persistence decision packet id.");
  if ((value.mode === "hosted-pwa" || value.mode === "hybrid") && !isNonEmptyString(value.hostedPersistenceDecisionPacketId)) errors.push("Hosted or hybrid handoffs require a hosted persistence decision packet id.");
  if (!Number.isInteger(value.routeCount) || Number(value.routeCount) < 1) errors.push("Local pilot package handoff routeCount must be a positive integer.");
  if (!Number.isInteger(value.gameRouteCount) || Number(value.gameRouteCount) < 1) errors.push("Local pilot package handoff gameRouteCount must be a positive integer.");
  if (!Array.isArray(value.mediaKinds) || value.mediaKinds.some((item) => !isNonEmptyString(item))) errors.push("Local pilot package handoff mediaKinds must contain strings.");
  if (value.status !== "verified-local-package") errors.push("Local pilot package handoff status must be verified-local-package.");
  if (value.learnerRecordsIncluded !== false || value.writesAllowed !== false || value.hostedPersistenceActivated !== false || value.qrAliasesMutated !== false) errors.push("Local pilot package handoff must preserve all operational and learner-data boundaries.");
  if (value.sideEffect !== "none") errors.push("Local pilot package handoff must be side-effect-free.");
  if (isNonEmptyString(value.packageId) && isNonEmptyString(value.version) && value.handoffId !== `${value.packageId}:${value.version}:local-package-handoff`) errors.push("Local pilot package handoff handoffId must bind package and version.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, any> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isNonEmptyString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isSha256(value: unknown): boolean { return typeof value === "string" && /^sha256:[0-9a-f]{64}$/i.test(value); }
