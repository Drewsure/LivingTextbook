export type AiPrototypeIntegrationPlanStatus = "needs-return-review" | "wrapper-review-only" | "blocked";

export interface AiPrototypeModeIntegrationPlan<ModeId extends string = string> {
  modeId: ModeId;
  parentEngine: string;
  proposedSurface: string;
  adapterBoundary: string;
  integrationSequence: string[];
  requiredTests: string[];
  acceptanceEvidence: string[];
  blockedShortcuts: string[];
}

export interface AiPrototypeIntegrationPlan<ModeId extends string = string> {
  planId: string;
  tenantId: string;
  requestId: string;
  returnReviewId: string;
  label: string;
  status: AiPrototypeIntegrationPlanStatus;
  summary: string;
  sourceRecords: string[];
  integrationLanes: string[];
  testHarnessRequirements: string[];
  blockedActions: string[];
  nextReviewRecords: string[];
  modePlans: AiPrototypeModeIntegrationPlan<ModeId>[];
}

export const AI_PROTOTYPE_INTEGRATION_REQUIRED_SOURCE_RECORDS = [
  "ai_prototype_return_review",
  "ai_generated_game_build_brief",
  "standard_event_contract",
  "audio_cue_manifest",
  "game_scoring_profile_snapshot",
  "activity_compatibility_snapshot",
  "package_game_audio_coverage",
] as const;

export const AI_PROTOTYPE_INTEGRATION_REQUIRED_LANES = [
  "Quarantine returned files outside apps/web",
  "Create wrapper adapter proposal",
  "Run fixture conformance replay",
  "Run standard event replay",
  "Run target-language audio cue coverage",
  "Run deterministic scoring replay",
  "Run mobile and accessibility inspection",
  "Write Codex integration review decision",
] as const;

export const AI_PROTOTYPE_INTEGRATION_REQUIRED_TESTS = [
  "JSON fixture replay",
  "Standard event log replay",
  "Tap-to-speak coverage snapshot",
  "Scoring profile snapshot comparison",
  "Mobile viewport smoke evidence",
  "White-label theme injection check",
] as const;

export const AI_PROTOTYPE_INTEGRATION_REQUIRED_BLOCKED_ACTIONS = [
  "No direct import into apps/web",
  "No route registry write",
  "No game sequence mutation",
  "No scoring profile mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No student assignment",
] as const;

export const AI_PROTOTYPE_INTEGRATION_REQUIRED_NEXT_RECORDS = [
  "prototype_wrapper_adapter_review",
  "prototype_fixture_replay_report",
  "prototype_event_replay_report",
  "prototype_audio_coverage_report",
  "prototype_mobile_accessibility_report",
  "prototype_scoring_replay_report",
  "codex_integration_review_decision",
] as const;

export const AI_PROTOTYPE_INTEGRATION_REQUIRED_MODE_TESTS = [
  "Fixture parse test",
  "Event contract replay test",
  "Audio cue coverage test",
  "Scoring profile replay test",
  "Mobile viewport smoke test",
  "Tenant theme injection test",
] as const;

export const AI_PROTOTYPE_INTEGRATION_REQUIRED_ACCEPTANCE_EVIDENCE = [
  "All target-language text has tap-to-speak or replay support.",
  "Support language remains support-only.",
  "No random reward, gacha, or media-only mastery path exists.",
  "No hidden black button text or unreadable learner control exists.",
  "Prototype can be removed without breaking route contracts.",
] as const;

export const AI_PROTOTYPE_INTEGRATION_REQUIRED_BLOCKED_SHORTCUTS = [
  "Cannot bypass parent engine.",
  "Cannot mutate route registry.",
  "Cannot mutate scoring profile.",
  "Cannot mutate audio manifest.",
  "Cannot assign students.",
  "Cannot become package-ready from prototype evidence alone.",
] as const;

export function validateAiPrototypeIntegrationPlan(plan: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(plan)) {
    return ["AI prototype integration plan must be a JSON object."];
  }

  const planId = readString(plan, "planId");
  const tenantId = readString(plan, "tenantId");
  const requestId = readString(plan, "requestId");
  const returnReviewId = readString(plan, "returnReviewId");
  const label = readString(plan, "label");
  const status = readString(plan, "status");
  const summary = readString(plan, "summary");
  const sourceRecords = readStringArray(plan, "sourceRecords");
  const integrationLanes = readStringArray(plan, "integrationLanes");
  const testHarnessRequirements = readStringArray(plan, "testHarnessRequirements");
  const blockedActions = readStringArray(plan, "blockedActions");
  const nextReviewRecords = readStringArray(plan, "nextReviewRecords");
  const modePlans = readModeIntegrationPlans(plan);

  if (!planId || !tenantId || !requestId || !returnReviewId) {
    errors.push("AI prototype integration plan must include planId, tenantId, requestId, and returnReviewId.");
  }

  if (!label.includes("prototype integration plan")) {
    errors.push("AI prototype integration plan label must name the prototype integration plan.");
  }

  if (status !== "needs-return-review" && status !== "wrapper-review-only" && status !== "blocked") {
    errors.push("AI prototype integration plan must use a supported review-only status.");
  }

  if (!summary.includes("Review-only plan")) {
    errors.push("AI prototype integration plan summary must keep the plan review-only.");
  }

  for (const sourceRecord of AI_PROTOTYPE_INTEGRATION_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype integration plan must include source record: ${sourceRecord}.`);
    }
  }

  for (const lane of AI_PROTOTYPE_INTEGRATION_REQUIRED_LANES) {
    if (!integrationLanes.includes(lane)) {
      errors.push(`AI prototype integration plan must include integration lane: ${lane}.`);
    }
  }

  for (const test of AI_PROTOTYPE_INTEGRATION_REQUIRED_TESTS) {
    if (!testHarnessRequirements.includes(test)) {
      errors.push(`AI prototype integration plan must include test harness requirement: ${test}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_INTEGRATION_REQUIRED_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype integration plan must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_INTEGRATION_REQUIRED_NEXT_RECORDS) {
    if (!nextReviewRecords.includes(nextRecord)) {
      errors.push(`AI prototype integration plan must require next review record: ${nextRecord}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(blockedActions, "No Japanese support-language scoring or release")) {
    errors.push("MiniStar AI prototype integration plan must block Japanese support-language scoring or release.");
  }

  if (modePlans.length === 0) {
    errors.push("AI prototype integration plan must include mode integration plans.");
  }

  for (const modePlan of modePlans) {
    validateModeIntegrationPlan(modePlan, tenantId, errors);
  }

  return errors;
}

export function getAiPrototypeIntegrationPlanWarnings(plan: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(plan)) {
    return warnings;
  }

  const modePlans = readModeIntegrationPlans(plan);

  if (!modePlans.some((modePlan) => modePlan.proposedSurface.includes("Phaser"))) {
    warnings.push("AI prototype integration plan has no Phaser wrapper candidate to inspect.");
  }

  if (!modePlans.every((modePlan) => modePlan.adapterBoundary.includes("without owning route"))) {
    warnings.push("Every mode integration plan should explicitly block route state ownership.");
  }

  return warnings;
}

export function validateAiPrototypeIntegrationPlans(plans: unknown[]): string[] {
  return plans.flatMap((plan) => validateAiPrototypeIntegrationPlan(plan));
}

export function getAiPrototypeIntegrationPlanCollectionWarnings(plans: unknown[]): string[] {
  return plans.flatMap((plan) => getAiPrototypeIntegrationPlanWarnings(plan));
}

function validateModeIntegrationPlan(plan: AiPrototypeModeIntegrationPlan, tenantId: string, errors: string[]) {
  if (!plan.modeId || !plan.parentEngine || !plan.proposedSurface || !plan.adapterBoundary) {
    errors.push("AI prototype mode integration plan must include modeId, parentEngine, proposedSurface, and adapterBoundary.");
  }

  if (!plan.adapterBoundary.includes("fixture-driven adapter boundary")) {
    errors.push("AI prototype mode integration plan must require a fixture-driven adapter boundary.");
  }

  if (!plan.adapterBoundary.includes("LivingTextbook events")) {
    errors.push("AI prototype mode integration plan must report LivingTextbook events.");
  }

  if (!plan.adapterBoundary.includes("without owning route, scoring, audio, tenant, or assignment state")) {
    errors.push("AI prototype mode integration plan must block route, scoring, audio, tenant, and assignment ownership.");
  }

  for (const test of AI_PROTOTYPE_INTEGRATION_REQUIRED_MODE_TESTS) {
    if (!plan.requiredTests.includes(test)) {
      errors.push(`AI prototype mode integration plan must include required test: ${test}.`);
    }
  }

  for (const evidence of AI_PROTOTYPE_INTEGRATION_REQUIRED_ACCEPTANCE_EVIDENCE) {
    if (!textListIncludes(plan.acceptanceEvidence, evidence)) {
      errors.push(`AI prototype mode integration plan must include acceptance evidence: ${evidence}.`);
    }
  }

  for (const blockedShortcut of AI_PROTOTYPE_INTEGRATION_REQUIRED_BLOCKED_SHORTCUTS) {
    if (!textListIncludes(plan.blockedShortcuts, blockedShortcut)) {
      errors.push(`AI prototype mode integration plan must include blocked shortcut: ${blockedShortcut}.`);
    }
  }

  if (tenantId === "ministar" && !textListIncludes(plan.acceptanceEvidence, "Foundation Japanese support remains hiragana-only.")) {
    errors.push("MiniStar AI prototype mode integration plan must preserve hiragana-only Japanese support evidence.");
  }
}

function readModeIntegrationPlans(source: Record<string, unknown>): AiPrototypeModeIntegrationPlan[] {
  const value = source.modePlans;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((modePlan) => ({
    modeId: readString(modePlan, "modeId"),
    parentEngine: readString(modePlan, "parentEngine"),
    proposedSurface: readString(modePlan, "proposedSurface"),
    adapterBoundary: readString(modePlan, "adapterBoundary"),
    integrationSequence: readStringArray(modePlan, "integrationSequence"),
    requiredTests: readStringArray(modePlan, "requiredTests"),
    acceptanceEvidence: readStringArray(modePlan, "acceptanceEvidence"),
    blockedShortcuts: readStringArray(modePlan, "blockedShortcuts"),
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
