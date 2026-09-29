import type { HostedPersistenceOptInDecisionPacket } from "./hostedPersistenceOptInDecisionPacket";
import type { PackageReadinessReconciliation } from "./packageReadinessReconciliation";
import type { PilotDeliveryManifest } from "./pilotDeliveryManifest";
import type { PilotDeliveryPackageIndex } from "./pilotDeliveryPackageIndex";
import type { PilotDeliveryReleaseReceipt } from "./pilotDeliveryReleaseReceipt";
import type { PublisherPilotPackagePreview } from "./publisherPilotPackagePreview";

export type PublisherPilotPackageReadinessBindingStatus = "blocked" | "ready-for-manual-assembly-review";
export type PublisherPilotPackageReadinessCheckStatus = "passed" | "open" | "blocked";

export interface PublisherPilotPackageReadinessCheck {
  checkId: string;
  label: string;
  status: PublisherPilotPackageReadinessCheckStatus;
  evidence: string;
  nextAction: string;
}

export interface PublisherPilotPackageReadinessBinding {
  recordVersion: 1;
  bindingId: string;
  tenantId: string;
  packageId: string;
  quarantineId: string;
  reviewPacketId: string;
  handoffPreviewId: string;
  assemblyPreflightId: string;
  packagePreviewId: string;
  readinessReconciliationId: string;
  deliveryManifestId: string;
  deliveryReleaseReceiptId: string;
  deliveryPackageIndexId: string;
  hostedPersistenceDecisionPacketId: string | null;
  sourceChecksumSha256: string;
  status: PublisherPilotPackageReadinessBindingStatus;
  checks: PublisherPilotPackageReadinessCheck[];
  blockedReasons: string[];
  nextGates: string[];
  packageAssemblyAllowed: false;
  promotionAllowed: false;
  studentFacingUseAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export const PUBLISHER_PILOT_PACKAGE_READINESS_CHECKS = [
  "quarantine-review",
  "review-packet",
  "assembly-preflight",
  "package-preview",
  "readiness-reconciliation",
  "delivery-manifest",
  "release-receipt",
  "package-index",
  "hosted-opt-in",
] as const;

export function createReviewOnlyPublisherPilotPackageReadinessBinding(input: {
  bindingId: string;
  tenantId: string;
  packageId: string;
  quarantineId: string;
  reviewPacketId: string;
  handoffPreviewId: string;
  assemblyPreflightId: string;
  packagePreviewId: string;
  readinessReconciliationId: string;
  deliveryManifestId: string;
  deliveryReleaseReceiptId: string;
  deliveryPackageIndexId: string;
  hostedPersistenceDecisionPacketId?: string | null;
  sourceChecksumSha256: string;
  checks: PublisherPilotPackageReadinessCheck[];
  nextGates: string[];
}): PublisherPilotPackageReadinessBinding {
  const checks = input.checks.map((check) => ({ ...check }));
  const blockedReasons = checks
    .filter((check) => check.status !== "passed")
    .map((check) => `${check.label}: ${check.evidence}`);

  return {
    recordVersion: 1,
    bindingId: input.bindingId,
    tenantId: input.tenantId,
    packageId: input.packageId,
    quarantineId: input.quarantineId,
    reviewPacketId: input.reviewPacketId,
    handoffPreviewId: input.handoffPreviewId,
    assemblyPreflightId: input.assemblyPreflightId,
    packagePreviewId: input.packagePreviewId,
    readinessReconciliationId: input.readinessReconciliationId,
    deliveryManifestId: input.deliveryManifestId,
    deliveryReleaseReceiptId: input.deliveryReleaseReceiptId,
    deliveryPackageIndexId: input.deliveryPackageIndexId,
    hostedPersistenceDecisionPacketId: input.hostedPersistenceDecisionPacketId ?? null,
    sourceChecksumSha256: input.sourceChecksumSha256,
    status: blockedReasons.length === 0 ? "ready-for-manual-assembly-review" : "blocked",
    checks,
    blockedReasons: [...new Set(blockedReasons)],
    nextGates: [...new Set(input.nextGates)],
    packageAssemblyAllowed: false,
    promotionAllowed: false,
    studentFacingUseAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };
}

export function validatePublisherPilotPackageReadinessBindingRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Publisher pilot package readiness binding must be an object."];
  if (value.recordVersion !== 1) errors.push("Publisher pilot package readiness binding recordVersion must be 1.");
  for (const field of [
    "bindingId", "tenantId", "packageId", "quarantineId", "reviewPacketId", "handoffPreviewId",
    "assemblyPreflightId", "packagePreviewId", "readinessReconciliationId", "deliveryManifestId",
    "deliveryReleaseReceiptId", "deliveryPackageIndexId",
  ] as const) {
    if (!isSafeIdentifier(value[field])) errors.push(`Publisher pilot package readiness binding ${field} must be a safe identifier.`);
  }
  if (value.hostedPersistenceDecisionPacketId !== null && !isSafeIdentifier(value.hostedPersistenceDecisionPacketId)) {
    errors.push("Publisher pilot package readiness binding hosted persistence packet id must be null or a safe identifier.");
  }
  if (!/^[a-f0-9]{64}$/.test(String(value.sourceChecksumSha256 ?? ""))) {
    errors.push("Publisher pilot package readiness binding sourceChecksumSha256 must be lowercase SHA-256.");
  }
  if (value.status !== "blocked" && value.status !== "ready-for-manual-assembly-review") {
    errors.push("Publisher pilot package readiness binding status is unsupported.");
  }
  if (!Array.isArray(value.checks) || value.checks.length === 0) errors.push("Publisher pilot package readiness binding checks must be non-empty.");
  const checks = Array.isArray(value.checks) ? value.checks : [];
  const seen = new Set<string>();
  for (const check of checks) {
    if (!isRecord(check)) { errors.push("Publisher pilot package readiness checks must be objects."); continue; }
    if (!isSafeIdentifier(check.checkId)) errors.push("Publisher pilot package readiness check id must be safe.");
    if (seen.has(String(check.checkId))) errors.push(`Publisher pilot package readiness contains duplicate check ${String(check.checkId)}.`);
    seen.add(String(check.checkId));
    for (const field of ["label", "evidence", "nextAction"] as const) if (!isNonEmptyString(check[field])) errors.push(`Publisher pilot package readiness check ${field} must be non-empty.`);
    if (check.status !== "passed" && check.status !== "open" && check.status !== "blocked") errors.push(`Publisher pilot package readiness check ${String(check.checkId)} status is unsupported.`);
  }
  for (const checkId of PUBLISHER_PILOT_PACKAGE_READINESS_CHECKS) if (!seen.has(checkId)) errors.push(`Publisher pilot package readiness is missing required check ${checkId}.`);
  for (const field of ["blockedReasons", "nextGates"] as const) {
    if (!Array.isArray(value[field]) || value[field].length === 0 || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Publisher pilot package readiness ${field} must contain non-empty strings.`);
  }
  const hasOpenChecks = checks.some((check) => check.status !== "passed");
  if (value.status === "blocked" && !hasOpenChecks) errors.push("Blocked publisher pilot package readiness must have an open or blocked check.");
  if (value.status === "ready-for-manual-assembly-review" && hasOpenChecks) errors.push("Ready publisher pilot package readiness cannot have open or blocked checks.");
  if (value.status === "ready-for-manual-assembly-review" && Array.isArray(value.blockedReasons) && value.blockedReasons.length > 0) errors.push("Ready publisher pilot package readiness cannot list blocked reasons.");
  if (value.packageAssemblyAllowed !== false) errors.push("Publisher pilot package readiness must block package assembly.");
  if (value.promotionAllowed !== false) errors.push("Publisher pilot package readiness must block promotion.");
  if (value.studentFacingUseAllowed !== false) errors.push("Publisher pilot package readiness must block student-facing use.");
  if (value.mode !== "review-only") errors.push("Publisher pilot package readiness must remain review-only.");
  if (value.sideEffect !== "none") errors.push("Publisher pilot package readiness must remain side-effect-free.");
  return [...new Set(errors)];
}

export function validatePublisherPilotPackageReadinessBindingAgainstSources(
  binding: PublisherPilotPackageReadinessBinding,
  sources: {
    preview: PublisherPilotPackagePreview;
    reconciliation: PackageReadinessReconciliation;
    manifest: PilotDeliveryManifest;
    receipt: PilotDeliveryReleaseReceipt;
    packageIndex: PilotDeliveryPackageIndex;
    hostedPersistenceDecisionPacket?: HostedPersistenceOptInDecisionPacket;
  },
): string[] {
  const errors = validatePublisherPilotPackageReadinessBindingRecord(binding);
  const { preview, reconciliation, manifest, receipt, packageIndex, hostedPersistenceDecisionPacket } = sources;
  const expected = [
    ["tenantId", binding.tenantId, preview.tenantId],
    ["packageId", binding.packageId, preview.packageId],
    ["packagePreviewId", binding.packagePreviewId, preview.previewId],
    ["readinessReconciliationId", binding.readinessReconciliationId, reconciliation.reconciliationId],
    ["deliveryManifestId", binding.deliveryManifestId, manifest.manifestId],
    ["deliveryReleaseReceiptId", binding.deliveryReleaseReceiptId, receipt.receiptId],
    ["deliveryPackageIndexId", binding.deliveryPackageIndexId, `${manifest.manifestId}:package-index`],
    ["sourceChecksumSha256", binding.sourceChecksumSha256, reconciliation.sourceAssemblyChecksum.replace(/^sha256:/, "")],
    ["reviewPacketId", binding.reviewPacketId, hostedPersistenceDecisionPacket?.reviewPacketId],
    ["quarantineId", binding.quarantineId, hostedPersistenceDecisionPacket?.quarantineId],
    ["hostedPersistenceDecisionPacketId", binding.hostedPersistenceDecisionPacketId, manifest.hostedPersistenceDecisionPacketId],
  ] as const;
  for (const [field, actual, expectedValue] of expected) if (actual !== expectedValue) errors.push(`Publisher pilot package readiness binding ${field} does not match source lineage.`);
  if (hostedPersistenceDecisionPacket && binding.hostedPersistenceDecisionPacketId !== hostedPersistenceDecisionPacket.packetId) errors.push("Publisher pilot package readiness binding hosted packet does not match the decision packet.");
  if (manifest.mode !== "closed-local" && !binding.hostedPersistenceDecisionPacketId) errors.push("Hosted or hybrid publisher pilot readiness requires a hosted persistence decision packet.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeIdentifier(value: unknown): value is string {
  return isNonEmptyString(value) && value.length <= 240 && /^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(value);
}
