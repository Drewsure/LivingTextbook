export type PackageReadinessLaneStatus = "ready-preview" | "needs-review" | "blocked";

export interface PackageReadinessLane {
  laneId: string;
  label: string;
  status: PackageReadinessLaneStatus;
  sourceRecord: string;
  referenceId: string;
  evidence: string;
  blocksRelease: boolean;
}

export interface PackageReadinessReconciliation {
  reconciliationId: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  label: string;
  summary: string;
  mode: "review-only";
  status: "blocked" | "review-only";
  sourceAssemblyPacketId: string;
  sourceExtractionPreviewId: string;
  sourceAssemblyChecksum: string;
  approvalLedgerId: string;
  verifierEvidencePacketId: string;
  targetLanguageAudioApprovalId: string;
  mediaRightsEvidenceId: string;
  publishGateId: string;
  assignmentRolloutGateId: string;
  targetLanguageProgressionRule: string;
  lanes: PackageReadinessLane[];
  blockedActions: string[];
  promotionAllowed: false;
  studentFacingActivationAllowed: false;
}

export const PACKAGE_READINESS_REQUIRED_LANE_IDS = [
  "source-assembly",
  "approval-ledger",
  "verifier-evidence",
  "target-language-audio",
  "media-rights",
  "publish-gate",
  "assignment-rollout",
] as const;

export const PACKAGE_READINESS_BLOCKED_ACTIONS = [
  "No package promotion from reconciliation",
  "No route registry write from reconciliation",
  "No playlist write from reconciliation",
  "No assignment write from reconciliation",
  "No local bundle write from reconciliation",
  "No student-facing activation from reconciliation",
] as const;

export function validatePackageReadinessReconciliation(reconciliation: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(reconciliation)) return ["Package readiness reconciliation must be a JSON object."];

  for (const field of [
    "reconciliationId",
    "tenantId",
    "packageId",
    "releaseCandidate",
    "label",
    "summary",
    "sourceAssemblyPacketId",
    "sourceExtractionPreviewId",
    "sourceAssemblyChecksum",
    "approvalLedgerId",
    "verifierEvidencePacketId",
    "targetLanguageAudioApprovalId",
    "mediaRightsEvidenceId",
    "publishGateId",
    "assignmentRolloutGateId",
    "targetLanguageProgressionRule",
  ] as const) {
    if (!isNonEmptyString(reconciliation[field])) errors.push(`Package readiness reconciliation ${field} is required.`);
  }

  if (reconciliation.mode !== "review-only") errors.push("Package readiness reconciliation must remain review-only.");
  if (reconciliation.status !== "blocked" && reconciliation.status !== "review-only") {
    errors.push("Package readiness reconciliation must use a supported review-only status.");
  }
  if (reconciliation.promotionAllowed !== false) errors.push("Package readiness reconciliation promotion must remain blocked.");
  if (reconciliation.studentFacingActivationAllowed !== false) {
    errors.push("Package readiness reconciliation student-facing activation must remain blocked.");
  }

  if (isNonEmptyString(reconciliation.sourceAssemblyChecksum) && !/^sha256:[0-9a-f]{64}$/i.test(reconciliation.sourceAssemblyChecksum)) {
    errors.push("Package readiness reconciliation sourceAssemblyChecksum must use the sha256:<64 hexadecimal characters> format.");
  }

  if (!Array.isArray(reconciliation.lanes) || reconciliation.lanes.length === 0) {
    errors.push("Package readiness reconciliation must include evidence lanes.");
  }

  const lanes = Array.isArray(reconciliation.lanes) ? reconciliation.lanes.filter(isRecord) : [];
  for (const laneId of PACKAGE_READINESS_REQUIRED_LANE_IDS) {
    if (!lanes.some((lane) => lane.laneId === laneId)) errors.push(`Package readiness reconciliation is missing lane: ${laneId}.`);
  }

  for (const lane of lanes) {
    for (const field of ["laneId", "label", "sourceRecord", "referenceId", "evidence"] as const) {
      if (!isNonEmptyString(lane[field])) errors.push(`Package readiness lane ${String(lane.laneId ?? "unknown")} requires ${field}.`);
    }
    if (!isPackageReadinessLaneStatus(lane.status)) {
      errors.push(`Package readiness lane ${String(lane.laneId ?? "unknown")} has an unsupported status.`);
    }
    if (typeof lane.blocksRelease !== "boolean") {
      errors.push(`Package readiness lane ${String(lane.laneId ?? "unknown")} blocksRelease must be a boolean.`);
    }
    if (lane.status === "ready-preview" && lane.blocksRelease === true) {
      errors.push(`Package readiness lane ${String(lane.laneId ?? "unknown")} cannot be ready while blocking release.`);
    }
  }

  if (!isNonEmptyString(reconciliation.targetLanguageProgressionRule)) {
    errors.push("Package readiness reconciliation must declare the target-language progression rule.");
  } else {
    const rule = reconciliation.targetLanguageProgressionRule.toLowerCase();
    if (!rule.includes("target-language") || !rule.includes("support")) {
      errors.push("Package readiness reconciliation must state that target-language activity drives progress and support language does not.");
    }
  }

  if (!Array.isArray(reconciliation.blockedActions)) {
    errors.push("Package readiness reconciliation blockedActions must be an array.");
  } else {
    for (const action of PACKAGE_READINESS_BLOCKED_ACTIONS) {
      if (!reconciliation.blockedActions.includes(action)) errors.push(`Package readiness reconciliation must block action: ${action}.`);
    }
  }

  if (reconciliation.status === "blocked" && !lanes.some((lane) => lane.status === "blocked" || lane.status === "needs-review")) {
    errors.push("Blocked package readiness reconciliation must show an unresolved evidence lane.");
  }

  return [...new Set(errors)];
}

export function validatePackageReadinessSourceAssemblyBinding(reconciliation: unknown, sourceAssembly: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(reconciliation)) return ["Package readiness source binding requires a reconciliation object."];
  if (!isRecord(sourceAssembly)) return ["Package readiness source binding requires a source assembly object."];

  const bindings = [
    ["tenantId", reconciliation.tenantId, sourceAssembly.tenantId],
    ["packageId", reconciliation.packageId, sourceAssembly.targetPackageId],
    ["sourceAssemblyPacketId", reconciliation.sourceAssemblyPacketId, sourceAssembly.packetId],
    ["sourceExtractionPreviewId", reconciliation.sourceExtractionPreviewId, sourceAssembly.extractionPreviewId],
    ["sourceAssemblyChecksum", reconciliation.sourceAssemblyChecksum, sourceAssembly.sourceChecksum],
  ] as const;

  for (const [field, readinessValue, assemblyValue] of bindings) {
    if (!isNonEmptyString(readinessValue) || !isNonEmptyString(assemblyValue)) {
      errors.push(`Package readiness source binding requires ${field} on both records.`);
    } else if (readinessValue !== assemblyValue) {
      errors.push(`Package readiness source binding ${field} does not match the source assembly.`);
    }
  }

  return [...new Set(errors)];
}

export function validatePackageReadinessExtractionPreviewBinding(reconciliation: unknown, preview: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(reconciliation)) return ["Package readiness extraction preview binding requires a reconciliation object."];
  if (!isRecord(preview)) return ["Package readiness extraction preview binding requires a preview object."];

  const bindings = [
    ["tenantId", reconciliation.tenantId, preview.tenantId],
    ["packageId", reconciliation.packageId, preview.targetPackageId],
    ["sourceExtractionPreviewId", reconciliation.sourceExtractionPreviewId, preview.previewId],
    ["sourceAssemblyChecksum", reconciliation.sourceAssemblyChecksum, preview.sourceChecksum],
  ] as const;

  for (const [field, readinessValue, previewValue] of bindings) {
    if (!isNonEmptyString(readinessValue) || !isNonEmptyString(previewValue)) {
      errors.push(`Package readiness extraction preview binding requires ${field} on both records.`);
    } else if (readinessValue !== previewValue) {
      errors.push(`Package readiness extraction preview binding ${field} does not match the preview.`);
    }
  }

  if (preview.mode !== "review-only") errors.push("Package readiness extraction preview must remain review-only.");
  if (preview.storageWriteAllowed !== false) errors.push("Package readiness extraction preview storage writes must remain blocked.");
  if (preview.studentFacingPayloadAllowed !== false) errors.push("Package readiness extraction preview student payloads must remain blocked.");
  return [...new Set(errors)];
}

export function validatePackageReadinessReconciliations(reconciliations: unknown[]): string[] {
  return reconciliations.flatMap((reconciliation) => validatePackageReadinessReconciliation(reconciliation));
}

function isPackageReadinessLaneStatus(value: unknown): value is PackageReadinessLaneStatus {
  return value === "ready-preview" || value === "needs-review" || value === "blocked";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
