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

export type WhiteLabelReleaseQualityCheckId = keyof WhiteLabelReleaseQualityChecks;
export type WhiteLabelReleaseQualityEvidenceKind =
  | "command"
  | "route-sweep"
  | "browser-rehearsal"
  | "privacy-negative-test"
  | "tenant-negative-test";
export type WhiteLabelReleaseBrowserEvidenceMode = "coded-rehearsal" | "browser-automation" | "human-observed";

export interface WhiteLabelReleaseQualityEvidence {
  checkId: WhiteLabelReleaseQualityCheckId;
  tenantId: string;
  packageId: string;
  label: string;
  verified: boolean;
  evidenceKind: WhiteLabelReleaseQualityEvidenceKind;
  sourceRecord: string;
  scope: string[];
  observedAt: string;
  notes: string;
}

export interface WhiteLabelReleasePackageEvidence {
  reconciliationId: string;
  tenantId: string;
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

export interface WhiteLabelReleasePilotEvidence {
  decisionId: string;
  tenantId: string;
  packageId: string;
  handoffRouteKey: string;
  evidenceHandoffRouteKey: string;
  status: "demo-ready-pilot-blocked" | "pilot-ready";
  blockingReasons: string[];
  blockingReasonCount: number;
  evidenceBindings: string[];
  pilotLaunchAllowed: false;
  studentDataCollectionAllowed: false;
  reportExportAllowed: false;
}

export interface WhiteLabelReleaseControlEvidence {
  releaseGateId: string;
  approvalLedgerId: string;
  tenantId: string;
  releaseCandidate: string;
  packageId: string;
  status: "blocked" | "review-only" | "pilot-ready";
  blockingGateCount: number;
  requiredApprovalCount: number;
  openApprovalCount: number;
  sourceRecords: string[];
  promotionAllowed: false;
  studentFacingActivationAllowed: false;
}

export interface WhiteLabelReleaseRouteEvidence {
  tenantId: string;
  packageId: string;
  activeRouteCount: number;
  expectedActiveRouteCount: number;
  routeMatrixSource: string;
  activeRouteVerifierSource: string;
  deploymentGuideId: string;
  deploymentStatus: "review-only";
  sourceRecords: string[];
}

export interface WhiteLabelReleaseReadiness {
  readinessId: string;
  tenantId: string;
  packageId: string;
  label: string;
  verificationRunId: string;
  verificationRevision: string;
  verificationReferenceAt: string;
  browserEvidenceMode: WhiteLabelReleaseBrowserEvidenceMode;
  status: WhiteLabelReleaseReadinessStatus;
  phases: WhiteLabelReleasePhase[];
  qualityChecks: WhiteLabelReleaseQualityChecks;
  qualityEvidence: WhiteLabelReleaseQualityEvidence[];
  packageEvidence: WhiteLabelReleasePackageEvidence;
  pilotEvidence: WhiteLabelReleasePilotEvidence;
  releaseControlEvidence: WhiteLabelReleaseControlEvidence;
  routeEvidence: WhiteLabelReleaseRouteEvidence;
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

export const WHITE_LABEL_RELEASE_EVIDENCE_FRESHNESS_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

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

  for (const field of ["readinessId", "tenantId", "packageId", "label", "verificationRunId", "verificationRevision", "verificationReferenceAt", "browserEvidenceMode", "nextAction", "note"] as const) {
    if (typeof readiness[field] !== "string" || readiness[field].trim().length === 0) {
      errors.push(`White-label release readiness ${field} must be non-empty.`);
    }
  }
  if (!isIsoTimestamp(readiness.verificationReferenceAt)) {
    errors.push("White-label release readiness verificationReferenceAt must be an ISO timestamp.");
  }
  const browserEvidenceMode = readString(readiness, "browserEvidenceMode");
  if (!["coded-rehearsal", "browser-automation", "human-observed"].includes(browserEvidenceMode)) {
    errors.push("White-label release readiness browserEvidenceMode is unsupported.");
  }
  const status = readString(readiness, "status");
  if (!["blocked", "review-only", "pilot-ready"].includes(status)) errors.push("White-label release readiness status is unsupported.");
  if (status === "pilot-ready" && browserEvidenceMode === "coded-rehearsal") {
    errors.push("Pilot-ready white-label release readiness requires browser automation or human-observed browser evidence.");
  }
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

  if (status === "pilot-ready" && isRecord(qualityChecks)) {
    const missingQualityChecks = ["typecheck", "productionBuild", "activeRoutes", "runtime", "browser", "privacy", "tenantIsolation"]
      .filter((field) => qualityChecks[field] !== true);
    if (missingQualityChecks.length > 0) errors.push(`Pilot-ready white-label release readiness requires every quality check: ${missingQualityChecks.join(", ")}.`);
  }

  const qualityEvidence = readiness.qualityEvidence;
  const qualityCheckIds = ["typecheck", "productionBuild", "activeRoutes", "runtime", "browser", "privacy", "tenantIsolation"] as const;
  const expectedEvidenceKinds: Record<WhiteLabelReleaseQualityCheckId, WhiteLabelReleaseQualityEvidenceKind> = {
    typecheck: "command",
    productionBuild: "command",
    activeRoutes: "route-sweep",
    runtime: "command",
    browser: "browser-rehearsal",
    privacy: "privacy-negative-test",
    tenantIsolation: "tenant-negative-test",
  };
  if (!Array.isArray(qualityEvidence) || qualityEvidence.length !== qualityCheckIds.length) {
    errors.push("White-label release readiness must include exactly seven quality evidence records.");
  } else {
    const seenQualityChecks = new Set<string>();
    for (const evidence of qualityEvidence) {
      if (!isRecord(evidence)) {
        errors.push("White-label release quality evidence entries must be objects.");
        continue;
      }
      const checkId = readString(evidence, "checkId");
      if (!qualityCheckIds.includes(checkId as (typeof qualityCheckIds)[number])) errors.push(`White-label release quality evidence check id is unsupported: ${checkId || "(empty)"}.`);
      if (seenQualityChecks.has(checkId)) errors.push(`White-label release quality evidence check id is duplicated: ${checkId}.`);
      seenQualityChecks.add(checkId);
      for (const field of ["tenantId", "packageId", "label", "sourceRecord", "observedAt", "notes"] as const) {
        if (!isNonEmptyString(evidence[field])) errors.push(`White-label release quality evidence ${checkId || "(unknown)"} ${field} must be non-empty.`);
      }
      if (evidence.tenantId !== readiness.tenantId) errors.push(`White-label release quality evidence ${checkId || "(unknown)"} must match the readiness tenant.`);
      if (evidence.packageId !== readiness.packageId) errors.push(`White-label release quality evidence ${checkId || "(unknown)"} must match the readiness package.`);
      if (typeof evidence.verified !== "boolean") errors.push(`White-label release quality evidence ${checkId || "(unknown)"} verified must be boolean.`);
      const evidenceKind = readString(evidence, "evidenceKind");
      if (!["command", "route-sweep", "browser-rehearsal", "privacy-negative-test", "tenant-negative-test"].includes(evidenceKind)) {
        errors.push(`White-label release quality evidence ${checkId || "(unknown)"} evidence kind is unsupported.`);
      } else if (qualityCheckIds.includes(checkId as (typeof qualityCheckIds)[number]) && evidenceKind !== expectedEvidenceKinds[checkId as WhiteLabelReleaseQualityCheckId]) {
        errors.push(`White-label release quality evidence ${checkId} must use evidence kind ${expectedEvidenceKinds[checkId as WhiteLabelReleaseQualityCheckId]}.`);
      }
      const rawScope = evidence.scope;
      const scope = readStringArray(evidence, "scope");
      if (!Array.isArray(rawScope) || rawScope.some((item) => typeof item !== "string" || item.trim().length === 0)) {
        errors.push(`White-label release quality evidence ${checkId || "(unknown)"} scope must contain only non-empty strings.`);
      }
      if (scope.length === 0) errors.push(`White-label release quality evidence ${checkId || "(unknown)"} scope must not be empty.`);
      if (new Set(scope).size !== scope.length) errors.push(`White-label release quality evidence ${checkId || "(unknown)"} scope must be unique.`);
      if (!isIsoTimestamp(evidence.observedAt)) errors.push(`White-label release quality evidence ${checkId || "(unknown)"} observedAt must be an ISO timestamp.`);
      if (isRecord(qualityChecks) && qualityCheckIds.includes(checkId as (typeof qualityCheckIds)[number]) && qualityChecks[checkId as WhiteLabelReleaseQualityCheckId] !== evidence.verified) {
        errors.push(`White-label release quality evidence ${checkId} must match its quality check.`);
      }
    }
    for (const checkId of qualityCheckIds) if (!seenQualityChecks.has(checkId)) errors.push(`White-label release quality evidence is missing ${checkId}.`);
    if (status === "pilot-ready" && qualityEvidence.some((evidence) => isRecord(evidence) && evidence.verified !== true)) {
      errors.push("Pilot-ready white-label release readiness requires every quality evidence record to be verified.");
    }
    if (isIsoTimestamp(readiness.verificationReferenceAt)) {
      errors.push(...validateWhiteLabelReleaseReadinessFreshness(readiness, readiness.verificationReferenceAt));
    }
  }

  const packageEvidence = readiness.packageEvidence;
  if (!isRecord(packageEvidence)) {
    errors.push("White-label release readiness packageEvidence must be an object.");
  } else {
    for (const field of ["reconciliationId", "tenantId", "packageId", "sourceAssemblyChecksum"] as const) {
      if (!isNonEmptyString(packageEvidence[field])) errors.push(`White-label release package evidence ${field} must be non-empty.`);
    }
    if (packageEvidence.tenantId !== readiness.tenantId) errors.push("White-label release package evidence must match the readiness tenant.");
    if (packageEvidence.packageId !== readiness.packageId) errors.push("White-label release package evidence must match the readiness package.");
    if (!["blocked", "review-only"].includes(readString(packageEvidence, "status"))) errors.push("White-label release package evidence status is unsupported.");
    for (const field of ["totalLaneCount", "readyPreviewLaneCount", "unresolvedLaneCount"] as const) {
      if (!Number.isInteger(packageEvidence[field]) || Number(packageEvidence[field]) < 0) errors.push(`White-label release package evidence ${field} must be a non-negative integer.`);
    }
    const unresolvedLaneIds = readStringArray(packageEvidence, "unresolvedLaneIds");
    if (Number(packageEvidence.unresolvedLaneCount) !== unresolvedLaneIds.length) errors.push("White-label release package evidence unresolved lane count must match its ids.");
    if (Number(packageEvidence.totalLaneCount) !== Number(packageEvidence.readyPreviewLaneCount) + Number(packageEvidence.unresolvedLaneCount)) errors.push("White-label release package evidence lane counts must reconcile to the total.");
    if (readString(packageEvidence, "status") === "blocked" && Number(packageEvidence.unresolvedLaneCount) === 0) errors.push("Blocked white-label release package evidence must list unresolved lanes.");
    if (status === "pilot-ready" && Number(packageEvidence.unresolvedLaneCount) > 0) errors.push("White-label release readiness cannot be pilot-ready while package evidence has unresolved lanes.");
    if (status === "pilot-ready" && readString(packageEvidence, "status") !== "review-only") errors.push("Pilot-ready white-label release readiness requires review-only package evidence.");
    if (packageEvidence.promotionAllowed !== false) errors.push("White-label release package evidence promotion must remain false.");
    if (packageEvidence.studentFacingActivationAllowed !== false) errors.push("White-label release package evidence student activation must remain false.");
    if (!/^sha256:[0-9a-f]{64}$/i.test(readString(packageEvidence, "sourceAssemblyChecksum"))) errors.push("White-label release package evidence checksum must use sha256:<64 hexadecimal characters> format.");
  }

  const pilotEvidence = readiness.pilotEvidence;
  if (!isRecord(pilotEvidence)) {
    errors.push("White-label release readiness pilotEvidence must be an object.");
  } else {
    for (const field of ["decisionId", "tenantId", "packageId", "handoffRouteKey", "evidenceHandoffRouteKey"] as const) {
      if (!isNonEmptyString(pilotEvidence[field])) errors.push(`White-label release pilot evidence ${field} must be non-empty.`);
    }
    if (pilotEvidence.tenantId !== readiness.tenantId) errors.push("White-label release pilot evidence must match the readiness tenant.");
    if (pilotEvidence.packageId !== readiness.packageId) errors.push("White-label release pilot evidence must match the readiness package.");
    if (!["demo-ready-pilot-blocked", "pilot-ready"].includes(readString(pilotEvidence, "status"))) errors.push("White-label release pilot evidence status is unsupported.");
    const rawBlockingReasons = pilotEvidence.blockingReasons;
    const blockingReasons = readStringArray(pilotEvidence, "blockingReasons");
    if (!Array.isArray(rawBlockingReasons) || rawBlockingReasons.some((reason) => typeof reason !== "string" || reason.trim().length === 0)) {
      errors.push("White-label release pilot evidence blockers must contain only non-empty strings.");
    }
    if (new Set(blockingReasons).size !== blockingReasons.length) errors.push("White-label release pilot evidence blockers must be unique.");
    if (Number(pilotEvidence.blockingReasonCount) !== blockingReasons.length) errors.push("White-label release pilot evidence blocker count must match its reasons.");
    if (readString(pilotEvidence, "status") === "demo-ready-pilot-blocked" && blockingReasons.length === 0) errors.push("Blocked white-label release pilot evidence must list blockers.");
    if (status === "pilot-ready" && readString(pilotEvidence, "status") !== "pilot-ready") errors.push("Pilot-ready white-label release readiness requires pilot-ready pilot evidence.");
    if (status === "pilot-ready" && blockingReasons.length > 0) errors.push("Pilot-ready white-label release readiness cannot contain pilot blockers.");
    const evidenceBindings = readStringArray(pilotEvidence, "evidenceBindings");
    if (evidenceBindings.length === 0) {
      errors.push("White-label release pilot evidence must include evidence bindings.");
    } else {
      const rawEvidenceBindings = pilotEvidence.evidenceBindings;
      if (!Array.isArray(rawEvidenceBindings) || rawEvidenceBindings.some((binding) => typeof binding !== "string" || binding.trim().length === 0)) {
        errors.push("White-label release pilot evidence bindings must contain only non-empty strings.");
      }
      if (new Set(evidenceBindings).size !== evidenceBindings.length) errors.push("White-label release pilot evidence bindings must be unique.");
    }
    for (const field of ["pilotLaunchAllowed", "studentDataCollectionAllowed", "reportExportAllowed"] as const) {
      if (pilotEvidence[field] !== false) errors.push(`White-label release pilot evidence ${field} must remain false.`);
    }
  }

  const releaseControlEvidence = readiness.releaseControlEvidence;
  if (!isRecord(releaseControlEvidence)) {
    errors.push("White-label release readiness releaseControlEvidence must be an object.");
  } else {
    for (const field of ["releaseGateId", "approvalLedgerId", "tenantId", "releaseCandidate", "packageId"] as const) {
      if (!isNonEmptyString(releaseControlEvidence[field])) errors.push(`White-label release control evidence ${field} must be non-empty.`);
    }
    if (releaseControlEvidence.tenantId !== readiness.tenantId) errors.push("White-label release control evidence must match the readiness tenant.");
    if (releaseControlEvidence.packageId !== readiness.packageId) errors.push("White-label release control evidence must match the readiness package.");
    if (!["blocked", "review-only", "pilot-ready"].includes(readString(releaseControlEvidence, "status"))) {
      errors.push("White-label release control evidence status is unsupported.");
    }
    for (const field of ["blockingGateCount", "requiredApprovalCount", "openApprovalCount"] as const) {
      if (!Number.isInteger(releaseControlEvidence[field]) || Number(releaseControlEvidence[field]) < 0) {
        errors.push(`White-label release control evidence ${field} must be a non-negative integer.`);
      }
    }
    if (Number(releaseControlEvidence.openApprovalCount) > Number(releaseControlEvidence.requiredApprovalCount)) {
      errors.push("White-label release control evidence open approvals cannot exceed required approvals.");
    }
    if (readStringArray(releaseControlEvidence, "sourceRecords").length < 2) {
      errors.push("White-label release control evidence must include at least two source records.");
    }
    if (releaseControlEvidence.promotionAllowed !== false) errors.push("White-label release control evidence promotion must remain false.");
    if (releaseControlEvidence.studentFacingActivationAllowed !== false) errors.push("White-label release control evidence student activation must remain false.");
    const controlStatus = readString(releaseControlEvidence, "status");
    const hasOpenControls = Number(releaseControlEvidence.blockingGateCount) > 0 || Number(releaseControlEvidence.openApprovalCount) > 0;
    if (controlStatus === "pilot-ready" && hasOpenControls) errors.push("Pilot-ready release control evidence cannot contain open gates or approvals.");
    if (controlStatus !== "pilot-ready" && !hasOpenControls) errors.push("Non-pilot-ready release control evidence must expose an open gate or approval.");
    if (status === "pilot-ready" && controlStatus !== "pilot-ready") errors.push("Pilot-ready readiness requires pilot-ready release control evidence.");
  }

  const routeEvidence = readiness.routeEvidence;
  if (!isRecord(routeEvidence)) {
    errors.push("White-label release readiness routeEvidence must be an object.");
  } else {
    for (const field of ["tenantId", "packageId"] as const) {
      if (!isNonEmptyString(routeEvidence[field])) errors.push(`White-label release route evidence ${field} must be non-empty.`);
    }
    if (routeEvidence.tenantId !== readiness.tenantId) errors.push("White-label release route evidence must match the readiness tenant.");
    if (routeEvidence.packageId !== readiness.packageId) errors.push("White-label release route evidence must match the readiness package.");
    for (const field of ["routeMatrixSource", "activeRouteVerifierSource", "deploymentGuideId"] as const) {
      if (!isNonEmptyString(routeEvidence[field])) errors.push(`White-label release route evidence ${field} must be non-empty.`);
    }
    for (const field of ["activeRouteCount", "expectedActiveRouteCount"] as const) {
      if (!Number.isInteger(routeEvidence[field]) || Number(routeEvidence[field]) < 1) {
        errors.push(`White-label release route evidence ${field} must be a positive integer.`);
      }
    }
    if (Number(routeEvidence.activeRouteCount) !== Number(routeEvidence.expectedActiveRouteCount)) {
      errors.push("White-label release route evidence counts must reconcile.");
    }
    if (readString(routeEvidence, "deploymentStatus") !== "review-only") {
      errors.push("White-label release route evidence deployment status must remain review-only.");
    }
    if (readStringArray(routeEvidence, "sourceRecords").length < 2) {
      errors.push("White-label release route evidence must include at least two source records.");
    }
  }

    if (readiness.productionApprovalAllowed !== false) errors.push("White-label release readiness production approval must remain false.");
  if (readiness.studentProductionLaunchAllowed !== false) errors.push("White-label release readiness student production launch must remain false.");
  const blockedActions = readStringArray(readiness, "blockedActions");
  for (const action of WHITE_LABEL_RELEASE_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) errors.push(`White-label release readiness must block: ${action}.`);
  }
  return [...new Set(errors)];
}

export function validateWhiteLabelReleaseReadinessFreshness(
  readiness: unknown,
  now: string,
  maxAgeMs = WHITE_LABEL_RELEASE_EVIDENCE_FRESHNESS_WINDOW_MS,
): string[] {
  const errors: string[] = [];
  if (!isIsoTimestamp(now)) return ["White-label release readiness freshness now must be an ISO timestamp."];
  if (!Number.isFinite(maxAgeMs) || maxAgeMs < 0) return ["White-label release readiness freshness window must be a non-negative finite number."];
  if (!isRecord(readiness) || !Array.isArray(readiness.qualityEvidence)) return ["White-label release readiness freshness requires quality evidence records."];

  const nowMs = Date.parse(now);
  for (const evidence of readiness.qualityEvidence) {
    if (!isRecord(evidence)) continue;
    const checkId = readString(evidence, "checkId") || "(unknown)";
    const observedAt = evidence.observedAt;
    if (!isIsoTimestamp(observedAt)) continue;
    const observedAtMs = Date.parse(observedAt);
    if (observedAtMs > nowMs) {
      errors.push(`White-label release quality evidence ${checkId} observedAt cannot be in the future.`);
    } else if (nowMs - observedAtMs > maxAgeMs) {
      errors.push(`White-label release quality evidence ${checkId} is stale for the configured freshness period.`);
    }
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

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.includes("T") && !Number.isNaN(Date.parse(value));
}
