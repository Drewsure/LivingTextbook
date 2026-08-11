import {
  getAiGamificationMappingPlanWarnings,
  validateAiGamificationMappingPlan,
  type AiGamificationMappingPlan,
  type AiGamificationMappingStatus,
} from "@living-textbook/content-model/src/aiGamificationMapping";

export type { AiGamificationMappingPlan, AiGamificationMappingStatus };

export const sampleAiGamificationMappingPlans: AiGamificationMappingPlan[] = [
  {
    mappingId: "gamification-map-sample-publisher-ai-game-request-v1",
    requestId: "sample-publisher-l1-routines-game-draft",
    tenantId: "sample-publisher",
    label: "Sample publisher AI gamification map",
    summary:
      "Review-only mapping for how generated activities would emit standard events, earn Star Dust, update mastery, and unlock collection items after package approval.",
    rewardCurrency: "Star Dust",
    unitMaxStarDust: 1000,
    unitMasteryThreshold: 750,
    moduleMasteryThreshold: 3000,
    scoringLanes: [
      {
        laneId: "vocab-acquisition",
        label: "Vocabulary acquisition",
        maxStarDust: 300,
        acceptedEvents: ["round_shown", "answer_submitted", "answer_result", "mastery_updated"],
        progressTrigger: "Correct target-language term activity only.",
        status: "ready-for-review",
      },
      {
        laneId: "syntax-construction",
        label: "Syntax construction",
        maxStarDust: 300,
        acceptedEvents: ["round_shown", "answer_submitted", "answer_result", "mastery_updated"],
        progressTrigger: "Correct target-language sentence construction only.",
        status: "ready-for-review",
      },
      {
        laneId: "accuracy-reflex",
        label: "Accuracy and reflex bonus",
        maxStarDust: 400,
        acceptedEvents: ["answer_result", "game_completed", "mastery_updated"],
        progressTrigger: "Reviewed game scoring profile, never media-only engagement.",
        status: "draft-only",
      },
    ],
    rewardBindings: [
      {
        bindingId: "reward-first-practice-spark",
        rewardId: "first-practice-spark",
        label: "First Practice Spark",
        requiredStarDust: 300,
        triggerEvent: "mastery_updated",
        deterministicRule: "Unlock at or above 300 Star Dust from accepted target-language game events.",
      },
      {
        bindingId: "reward-starter-room-star-mat",
        rewardId: "starter-room-star-mat",
        label: "Starter Room Mat",
        requiredStarDust: 450,
        triggerEvent: "mastery_updated",
        deterministicRule: "Unlock at or above 450 Star Dust from accepted target-language game events.",
      },
      {
        bindingId: "reward-memory-ready-title",
        rewardId: "memory-ready-title",
        label: "Memory Ready",
        requiredStarDust: 600,
        triggerEvent: "game_completed",
        deterministicRule: "Unlock after Memory Match opens and accepted game progress reaches the threshold.",
      },
    ],
    requiredRecords: [
      "ai_gamification_mapping_plan",
      "game_scoring_profile_snapshot",
      "collection_unlock_binding",
      "progress_event_acceptance_map",
      "teacher_draft_verifier_submission",
    ],
    blockedActions: [
      "Random reward generation blocked",
      "Generated gacha blocked",
      "Media-only Star Dust blocked",
      "Support-language-only mastery blocked",
      "Purchase-like unlock blocked",
      "Unreviewed score profile blocked",
      "Student collection inventory write blocked",
    ],
  },
  {
    mappingId: "gamification-map-ministar-ai-game-request-v1",
    requestId: "ministar-l1-greetings-game-draft",
    tenantId: "ministar",
    label: "MiniStar AI gamification map",
    summary:
      "Review-only mapping for how generated MiniStar greetings activities would emit standard events, earn Star Dust, update mastery, and unlock collection items after package approval.",
    rewardCurrency: "Star Dust",
    unitMaxStarDust: 1000,
    unitMasteryThreshold: 750,
    moduleMasteryThreshold: 3000,
    scoringLanes: [
      {
        laneId: "vocab-acquisition",
        label: "Vocabulary acquisition",
        maxStarDust: 300,
        acceptedEvents: ["round_shown", "answer_submitted", "answer_result", "mastery_updated"],
        progressTrigger: "Correct English term activity only.",
        status: "ready-for-review",
      },
      {
        laneId: "syntax-and-speaking",
        label: "Syntax construction",
        maxStarDust: 300,
        acceptedEvents: ["round_shown", "answer_submitted", "answer_result", "mastery_updated"],
        progressTrigger: "Correct English sentence or teacher-approved speaking activity only.",
        status: "ready-for-review",
      },
      {
        laneId: "accuracy-reflex",
        label: "Accuracy and reflex bonus",
        maxStarDust: 400,
        acceptedEvents: ["answer_result", "game_completed", "mastery_updated"],
        progressTrigger: "Reviewed game scoring profile, never Japanese support or media-only engagement.",
        status: "draft-only",
      },
    ],
    rewardBindings: [
      {
        bindingId: "reward-first-practice-spark-ministar",
        rewardId: "first-practice-spark",
        label: "First Practice Spark",
        requiredStarDust: 300,
        triggerEvent: "mastery_updated",
        deterministicRule: "Unlock at or above 300 Star Dust from accepted English target-language game events.",
      },
      {
        bindingId: "reward-memory-ready-title-ministar",
        rewardId: "memory-ready-title",
        label: "Memory Ready",
        requiredStarDust: 600,
        triggerEvent: "game_completed",
        deterministicRule: "Unlock after Memory Match opens and accepted English game progress reaches the threshold.",
      },
      {
        bindingId: "reward-speaking-spark-ministar",
        rewardId: "speaking-spark",
        label: "Speaking Spark",
        requiredStarDust: 750,
        triggerEvent: "mastery_updated",
        deterministicRule: "Unlock only after teacher-approved English speaking practice reaches the unit mastery threshold.",
      },
    ],
    requiredRecords: [
      "ai_gamification_mapping_plan",
      "game_scoring_profile_snapshot",
      "collection_unlock_binding",
      "progress_event_acceptance_map",
      "teacher_draft_verifier_submission",
    ],
    blockedActions: [
      "Random reward generation blocked",
      "Generated gacha blocked",
      "Media-only Star Dust blocked",
      "Support-language-only mastery blocked",
      "Purchase-like unlock blocked",
      "Unreviewed score profile blocked",
      "Student collection inventory write blocked",
    ],
  },
];

export function filterAiGamificationMappingPlansByTenant(
  plans: AiGamificationMappingPlan[],
  tenantId: string,
): AiGamificationMappingPlan[] {
  return plans.filter((plan) => plan.tenantId === tenantId);
}

export const sampleAiGamificationMappingPlanErrors = sampleAiGamificationMappingPlans.flatMap(
  validateAiGamificationMappingPlan,
);

export const sampleAiGamificationMappingPlanWarnings = sampleAiGamificationMappingPlans.flatMap(
  getAiGamificationMappingPlanWarnings,
);
