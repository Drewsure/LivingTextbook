import type { ProgressEventEnvelope, ProgressEventTaxonomyRegistry } from "./progressEventTaxonomy";
import { validateProgressEventEnvelope } from "./progressEventTaxonomy";
import { UNIT_STAR_DUST_CAP } from "./economyPolicy";
import { getGameModeContract } from "./index";

export type ProgressionRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";

export interface ProgressionRuntimeRequest {
  tenantId: string;
  packageId: string;
  sessionId: string;
  mode: ProgressionRuntimeMode;
  envelope: unknown;
  registry: ProgressEventTaxonomyRegistry;
  progressionPolicyAccepted: boolean;
  persistenceReady: boolean;
  reportRuntimeReady: boolean;
  rewardPolicyReady: boolean;
  targetLanguageEvidence: boolean;
}

export interface ProgressionRuntimeDecision {
  allowed: boolean;
  mode: ProgressionRuntimeMode;
  reasonCode: string;
  reasons: string[];
  eventEffect: "progress-affecting" | "report-only" | "support-only" | "unknown";
}

export interface ProgressionRuntimeResult {
  request: ProgressionRuntimeRequest;
  decision: ProgressionRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface ProgressionRuntimeAdapter {
  readonly mode: ProgressionRuntimeMode;
  evaluate(request: ProgressionRuntimeRequest): ProgressionRuntimeDecision;
  execute(request: ProgressionRuntimeRequest): ProgressionRuntimeResult;
}

export type ProgressionContinuityMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";

export interface ProgressionContinuitySnapshot {
  tenantId: string;
  studentSessionId: string;
  launchCode: string;
  unitKey: string;
  entryMode: string;
  currentStep: "entry-practice" | "recommended-game" | "training-academy" | "completion-review";
  unlockedGameModes: string[];
  completedGameModes: string[];
  earnedStarDust: number;
  masteryStatus: "not-started" | "in-progress" | "mastered" | "needs-review";
  lastEventAt?: string;
}

export interface ProgressionContinuityEnvelope {
  continuityId: string;
  tenantId: string;
  packageId: string;
  launchCode: string;
  studentSessionId: string;
  unitKey: string;
  sourceRoute: string;
  destinationRoute: string;
  issuedAt: string;
  eventCursor: number;
  mode: ProgressionContinuityMode;
  snapshot: ProgressionContinuitySnapshot;
  rawLearnerAudioIncluded: boolean;
  learnerTranscriptIncluded: boolean;
  supportLanguageEvidenceIncluded: boolean;
  mediaOnlyEvidenceIncluded: boolean;
}

export interface ProgressionContinuityRuntimeRequest {
  expectedTenantId: string;
  expectedPackageId: string;
  expectedLaunchCode: string;
  expectedStudentSessionId: string;
  envelope: unknown;
}

export interface ProgressionContinuityRuntimeDecision {
  allowed: boolean;
  mode: ProgressionContinuityMode;
  reasonCode: string;
  reasons: string[];
}

export interface ProgressionContinuityRuntimeResult {
  request: ProgressionContinuityRuntimeRequest;
  decision: ProgressionContinuityRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface ProgressionContinuityRuntimeAdapter {
  readonly mode: ProgressionContinuityMode;
  evaluate(request: ProgressionContinuityRuntimeRequest): ProgressionContinuityRuntimeDecision;
  execute(request: ProgressionContinuityRuntimeRequest): ProgressionContinuityRuntimeResult;
}

export const reviewOnlyProgressionContinuityBlockedActions = [
  "No progression snapshot write",
  "No learner session persistence",
  "No URL-encoded progression state",
  "No cross-tenant progression reuse",
  "No support-language or media-only unlock",
] as const;

export function createProgressionContinuityEnvelope(args: {
  continuityId: string;
  packageId: string;
  launchSession: {
    tenantId: string;
    launchCode: string;
    unitKey: string;
    entryMode: string;
  };
  progression: {
    studentSessionId: string;
    currentStep: ProgressionContinuitySnapshot["currentStep"];
    unlockedGameModes: string[];
    completedGameModes: string[];
    earnedStarDust: number;
    masteryStatus: ProgressionContinuitySnapshot["masteryStatus"];
    lastEventAt?: string;
  };
  sourceRoute: string;
  destinationRoute: string;
  issuedAt: string;
  eventCursor: number;
}): ProgressionContinuityEnvelope {
  return {
    continuityId: args.continuityId,
    tenantId: args.launchSession.tenantId,
    packageId: args.packageId,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    unitKey: args.launchSession.unitKey,
    sourceRoute: args.sourceRoute,
    destinationRoute: args.destinationRoute,
    issuedAt: args.issuedAt,
    eventCursor: args.eventCursor,
    mode: "review-only",
    snapshot: {
      tenantId: args.launchSession.tenantId,
      studentSessionId: args.progression.studentSessionId,
      launchCode: args.launchSession.launchCode,
      unitKey: args.launchSession.unitKey,
      entryMode: args.launchSession.entryMode,
      currentStep: args.progression.currentStep,
      unlockedGameModes: [...args.progression.unlockedGameModes],
      completedGameModes: [...args.progression.completedGameModes],
      earnedStarDust: args.progression.earnedStarDust,
      masteryStatus: args.progression.masteryStatus,
      lastEventAt: args.progression.lastEventAt,
    },
    rawLearnerAudioIncluded: false,
    learnerTranscriptIncluded: false,
    supportLanguageEvidenceIncluded: false,
    mediaOnlyEvidenceIncluded: false,
  };
}

export function validateProgressionContinuityEnvelope(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Progression continuity envelope must be an object."];

  for (const field of [
    "continuityId",
    "tenantId",
    "packageId",
    "launchCode",
    "studentSessionId",
    "unitKey",
    "sourceRoute",
    "destinationRoute",
    "issuedAt",
    "mode",
    "snapshot",
  ]) {
    if (typeof value[field] !== "string" && field !== "snapshot") errors.push(`Progression continuity ${field} is required.`);
  }

  for (const field of [
    "rawLearnerAudioIncluded",
    "learnerTranscriptIncluded",
    "supportLanguageEvidenceIncluded",
    "mediaOnlyEvidenceIncluded",
  ] as const) {
    if (typeof value[field] !== "boolean") errors.push(`Progression continuity ${field} must be a boolean.`);
    if (value[field] === true) errors.push(`Progression continuity ${field} must remain false.`);
  }

  const envelope = value as Record<string, unknown>;
  for (const field of ["continuityId", "tenantId", "packageId", "launchCode", "studentSessionId", "unitKey", "sourceRoute", "destinationRoute", "issuedAt", "mode"]) {
    if (typeof envelope[field] === "string" && envelope[field].trim().length === 0) errors.push(`Progression continuity ${field} cannot be blank.`);
  }
  if (typeof envelope.sourceRoute === "string" && !envelope.sourceRoute.startsWith("/")) errors.push("Progression continuity sourceRoute must be an app-relative path.");
  if (typeof envelope.destinationRoute === "string" && !envelope.destinationRoute.startsWith("/")) errors.push("Progression continuity destinationRoute must be an app-relative path.");
  if (!isIsoTimestamp(envelope.issuedAt)) errors.push("Progression continuity issuedAt must be an ISO timestamp.");
  if (!Number.isSafeInteger(envelope.eventCursor) || Number(envelope.eventCursor) < 0) errors.push("Progression continuity eventCursor must be a non-negative integer.");
  if (!["review-only", "hosted-managed", "local-classroom", "hybrid"].includes(String(envelope.mode))) errors.push("Progression continuity mode is unsupported.");

  const snapshotErrors = validateProgressionContinuitySnapshot(envelope.snapshot);
  errors.push(...snapshotErrors);
  if (isRecord(envelope.snapshot)) {
    for (const field of ["tenantId", "launchCode", "studentSessionId", "unitKey"] as const) {
      if (envelope.snapshot[field] !== envelope[field]) errors.push(`Progression continuity snapshot ${field} must match the envelope.`);
    }
  }
  return [...new Set(errors)];
}

export function validateProgressionContinuityRuntimeRequest(request: ProgressionContinuityRuntimeRequest): string[] {
  const errors = validateProgressionContinuityEnvelope(request.envelope);
  for (const field of ["expectedTenantId", "expectedPackageId", "expectedLaunchCode", "expectedStudentSessionId"] as const) {
    if (typeof request[field] !== "string" || request[field].trim().length === 0) errors.push(`${field} is required.`);
  }
  if (isRecord(request.envelope)) {
    const envelope = request.envelope;
    if (envelope.tenantId !== request.expectedTenantId) errors.push("Progression continuity tenant must match the expected tenant.");
    if (envelope.packageId !== request.expectedPackageId) errors.push("Progression continuity package must match the expected package.");
    if (envelope.launchCode !== request.expectedLaunchCode) errors.push("Progression continuity launch code must match the expected launch.");
    if (envelope.studentSessionId !== request.expectedStudentSessionId) errors.push("Progression continuity student session must match the expected session.");
  }
  return [...new Set(errors)];
}

export function createReviewOnlyProgressionContinuityAdapter(): ProgressionContinuityRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateProgressionContinuityRuntimeRequest(request);
      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-progression-continuity" : "review-only-progression-continuity",
        reasons: [...new Set([...validationErrors, ...reviewOnlyProgressionContinuityBlockedActions, "No continuity adapter has been selected for live use"])],
      };
    },
    execute(request) {
      return { request, decision: this.evaluate(request), sideEffect: "none" };
    },
  };
}

function validateProgressionContinuitySnapshot(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["Progression continuity snapshot must be an object."];
  for (const field of ["tenantId", "studentSessionId", "launchCode", "unitKey", "entryMode", "currentStep", "masteryStatus"]) {
    if (typeof value[field] !== "string" || value[field].trim().length === 0) errors.push(`Progression continuity snapshot ${field} is required.`);
  }
  for (const field of ["unlockedGameModes", "completedGameModes"]) {
    if (!Array.isArray(value[field])) errors.push(`Progression continuity snapshot ${field} must be an array.`);
  }
  if (!Number.isSafeInteger(value.earnedStarDust) || Number(value.earnedStarDust) < 0 || Number(value.earnedStarDust) > 1000) {
    errors.push(`Progression continuity snapshot earnedStarDust must be an integer from 0 to ${UNIT_STAR_DUST_CAP}.`);
  }
  if (value.lastEventAt !== undefined && !isIsoTimestamp(value.lastEventAt)) errors.push("Progression continuity snapshot lastEventAt must be an ISO timestamp.");
  const unlocked = stringArray(value.unlockedGameModes);
  const completed = stringArray(value.completedGameModes);
  const uniqueUnlocked = new Set(unlocked);
  if (uniqueUnlocked.size !== unlocked.length) errors.push("Progression continuity snapshot unlockedGameModes must be unique.");
  if (new Set(completed).size !== completed.length) errors.push("Progression continuity snapshot completedGameModes must be unique.");
  for (const mode of [...unlocked, ...completed]) if (!getGameModeContract(mode)) errors.push(`Progression continuity snapshot uses unsupported game mode ${mode}.`);
  if (typeof value.entryMode === "string" && !unlocked.includes(value.entryMode)) errors.push("Progression continuity snapshot entryMode must be unlocked.");
  if (completed.some((mode) => !uniqueUnlocked.has(mode))) errors.push("Progression continuity snapshot completedGameModes must be unlocked.");
  if (!["entry-practice", "recommended-game", "training-academy", "completion-review"].includes(String(value.currentStep))) errors.push("Progression continuity snapshot currentStep is unsupported.");
  if (!["not-started", "in-progress", "mastered", "needs-review"].includes(String(value.masteryStatus))) errors.push("Progression continuity snapshot masteryStatus is unsupported.");
  return [...new Set(errors)];
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) && value.includes("T");
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const reviewOnlyProgressionBlockedActions = [
  "No mastery mutation",
  "No score mutation",
  "No Star Dust or reward mutation",
  "No game unlock mutation",
  "No support-language progress trigger",
  "No media-only progress trigger",
  "No learner progress persistence",
] as const;

export function validateProgressionRuntimeRequest(request: ProgressionRuntimeRequest): string[] {
  const errors: string[] = [];

  for (const field of [
    "progressionPolicyAccepted",
    "persistenceReady",
    "reportRuntimeReady",
    "rewardPolicyReady",
    "targetLanguageEvidence",
  ] as const) {
    if (typeof request[field] !== "boolean") errors.push(`${field} must be a boolean`);
  }

  const progressionPolicyAccepted = request.progressionPolicyAccepted === true;
  const persistenceReady = request.persistenceReady === true;
  const reportRuntimeReady = request.reportRuntimeReady === true;
  const rewardPolicyReady = request.rewardPolicyReady === true;
  const targetLanguageEvidence = request.targetLanguageEvidence === true;

  if (typeof request.tenantId !== "string" || request.tenantId.trim().length === 0) errors.push("tenantId is required");
  if (typeof request.packageId !== "string" || request.packageId.trim().length === 0) errors.push("packageId is required");
  if (typeof request.sessionId !== "string" || request.sessionId.trim().length === 0) errors.push("sessionId is required");
  if (!progressionPolicyAccepted) errors.push("progression policy acceptance is required");
  if (!persistenceReady) errors.push("progress persistence readiness is required");
  if (!reportRuntimeReady) errors.push("report runtime readiness is required");
  if (!rewardPolicyReady) errors.push("deterministic reward policy readiness is required");

  const event = isProgressEventEnvelope(request.envelope) ? request.envelope : undefined;
  const eventEffect = event?.event_effect;
  if (!event) {
    errors.push("progress event envelope is required");
  } else {
    errors.push(...validateProgressEventEnvelope(event, request.registry));
  }

  if (eventEffect === "progress-affecting" && !targetLanguageEvidence) {
    errors.push("target-language evidence is required for progress-affecting events");
  }
  if (eventEffect === "support-only") {
    errors.push("support-only events cannot enter the progression authority");
  }
  if (eventEffect === "report-only") {
    errors.push("report-only events cannot enter the progression authority");
  }

  return [...new Set(errors)];
}

export function createReviewOnlyProgressionRuntimeAdapter(): ProgressionRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateProgressionRuntimeRequest(request);
      const eventEffect = isProgressEventEnvelope(request.envelope) ? request.envelope.event_effect : "unknown";
      const reasons = [
        ...validationErrors,
        ...reviewOnlyProgressionBlockedActions,
        "No progression runtime adapter has been selected for live use",
      ];
      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-progression-runtime-request" : "review-only-progression-runtime",
        reasons: [...new Set(reasons)],
        eventEffect,
      };
    },
    execute(request) {
      return { request, decision: this.evaluate(request), sideEffect: "none" };
    },
  };
}

function isProgressEventEnvelope(value: unknown): value is ProgressEventEnvelope {
  return typeof value === "object" && value !== null && "event_effect" in value;
}
