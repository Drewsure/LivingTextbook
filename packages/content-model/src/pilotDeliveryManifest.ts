import type { PackageReadinessReconciliation } from "./packageReadinessReconciliation";
import type { PublisherPilotPackagePreview } from "./publisherPilotPackagePreview";

export type PilotDeliveryMode = "hosted-pwa" | "closed-local" | "hybrid";
export type PilotDeliveryManifestStatus = "blocked" | "ready-for-manual-release";
export type PilotDeliveryHostedPersistenceStatus = "not-selected" | "opt-in-pending" | "opt-in-approved";

export interface PilotDeliveryGateSnapshot {
  sourceReview: boolean;
  packageReadiness: boolean;
  multimediaRights: boolean;
  gameAudio: boolean;
  qrRegistry: boolean;
  qrPrintAuthorization: boolean;
  localBundle: boolean;
  hostedPersistence: boolean;
  teacherPolicy: boolean;
  releaseApproval: boolean;
}

export interface PilotDeliveryManifest {
  manifestId: string;
  tenantId: string;
  packageId: string;
  version: string;
  mode: PilotDeliveryMode;
  sourceAssemblyChecksum: string;
  status: PilotDeliveryManifestStatus;
  contentPackagePath: string;
  gameRoutePaths: string[];
  mediaKinds: string[];
  qrAliasPaths: string[];
  localFallbackPaths: string[];
  hostedPersistence: PilotDeliveryHostedPersistenceStatus;
  gates: PilotDeliveryGateSnapshot;
  unresolvedRequirements: string[];
  blockedActions: string[];
  deliveryAllowed: boolean;
  qrPrintAllowed: boolean;
  studentFacingActivationAllowed: boolean;
  sideEffect: "none";
}

const gateLabels: Array<[keyof PilotDeliveryGateSnapshot, string]> = [
  ["sourceReview", "Publisher source review"],
  ["packageReadiness", "Package readiness reconciliation"],
  ["multimediaRights", "Multimedia rights and checksums"],
  ["gameAudio", "Game audio coverage"],
  ["qrRegistry", "Durable QR alias registry"],
  ["qrPrintAuthorization", "Production QR print authorization"],
  ["localBundle", "Closed-local bundle readiness"],
  ["hostedPersistence", "Opt-in hosted persistence approval"],
  ["teacherPolicy", "Teacher, school, and retention policy"],
  ["releaseApproval", "Release-control approval"],
];

const blockedActions = [
  "No package writer execution without manual release approval",
  "No production QR print without QR authorization",
  "No student-facing activation without release approval",
  "No hosted persistence activation without opt-in policy and provider approval",
  "No local bundle handoff without checksums, rights, recovery, and update evidence",
] as const;

export function createPilotDeliveryManifest(input: {
  preview: PublisherPilotPackagePreview;
  reconciliation: PackageReadinessReconciliation;
  mode: PilotDeliveryMode;
  gates: PilotDeliveryGateSnapshot;
}): PilotDeliveryManifest {
  const identityErrors = validatePilotDeliverySourceIdentity(input.preview, input.reconciliation);
  const unresolvedRequirements = [
    ...identityErrors,
    ...gateLabels.filter(([gate]) => !input.gates[gate]).map(([, label]) => label),
    ...input.reconciliation.lanes
      .filter((lane) => lane.blocksRelease && lane.status !== "ready-preview")
      .map((lane) => `${lane.label}: ${lane.evidence}`),
    ...input.preview.artifacts
      .filter((artifact) => artifact.status !== "preview-ready")
      .map((artifact) => `${artifact.label}: ${artifact.missingEvidence.join(", ")}`),
  ];
  const ready = unresolvedRequirements.length === 0;
  const modeUsesHosted = input.mode === "hosted-pwa" || input.mode === "hybrid";
  const contentPackagePath = input.preview.artifacts.find((artifact) => artifact.kind === "content-package")?.proposedPath ?? "";

  return {
    manifestId: `${input.preview.packageId}:${input.mode}:delivery-manifest`,
    tenantId: input.preview.tenantId,
    packageId: input.preview.packageId,
    version: input.preview.version,
    mode: input.mode,
    sourceAssemblyChecksum: input.reconciliation.sourceAssemblyChecksum,
    status: ready ? "ready-for-manual-release" : "blocked",
    contentPackagePath,
    gameRoutePaths: input.preview.gameModes.map((mode) => `/games/${mode}`),
    mediaKinds: [...input.preview.mediaKinds],
    qrAliasPaths: input.preview.qrPreviews.map((qr) => qr.aliasPath),
    localFallbackPaths: input.preview.qrPreviews.map((qr) => qr.fallbackPath),
    hostedPersistence: modeUsesHosted ? (input.gates.hostedPersistence ? "opt-in-approved" : "opt-in-pending") : "not-selected",
    gates: { ...input.gates },
    unresolvedRequirements: [...new Set(unresolvedRequirements)],
    blockedActions: [...blockedActions],
    deliveryAllowed: ready,
    qrPrintAllowed: ready && input.gates.qrPrintAuthorization,
    studentFacingActivationAllowed: ready && input.gates.releaseApproval,
    sideEffect: "none",
  };
}

export function validatePilotDeliveryManifest(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Pilot delivery manifest must be an object."];
  for (const field of ["manifestId", "tenantId", "packageId", "version", "sourceAssemblyChecksum", "contentPackagePath"] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`Pilot delivery manifest ${field} must be non-empty.`);
  }
  if (!isSha256(value.sourceAssemblyChecksum)) errors.push("Pilot delivery manifest sourceAssemblyChecksum must be sha256:<64 hexadecimal characters>.");
  if (!isSafeRelativeOrInternalPath(value.contentPackagePath)) errors.push("Pilot delivery manifest contentPackagePath must be an internal package path.");
  if (!["hosted-pwa", "closed-local", "hybrid"].includes(String(value.mode))) errors.push("Pilot delivery manifest mode is unsupported.");
  if (!["blocked", "ready-for-manual-release"].includes(String(value.status))) errors.push("Pilot delivery manifest status is unsupported.");
  if (value.sideEffect !== "none") errors.push("Pilot delivery manifest must be side-effect-free.");
  if (!isRecord(value.gates)) errors.push("Pilot delivery manifest gates must be an object.");
  else for (const [gate] of gateLabels) if (typeof value.gates[gate] !== "boolean") errors.push(`Pilot delivery manifest gate ${gate} must be boolean.`);
  for (const field of ["gameRoutePaths", "mediaKinds", "qrAliasPaths", "localFallbackPaths", "unresolvedRequirements", "blockedActions"] as const) {
    if (!Array.isArray(value[field]) || value[field].some((item) => !isNonEmptyString(item))) errors.push(`Pilot delivery manifest ${field} must contain non-empty strings.`);
  }
  if (value.deliveryAllowed !== (value.status === "ready-for-manual-release")) errors.push("Pilot delivery manifest deliveryAllowed must match status.");
  if (value.status === "blocked" && (!Array.isArray(value.unresolvedRequirements) || value.unresolvedRequirements.length === 0)) errors.push("Blocked pilot delivery manifest must list unresolved requirements.");
  if (value.status === "ready-for-manual-release" && Array.isArray(value.unresolvedRequirements) && value.unresolvedRequirements.length > 0) errors.push("Ready pilot delivery manifest cannot list unresolved requirements.");
  if (value.status === "blocked" && value.qrPrintAllowed !== false) errors.push("Blocked pilot delivery manifest must block QR printing.");
  if (value.status === "blocked" && value.studentFacingActivationAllowed !== false) errors.push("Blocked pilot delivery manifest must block student-facing activation.");
  return [...new Set(errors)];
}

function validatePilotDeliverySourceIdentity(preview: PublisherPilotPackagePreview, reconciliation: PackageReadinessReconciliation): string[] {
  const errors: string[] = [];
  if (preview.tenantId !== reconciliation.tenantId) errors.push("Pilot delivery manifest tenant does not match package reconciliation.");
  if (preview.packageId !== reconciliation.packageId) errors.push("Pilot delivery manifest package does not match package reconciliation.");
  if (preview.readinessBinding.sourceAssemblyChecksum !== reconciliation.sourceAssemblyChecksum) errors.push("Pilot delivery manifest source checksum does not match package reconciliation.");
  if (reconciliation.mode !== "review-only" || reconciliation.promotionAllowed !== false || reconciliation.studentFacingActivationAllowed !== false) errors.push("Pilot delivery manifest requires a review-only reconciliation before release evaluation.");
  return errors;
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

function isSafeRelativeOrInternalPath(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.includes("..") && !value.includes("\\");
}
