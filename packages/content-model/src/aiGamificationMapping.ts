export type AiGamificationMappingStatus = "draft-only" | "blocked" | "ready-for-review";

export interface AiGamificationScoringLane {
  laneId: string;
  label: string;
  maxStarDust: number;
  acceptedEvents: string[];
  progressTrigger: string;
  status: AiGamificationMappingStatus;
}

export interface AiGamificationRewardBinding {
  bindingId: string;
  rewardId: string;
  label: string;
  requiredStarDust: number;
  triggerEvent: string;
  deterministicRule: string;
}

export interface AiGamificationMappingPlan {
  mappingId: string;
  requestId: string;
  tenantId: string;
  label: string;
  summary: string;
  rewardCurrency: string;
  unitMaxStarDust: number;
  unitMasteryThreshold: number;
  moduleMasteryThreshold: number;
  scoringLanes: AiGamificationScoringLane[];
  rewardBindings: AiGamificationRewardBinding[];
  requiredRecords: string[];
  blockedActions: string[];
}

export const AI_GAMIFICATION_REQUIRED_BLOCKED_ACTIONS = [
  "Random reward generation blocked",
  "Generated gacha blocked",
  "Media-only Star Dust blocked",
  "Support-language-only mastery blocked",
  "Purchase-like unlock blocked",
  "Unreviewed score profile blocked",
  "Student collection inventory write blocked",
] as const;

export const AI_GAMIFICATION_REQUIRED_RECORDS = [
  "ai_gamification_mapping_plan",
  "game_scoring_profile_snapshot",
  "collection_unlock_binding",
  "progress_event_acceptance_map",
  "teacher_draft_verifier_submission",
] as const;

const allowedStatuses = new Set<AiGamificationMappingStatus>(["draft-only", "blocked", "ready-for-review"]);
const allowedRewardTriggerEvents = new Set(["mastery_updated", "game_completed"]);

export function validateAiGamificationMappingPlan(plan: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(plan)) {
    return ["AI gamification mapping plan must be a JSON object."];
  }

  const mappingId = readString(plan, "mappingId");
  const requestId = readString(plan, "requestId");
  const tenantId = readString(plan, "tenantId");
  const rewardCurrency = readString(plan, "rewardCurrency");
  const unitMaxStarDust = readNumber(plan, "unitMaxStarDust");
  const unitMasteryThreshold = readNumber(plan, "unitMasteryThreshold");
  const moduleMasteryThreshold = readNumber(plan, "moduleMasteryThreshold");
  const scoringLanes = readArray(plan, "scoringLanes");
  const rewardBindings = readArray(plan, "rewardBindings");
  const requiredRecords = readStringArray(plan, "requiredRecords");
  const blockedActions = readStringArray(plan, "blockedActions");

  if (!mappingId || !requestId || !tenantId) {
    errors.push("AI gamification mapping plan must include mappingId, requestId, and tenantId.");
  }

  if (!rewardCurrency) {
    errors.push("AI gamification mapping plan must include a rewardCurrency.");
  }

  if (unitMaxStarDust !== 1000) {
    errors.push("AI gamification mapping plan must keep unitMaxStarDust at 1000.");
  }

  if (unitMasteryThreshold !== 750) {
    errors.push("AI gamification mapping plan must keep unitMasteryThreshold at 750.");
  }

  if (moduleMasteryThreshold !== 3000) {
    errors.push("AI gamification mapping plan must keep moduleMasteryThreshold at 3000.");
  }

  const scoringTotal = scoringLanes.reduce<number>((total, lane) => {
    if (!isRecord(lane)) {
      return total;
    }

    return total + (readNumber(lane, "maxStarDust") ?? 0);
  }, 0);

  if (scoringTotal !== unitMaxStarDust || scoringTotal !== 1000) {
    errors.push("AI gamification mapping plan scoring lanes must total exactly 1000 Star Dust.");
  }

  if (scoringLanes.length === 0) {
    errors.push("AI gamification mapping plan must include scoring lanes.");
  }

  for (const lane of scoringLanes) {
    if (!isRecord(lane)) {
      errors.push("AI gamification mapping plan scoring lanes must be objects.");
      continue;
    }

    const laneId = readString(lane, "laneId");
    const maxStarDust = readNumber(lane, "maxStarDust");
    const acceptedEvents = readStringArray(lane, "acceptedEvents");
    const progressTrigger = readString(lane, "progressTrigger");
    const status = readString(lane, "status");

    if (!laneId) {
      errors.push("AI gamification mapping plan scoring lanes must include laneId.");
    }

    if (maxStarDust === undefined || maxStarDust <= 0) {
      errors.push(`AI gamification scoring lane ${laneId ?? "(missing)"} must include positive maxStarDust.`);
    }

    if (acceptedEvents.length === 0) {
      errors.push(`AI gamification scoring lane ${laneId ?? "(missing)"} must include acceptedEvents.`);
    }

    if (!progressTrigger) {
      errors.push(`AI gamification scoring lane ${laneId ?? "(missing)"} must include a progressTrigger.`);
    }

    if (!status || !allowedStatuses.has(status as AiGamificationMappingStatus)) {
      errors.push(`AI gamification scoring lane ${laneId ?? "(missing)"} must stay draft-only, blocked, or ready-for-review.`);
    }
  }

  if (rewardBindings.length === 0) {
    errors.push("AI gamification mapping plan must include deterministic collection unlock bindings.");
  }

  for (const binding of rewardBindings) {
    if (!isRecord(binding)) {
      errors.push("AI gamification reward bindings must be objects.");
      continue;
    }

    const bindingId = readString(binding, "bindingId");
    const requiredStarDust = readNumber(binding, "requiredStarDust");
    const triggerEvent = readString(binding, "triggerEvent");
    const deterministicRule = readString(binding, "deterministicRule");

    if (!bindingId) {
      errors.push("AI gamification reward bindings must include bindingId.");
    }

    if (requiredStarDust === undefined || requiredStarDust <= 0 || requiredStarDust > 1000) {
      errors.push(`AI gamification reward binding ${bindingId ?? "(missing)"} must require between 1 and 1000 Star Dust.`);
    }

    if (!triggerEvent || !allowedRewardTriggerEvents.has(triggerEvent)) {
      errors.push(
        `AI gamification reward binding ${bindingId ?? "(missing)"} must trigger only from mastery_updated or game_completed.`,
      );
    }

    if (!deterministicRule || !deterministicRule.toLowerCase().includes("unlock")) {
      errors.push(`AI gamification reward binding ${bindingId ?? "(missing)"} must include a deterministic unlock rule.`);
    }

    if (deterministicRule && /random|gacha|purchase/i.test(deterministicRule)) {
      errors.push(`AI gamification reward binding ${bindingId ?? "(missing)"} must not use random, gacha, or purchase pressure.`);
    }
  }

  for (const record of AI_GAMIFICATION_REQUIRED_RECORDS) {
    if (!requiredRecords.includes(record)) {
      errors.push(`AI gamification mapping plan must include required record: ${record}.`);
    }
  }

  for (const action of AI_GAMIFICATION_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) {
      errors.push(`AI gamification mapping plan must include blocked action: ${action}.`);
    }
  }

  return errors;
}

export function getAiGamificationMappingPlanWarnings(plan: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(plan)) {
    return warnings;
  }

  const scoringLanes = readArray(plan, "scoringLanes");
  const rewardBindings = readArray(plan, "rewardBindings");

  if (scoringLanes.length !== 3) {
    warnings.push("AI gamification mapping usually uses vocabulary, syntax, and accuracy/reflex scoring lanes.");
  }

  if (rewardBindings.length < 2) {
    warnings.push("AI gamification mapping should expose multiple earned collection unlock previews.");
  }

  return warnings;
}

function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  return Array.isArray(value) ? value : [];
}

function readString(source: Record<string, unknown>, key: string): string | undefined {
  const value = source[key];
  return typeof value === "string" ? value.trim() : undefined;
}

function readNumber(source: Record<string, unknown>, key: string): number | undefined {
  const value = source[key];
  return typeof value === "number" ? value : undefined;
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
