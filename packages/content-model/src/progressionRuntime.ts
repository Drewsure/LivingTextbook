import type { ProgressEventEnvelope, ProgressEventTaxonomyRegistry } from "./progressEventTaxonomy";
import { validateProgressEventEnvelope } from "./progressEventTaxonomy";

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

  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (!request.sessionId.trim()) errors.push("sessionId is required");
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
