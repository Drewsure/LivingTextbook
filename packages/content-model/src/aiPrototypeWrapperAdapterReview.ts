export type AiPrototypeWrapperAdapterReviewStatus = "not-started" | "review-only" | "blocked";

export interface AiPrototypeModeWrapperAdapterReview<ModeId extends string = string> {
  modeId: ModeId;
  parentEngine: string;
  proposedSurface: string;
  adapterEntryPoint: string;
  fixtureInputContract: string[];
  standardEventOutputContract: string[];
  stateOwnershipRules: string[];
  wrapperEvidence: string[];
  rejectionTriggers: string[];
}

export interface AiPrototypeWrapperAdapterReview<ModeId extends string = string> {
  reviewId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeWrapperAdapterReviewStatus;
  summary: string;
  sourceRecords: string[];
  parentEngineAdapterBoundary: string[];
  wrapperAcceptanceChecks: string[];
  blockedActions: string[];
  modeReviews: AiPrototypeModeWrapperAdapterReview<ModeId>[];
}

export const AI_PROTOTYPE_WRAPPER_REQUIRED_SOURCE_RECORDS = [
  "prototype_wrapper_adapter_review",
  "ai_prototype_integration_plan",
  "ai_prototype_return_review",
  "standard_event_contract",
  "audio_cue_manifest",
  "game_scoring_profile_snapshot",
] as const;

export const AI_PROTOTYPE_WRAPPER_REQUIRED_BOUNDARY_RULES = [
  "Prototype receives reviewed unit JSON as input.",
  "Prototype reports events through the standard_event_contract adapter.",
  "Prototype requests learning audio through the shared audio cue manifest.",
  "Prototype reads tenant theme, mascot, avatar, and media through injected config.",
  "Prototype owns only transient local interaction state.",
  "Parent engine owns route, scoring, mastery, progress, rewards, and assignment effects.",
] as const;

export const AI_PROTOTYPE_WRAPPER_REQUIRED_ACCEPTANCE_CHECKS = [
  "Fixture input contract is explicit and does not require hard-coded unit text.",
  "Standard event output contract covers start, round, audio, answer, result, mastery, and completion events.",
  "No event contract bypass exists.",
  "No tenant hard-coding exists.",
  "No hidden control text or unreadable button state exists.",
  "Wrapper can be removed without breaking route contracts.",
] as const;

export const AI_PROTOTYPE_WRAPPER_REQUIRED_BLOCKED_ACTIONS = [
  "No direct app import",
  "No route registry write",
  "No event contract bypass",
  "No scoring profile mutation",
  "No audio manifest mutation",
  "No tenant hard-coding",
  "No package promotion",
  "No student assignment",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_WRAPPER_REQUIRED_FIXTURE_FIELDS = [
  "unit_meta",
  "pedagogical_payload",
  "audio_cues",
  "game_mode_config",
  "scoring_profile",
  "blocked_actions",
] as const;

export const AI_PROTOTYPE_WRAPPER_REQUIRED_EVENTS = [
  "game_started",
  "round_shown",
  "audio_requested",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
] as const;

export const AI_PROTOTYPE_WRAPPER_REQUIRED_STATE_RULES = [
  "Wrapper may own current selection, animation state, and temporary drag state.",
  "Wrapper may not own route state.",
  "Wrapper may not own score authority.",
  "Wrapper may not own audio manifest authority.",
  "Wrapper may not own assignment or learner identity.",
  "Wrapper may not own reward inventory writes.",
] as const;

export const AI_PROTOTYPE_WRAPPER_REQUIRED_EVIDENCE = [
  "Fixture parse smoke test",
  "Event emission sample",
  "Audio request sample",
  "Scoring replay compatibility note",
  "Mobile visible-control screenshot note",
  "Tenant theme injection note",
] as const;

export const AI_PROTOTYPE_WRAPPER_REQUIRED_REJECTION_TRIGGERS = [
  "Hard-coded vocabulary, sentence, tenant, mascot, or media.",
  "Custom event names without adapter mapping.",
  "Direct score or reward writes.",
  "Support-language progress trigger.",
  "Route or assignment side effect.",
  "Unreadable text or hidden button labels.",
] as const;

export function validateAiPrototypeWrapperAdapterReview(review: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(review)) {
    return ["AI prototype wrapper adapter review must be a JSON object."];
  }

  const reviewId = readString(review, "reviewId");
  const tenantId = readString(review, "tenantId");
  const requestId = readString(review, "requestId");
  const integrationPlanId = readString(review, "integrationPlanId");
  const label = readString(review, "label");
  const status = readString(review, "status");
  const summary = readString(review, "summary");
  const sourceRecords = readStringArray(review, "sourceRecords");
  const parentEngineAdapterBoundary = readStringArray(review, "parentEngineAdapterBoundary");
  const wrapperAcceptanceChecks = readStringArray(review, "wrapperAcceptanceChecks");
  const blockedActions = readStringArray(review, "blockedActions");
  const modeReviews = readModeWrapperReviews(review);

  if (!reviewId || !tenantId || !requestId || !integrationPlanId) {
    errors.push("AI prototype wrapper adapter review must include reviewId, tenantId, requestId, and integrationPlanId.");
  }

  if (!label.includes("prototype wrapper adapter review")) {
    errors.push("AI prototype wrapper adapter review label must name the wrapper adapter review.");
  }

  if (status !== "not-started" && status !== "review-only" && status !== "blocked") {
    errors.push("AI prototype wrapper adapter review must use a supported review-only status.");
  }

  if (!summary.includes("Review-only adapter checklist")) {
    errors.push("AI prototype wrapper adapter review summary must keep wrapper review review-only.");
  }

  for (const sourceRecord of AI_PROTOTYPE_WRAPPER_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype wrapper adapter review must include source record: ${sourceRecord}.`);
    }
  }

  for (const boundaryRule of AI_PROTOTYPE_WRAPPER_REQUIRED_BOUNDARY_RULES) {
    if (!parentEngineAdapterBoundary.includes(boundaryRule)) {
      errors.push(`AI prototype wrapper adapter review must include boundary rule: ${boundaryRule}.`);
    }
  }

  for (const acceptanceCheck of AI_PROTOTYPE_WRAPPER_REQUIRED_ACCEPTANCE_CHECKS) {
    if (!wrapperAcceptanceChecks.includes(acceptanceCheck)) {
      errors.push(`AI prototype wrapper adapter review must include acceptance check: ${acceptanceCheck}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_WRAPPER_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype wrapper adapter review must block action: ${blockedAction}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language scoring or release")) {
    errors.push("MiniStar AI prototype wrapper adapter review must block Japanese support-language scoring or release.");
  }

  if (modeReviews.length === 0) {
    errors.push("AI prototype wrapper adapter review must include mode wrapper reviews.");
  }

  for (const modeReview of modeReviews) {
    validateModeWrapperReview(modeReview, tenantId, errors);
  }

  return errors;
}

export function getAiPrototypeWrapperAdapterReviewWarnings(review: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(review)) {
    return warnings;
  }

  const modeReviews = readModeWrapperReviews(review);

  if (!modeReviews.some((modeReview) => modeReview.proposedSurface.includes("Phaser"))) {
    warnings.push("AI prototype wrapper adapter review has no Phaser wrapper candidate to inspect.");
  }

  if (!modeReviews.every((modeReview) => modeReview.adapterEntryPoint.includes("without writing platform state"))) {
    warnings.push("Every wrapper adapter entry point should explicitly block platform state writes.");
  }

  return warnings;
}

export function validateAiPrototypeWrapperAdapterReviews(reviews: unknown[]): string[] {
  return reviews.flatMap((review) => validateAiPrototypeWrapperAdapterReview(review));
}

export function getAiPrototypeWrapperAdapterReviewCollectionWarnings(reviews: unknown[]): string[] {
  return reviews.flatMap((review) => getAiPrototypeWrapperAdapterReviewWarnings(review));
}

function validateModeWrapperReview(review: AiPrototypeModeWrapperAdapterReview, tenantId: string, errors: string[]) {
  if (!review.modeId || !review.parentEngine || !review.proposedSurface || !review.adapterEntryPoint) {
    errors.push("AI prototype mode wrapper adapter review must include modeId, parentEngine, proposedSurface, and adapterEntryPoint.");
  }

  if (!review.adapterEntryPoint.includes("reviewed fixture") || !review.adapterEntryPoint.includes("standard events")) {
    errors.push("AI prototype mode wrapper adapter review must accept reviewed fixtures and emit standard events.");
  }

  for (const fixtureField of AI_PROTOTYPE_WRAPPER_REQUIRED_FIXTURE_FIELDS) {
    if (!review.fixtureInputContract.includes(fixtureField)) {
      errors.push(`AI prototype mode wrapper adapter review must include fixture field: ${fixtureField}.`);
    }
  }

  for (const eventName of AI_PROTOTYPE_WRAPPER_REQUIRED_EVENTS) {
    if (!review.standardEventOutputContract.includes(eventName)) {
      errors.push(`AI prototype mode wrapper adapter review must include standard event: ${eventName}.`);
    }
  }

  for (const stateRule of AI_PROTOTYPE_WRAPPER_REQUIRED_STATE_RULES) {
    if (!review.stateOwnershipRules.includes(stateRule)) {
      errors.push(`AI prototype mode wrapper adapter review must include state ownership rule: ${stateRule}.`);
    }
  }

  for (const evidence of AI_PROTOTYPE_WRAPPER_REQUIRED_EVIDENCE) {
    if (!review.wrapperEvidence.includes(evidence)) {
      errors.push(`AI prototype mode wrapper adapter review must include wrapper evidence: ${evidence}.`);
    }
  }

  for (const rejectionTrigger of AI_PROTOTYPE_WRAPPER_REQUIRED_REJECTION_TRIGGERS) {
    if (!review.rejectionTriggers.includes(rejectionTrigger)) {
      errors.push(`AI prototype mode wrapper adapter review must include rejection trigger: ${rejectionTrigger}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(review.wrapperEvidence, "Hiragana-only support-language note")) {
    errors.push("MiniStar AI prototype mode wrapper adapter review must preserve hiragana-only support-language evidence.");
  }
}

function readModeWrapperReviews(source: Record<string, unknown>): AiPrototypeModeWrapperAdapterReview[] {
  const value = source.modeReviews;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((modeReview) => ({
    modeId: readString(modeReview, "modeId"),
    parentEngine: readString(modeReview, "parentEngine"),
    proposedSurface: readString(modeReview, "proposedSurface"),
    adapterEntryPoint: readString(modeReview, "adapterEntryPoint"),
    fixtureInputContract: readStringArray(modeReview, "fixtureInputContract"),
    standardEventOutputContract: readStringArray(modeReview, "standardEventOutputContract"),
    stateOwnershipRules: readStringArray(modeReview, "stateOwnershipRules"),
    wrapperEvidence: readStringArray(modeReview, "wrapperEvidence"),
    rejectionTriggers: readStringArray(modeReview, "rejectionTriggers"),
  }));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
