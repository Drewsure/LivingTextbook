export type WhiteLabelReleaseReadinessStatus = "blocked" | "review-only" | "pilot-ready";
export type WhiteLabelReleasePhaseStatus = "blocked" | "review-only" | "ready";

export type WhiteLabelReleasePhaseId =
  | "foundation-hardening"
  | "canonical-game-integration"
  | "controlled-pilot"
  | "publisher-content-pipeline"
  | "production-persistence-deployment"
  | "accessibility-localization"
  | "optional-ai-services"
  | "release-readiness";

export interface WhiteLabelReleasePhase {
  phaseId: WhiteLabelReleasePhaseId;
  label: string;
  status: WhiteLabelReleasePhaseStatus;
  evidenceRecords: string[];
  blockers: string[];
  nextAction: string;
}

export interface WhiteLabelReleaseQualityChecks {
  typecheck: boolean;
  productionBuild: boolean;
  activeRoutes: boolean;
  runtime: boolean;
  browser: boolean;
  privacy: boolean;
  tenantIsolation: boolean;
}

export interface WhiteLabelReleasePackageEvidence {
  reconciliationId: string;
  packageId: string;
  sourceAssemblyChecksum: string;
  status: "blocked" | "review-only";
  totalLaneCount: number;
  readyPreviewLaneCount: number;
  unresolvedLaneCount: number;
  unresolvedLaneIds: string[];
  promotionAllowed: false;
  studentFacingActivationAllowed: false;
}

export interface WhiteLabelReleaseReadiness {
  readinessId: string;
  tenantId: string;
  packageId: string;
  label: string;
  status: WhiteLabelReleaseReadinessStatus;
  phases: WhiteLabelReleasePhase[];
  qualityChecks: WhiteLabelReleaseQualityChecks;
  packageEvidence: WhiteLabelReleasePackageEvidence;
  productionApprovalAllowed: false;
  studentProductionLaunchAllowed: false;
  blockedActions: string[];
  nextAction: string;
  note: string;
}

export const WHITE_LABEL_RELEASE_REQUIRED_PHASE_IDS = [
  "foundation-hardening",
  "canonical-game-integration",
  "controlled-pilot",
  "publisher-content-pipeline",
  "production-persistence-deployment",
  "accessibility-localization",
  "optional-ai-services",
  "release-readiness",
] as const satisfies readonly WhiteLabelReleasePhaseId[];

export const WHITE_LABEL_RELEASE_BLOCKED_ACTIONS = [
  "No production approval",
  "No student production launch",
  "No real learner data collection",
  "No provider activation",
  "No package promotion",
  "No QR redirect mutation",
  "No public community publishing",
] as const;

export function deriveWhiteLabelReleaseReadinessStatus(
  phases: Array<{ status: WhiteLabelReleasePhaseStatus }>,
): WhiteLabelReleaseReadinessStatus {
  if (phases.length === 0 || phases.some((phase) => phase.status === "blocked")) return "blocked";
  if (phases.some((phase) => phase.status === "review-only")) return "review-only";
  return "pilot-ready";
}

export function validateWhiteLabelReleaseReadiness(readiness: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(readiness)) return ["White-label release readiness must be a JSON object."];

  for (const field of ["readinessId", "tenantId", "packageId", "label", "nextAction", "note"] as const) {
    if (typeof readiness[field] !== "string" || readiness[field].trim().length === 0) {
      errors.push(`White-label release readiness ${field} must be non-empty.`);
    }
  }

  const status = readString(readiness, "status");
  if (!["blocked", "review-only", "pilot-ready"].includes(status)) errors.push("White-label release readiness status is unsupported.");
  const phases = readPhases(readiness, errors);
  if (phases.length !== WHITE_LABEL_RELEASE_REQUIRED_PHASE_IDS.length) errors.push("White-label release readiness must contain all eight release phases.");

  const phaseIds = new Set(phases.map((phase) => phase.phaseId));
  if (phaseIds.size !== phases.length) errors.push("White-label release readiness phase ids must be unique.");
  for (const requiredPhaseId of WHITE_LABEL_RELEASE_REQUIRED_PHASE_IDS) {
    if (!phaseIds.has(requiredPhaseId)) errors.push(`White-label release readiness is missing phase ${requiredPhaseId}.`);
  }
  const derivedStatus = deriveWhiteLabelReleaseReadinessStatus(phases);
  if (status !== derivedStatus) errors.push(`White-label release readiness status must match phases: expected ${derivedStatus}, received ${status}.`);

  const qualityChecks = readiness.qualityChecks;
  if (!isRecord(qualityChecks)) {
    errors.push("White-label release readiness qualityChecks must be an object.");
  } else {
    for (const field of ["typecheck", "productionBuild", "activeRoutes", "runtime", "browser", "privacy", "tenantIsolation"] as const) {
      if (typeof qualityChecks[field] !== "boolean") errors.push(`White-label release readiness quality check ${field} must be boolean.`);
    }
  }

  const packageEvidence = readiness.packageEvidence;
  if (!isRecord(packageEvidence)) {
    errors.push("White-label release readiness packageEvidence must be an object.");
  } else {
    for (const field of ["reconciliationId", "packageId", "sourceAssemblyChecksum"] as const) {
      if (!isNonEmptyString(packageEvidence[field])) errors.push(`White-label release package evidence ${field} must be non-empty.`);
    }
    if (packageEvidence.packageId !== readiness.packageId) errors.push("White-label release package evidence must match the readiness package.");
    if (!["blocked", "review-only"].includes(readString(packageEvidence, "status"))) errors.push("White-label release package evidence status is unsupported.");
    for (const field of ["totalLaneCount", "readyPreviewLaneCount", "unresolvedLaneCount"] as const) {
      if (!Number.isInteger(packageEvidence[field]) || Number(packageEvidence[field]) < 0) errors.push(`White-label release package evidence ${field} must be a non-negative integer.`);
    }
    const unresolvedLaneIds = readStringArray(packageEvidence, "unresolvedLaneIds");
    if (Number(packageEvidence.unresolvedLaneCount) !== unresolvedLaneIds.length) errors.push("White-label release package evidence unresolved lane count must match its ids.");
    if (Number(packageEvidence.totalLaneCount) < Number(packageEvidence.readyPreviewLaneCount) + Number(packageEvidence.unresolvedLaneCount)) errors.push("White-label release package evidence lane counts cannot exceed the total.");
    if (packageEvidence.promotionAllowed !== false) errors.push("White-label release package evidence promotion must remain false.");
    if (packageEvidence.studentFacingActivationAllowed !== false) errors.push("White-label release package evidence student activation must remain false.");
    if (!/^sha256:[0-9a-f]{64}$/i.test(readString(packageEvidence, "sourceAssemblyChecksum"))) errors.push("White-label release package evidence checksum must use sha256:<64 hexadecimal characters> format.");
  }

  if (readiness.productionApprovalAllowed !== false) errors.push("White-label release readiness production approval must remain false.");
  if (readiness.studentProductionLaunchAllowed !== false) errors.push("White-label release readiness student production launch must remain false.");
  const blockedActions = readStringArray(readiness, "blockedActions");
  for (const action of WHITE_LABEL_RELEASE_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) errors.push(`White-label release readiness must block: ${action}.`);
  }
  return [...new Set(errors)];
}

function readPhases(record: Record<string, unknown>, errors: string[]): WhiteLabelReleasePhase[] {
  if (!Array.isArray(record.phases)) {
    errors.push("White-label release readiness phases must be an array.");
    return [];
  }
  return record.phases.flatMap((value) => {
    if (!isRecord(value)) {
      errors.push("White-label release readiness phase entries must be objects.");
      return [];
    }
    const phaseId = readString(value, "phaseId") as WhiteLabelReleasePhaseId;
    const status = readString(value, "status") as WhiteLabelReleasePhaseStatus;
    const evidenceRecords = readStringArray(value, "evidenceRecords");
    const blockers = readStringArray(value, "blockers");
    for (const field of ["phaseId", "label", "nextAction"] as const) {
      if (!readString(value, field)) errors.push(`White-label release phase ${phaseId || "(unknown)"} ${field} must be non-empty.`);
    }
    if (!["blocked", "review-only", "ready"].includes(status)) errors.push(`White-label release phase ${phaseId || "(unknown)"} status is unsupported.`);
    if (evidenceRecords.length === 0) errors.push(`White-label release phase ${phaseId || "(unknown)"} must list evidence records.`);
    if (status !== "ready" && blockers.length === 0) errors.push(`White-label release phase ${phaseId || "(unknown)"} must list blockers while not ready.`);
    return [{
      phaseId,
      label: readString(value, "label"),
      status,
      evidenceRecords,
      blockers,
      nextAction: readString(value, "nextAction"),
    }];
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string): string {
  return typeof record[key] === "string" ? record[key].trim() : "";
}

function readStringArray(record: Record<string, unknown>, key: string): string[] {
  return Array.isArray(record[key]) ? record[key].filter((value): value is string => typeof value === "string" && value.trim().length > 0) : [];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
