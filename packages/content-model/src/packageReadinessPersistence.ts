import type { PackageReadinessReconciliation } from "./packageReadinessReconciliation";

export type PackageReadinessPersistenceStore = "hosted-database" | "local-classroom-store";

export interface PackageReadinessEvidenceLaneRefs {
  sourceAssemblyPacketId: string;
  sourceAssemblyChecksum: string;
  approvalLedgerId: string;
  verifierEvidencePacketId: string;
  targetLanguageAudioApprovalId: string;
  mediaRightsEvidenceId: string;
  publishGateId: string;
  assignmentRolloutGateId: string;
}

export interface PackageReadinessPersistenceIntent {
  intentId: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  reconciliationId: string;
  label: string;
  store: PackageReadinessPersistenceStore;
  mode: "review-only";
  state: "metadata-preview";
  provider: null;
  evidenceLaneRefs: PackageReadinessEvidenceLaneRefs;
  blockedActions: string[];
  writeAllowed: false;
  promotionAllowed: false;
  studentFacingActivationAllowed: false;
  containsStudentData: false;
  storesRawAudio: false;
  storesTranscript: false;
  summary: string;
}

export function buildPackageReadinessPersistenceIntent(
  reconciliation: PackageReadinessReconciliation,
  store: PackageReadinessPersistenceStore,
): PackageReadinessPersistenceIntent {
  return {
    intentId: `${store}-${reconciliation.reconciliationId}-metadata-preview`,
    tenantId: reconciliation.tenantId,
    packageId: reconciliation.packageId,
    releaseCandidate: reconciliation.releaseCandidate,
    reconciliationId: reconciliation.reconciliationId,
    label: `${reconciliation.label} ${store} metadata preview`,
    store,
    mode: "review-only",
    state: "metadata-preview",
    provider: null,
    evidenceLaneRefs: {
      sourceAssemblyPacketId: reconciliation.sourceAssemblyPacketId,
      sourceAssemblyChecksum: reconciliation.sourceAssemblyChecksum,
      approvalLedgerId: reconciliation.approvalLedgerId,
      verifierEvidencePacketId: reconciliation.verifierEvidencePacketId,
      targetLanguageAudioApprovalId: reconciliation.targetLanguageAudioApprovalId,
      mediaRightsEvidenceId: reconciliation.mediaRightsEvidenceId,
      publishGateId: reconciliation.publishGateId,
      assignmentRolloutGateId: reconciliation.assignmentRolloutGateId,
    },
    blockedActions: [...reconciliation.blockedActions],
    writeAllowed: false,
    promotionAllowed: false,
    studentFacingActivationAllowed: false,
    containsStudentData: false,
    storesRawAudio: false,
    storesTranscript: false,
    summary:
      "A tenant-scoped metadata shape for a future adapter. It preserves the evidence chain without writing storage, selecting a provider, promoting a package, or activating student routes.",
  };
}

export function validatePackageReadinessPersistenceIntent(intent: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(intent)) return ["Package readiness persistence intent must be a JSON object."];

  for (const field of [
    "intentId",
    "tenantId",
    "packageId",
    "releaseCandidate",
    "reconciliationId",
    "label",
    "store",
    "mode",
    "state",
    "summary",
  ] as const) {
    if (!isNonEmptyString(intent[field])) errors.push(`Package readiness persistence intent ${field} is required.`);
  }

  if (intent.store !== "hosted-database" && intent.store !== "local-classroom-store") {
    errors.push("Package readiness persistence intent must use a supported provider-neutral store tier.");
  }
  if (intent.mode !== "review-only") errors.push("Package readiness persistence intent must remain review-only.");
  if (intent.state !== "metadata-preview") errors.push("Package readiness persistence intent must remain a metadata preview.");
  if (intent.provider !== null) errors.push("Package readiness persistence intent must not select a provider.");
  for (const field of ["writeAllowed", "promotionAllowed", "studentFacingActivationAllowed", "containsStudentData", "storesRawAudio", "storesTranscript"] as const) {
    if (intent[field] !== false) errors.push(`Package readiness persistence intent ${field} must remain false.`);
  }

  const refs = isRecord(intent.evidenceLaneRefs) ? intent.evidenceLaneRefs : null;
  if (!refs) {
    errors.push("Package readiness persistence intent must include evidence lane references.");
  } else {
    for (const field of [
      "sourceAssemblyPacketId",
      "sourceAssemblyChecksum",
      "approvalLedgerId",
      "verifierEvidencePacketId",
      "targetLanguageAudioApprovalId",
      "mediaRightsEvidenceId",
      "publishGateId",
      "assignmentRolloutGateId",
    ] as const) {
      if (!isNonEmptyString(refs[field])) errors.push(`Package readiness persistence intent requires ${field}.`);
    }
  }

  if (!Array.isArray(intent.blockedActions) || intent.blockedActions.length === 0) {
    errors.push("Package readiness persistence intent must list blocked actions.");
  }

  return [...new Set(errors)];
}

export function validatePackageReadinessPersistenceIntents(intents: unknown[]): string[] {
  const errors = intents.flatMap(validatePackageReadinessPersistenceIntent);
  const ids = new Set<string>();
  for (const intent of intents) {
    if (!isRecord(intent) || !isNonEmptyString(intent.intentId)) continue;
    if (ids.has(intent.intentId)) errors.push(`Package readiness persistence intent id is duplicated: ${intent.intentId}.`);
    ids.add(intent.intentId);
  }
  return [...new Set(errors)];
}

export function validatePackageReadinessPersistenceFlags(value: Record<string, unknown>, label: string): string[] {
  if (value.category !== "package-readiness-reconciliation") return [];
  const requiredFlags = [
    "preservesPackageReadinessReconciliation",
    "requiresPackageReadinessEvidenceLanes",
    "requiresPackageReadinessRecordRefs",
    "blocksPackageReadinessPromotion",
    "blocksPackageReadinessRouteWrite",
    "blocksPackageReadinessPlaylistWrite",
    "blocksPackageReadinessAssignmentWrite",
    "blocksPackageReadinessLocalBundleWrite",
    "blocksPackageReadinessStudentActivation",
  ] as const;
  return requiredFlags
    .filter((flag) => value[flag] !== true)
    .map((flag) => `${label} must set ${flag} to true.`);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
