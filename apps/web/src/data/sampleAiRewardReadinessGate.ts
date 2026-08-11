import { sampleAiDraftCorrectionQueues } from "@/data/sampleAiDraftCorrectionQueue";
import { sampleAiGamificationMappingPlans } from "@/data/sampleAiGamificationMappingPlan";
import { validateAiGamificationMappingPlan } from "@living-textbook/content-model/src/aiGamificationMapping";

export type AiRewardReadinessStatus = "blocked" | "ready-for-review";

export interface AiRewardReadinessCheck {
  checkId: string;
  label: string;
  status: AiRewardReadinessStatus;
  evidence: string;
  requiredBeforeStudentUse: string;
}

export interface AiRewardReadinessGate {
  gateId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  status: AiRewardReadinessStatus;
  rewardCurrency: string;
  checks: AiRewardReadinessCheck[];
  blockedActions: string[];
  nextRecords: string[];
}

export const sampleAiRewardReadinessGates: AiRewardReadinessGate[] = sampleAiGamificationMappingPlans.map((plan) => {
  const correctionQueue = sampleAiDraftCorrectionQueues.find((queue) => queue.requestId === plan.requestId);
  const scoringLaneTotal = plan.scoringLanes.reduce((total, lane) => total + lane.maxStarDust, 0);
  const allRewardsDeterministic = plan.rewardBindings.every((binding) =>
    binding.deterministicRule.toLowerCase().includes("unlock"),
  );
  const gamificationGuardBlocks = validateAiGamificationMappingPlan(plan);
  const correctionQueueClear = (correctionQueue?.validationBlockCount ?? 1) === 0;

  const checks: AiRewardReadinessCheck[] = [
    {
      checkId: "unit-star-dust-cap",
      label: "1,000 Star Dust unit cap",
      status: scoringLaneTotal === plan.unitMaxStarDust && plan.unitMaxStarDust === 1000 ? "ready-for-review" : "blocked",
      evidence: `${scoringLaneTotal} ${plan.rewardCurrency} allocated across scoring lanes.`,
      requiredBeforeStudentUse: "game_scoring_profile_snapshot",
    },
    {
      checkId: "mastery-threshold",
      label: "75% mastery threshold",
      status: plan.unitMasteryThreshold === 750 && plan.moduleMasteryThreshold === 3000 ? "ready-for-review" : "blocked",
      evidence: `${plan.unitMasteryThreshold} unit threshold and ${plan.moduleMasteryThreshold} module threshold.`,
      requiredBeforeStudentUse: "progress_event_acceptance_map",
    },
    {
      checkId: "deterministic-unlocks",
      label: "Deterministic collection unlocks",
      status: allRewardsDeterministic ? "ready-for-review" : "blocked",
      evidence: `${plan.rewardBindings.length} collection unlock binding preview(s) use explicit threshold rules.`,
      requiredBeforeStudentUse: "collection_unlock_binding",
    },
    {
      checkId: "accepted-event-sources",
      label: "Accepted learning events only",
      status: plan.blockedActions.includes("Media-only Star Dust blocked") ? "ready-for-review" : "blocked",
      evidence: "Media-only and support-language-only mastery are blocked in the generated gamification map.",
      requiredBeforeStudentUse: "progress_event_acceptance_map",
    },
    {
      checkId: "gamification-guard-clear",
      label: "Gamification mapping guard clear",
      status: gamificationGuardBlocks.length === 0 ? "ready-for-review" : "blocked",
      evidence: `${gamificationGuardBlocks.length} gamification guard block(s) remain.`,
      requiredBeforeStudentUse: "ai_gamification_mapping_plan",
    },
    {
      checkId: "correction-queue-clear",
      label: "Correction queue clear before rewards",
      status: correctionQueueClear ? "ready-for-review" : "blocked",
      evidence: `${correctionQueue?.validationBlockCount ?? "Missing"} validation block(s) remain in the AI draft correction queue.`,
      requiredBeforeStudentUse: "ai_draft_correction_queue",
    },
  ];

  return {
    gateId: `ai-reward-readiness-gate-${plan.mappingId}`,
    tenantId: plan.tenantId,
    requestId: plan.requestId,
    label: "AI reward readiness gate",
    summary:
      "Reward readiness checks that generated game packages preserve deterministic Star Dust, mastery thresholds, accepted learning events, and collection unlock rules before any student inventory writes exist.",
    status: checks.some((check) => check.status === "blocked") ? "blocked" : "ready-for-review",
    rewardCurrency: plan.rewardCurrency,
    checks,
    blockedActions: [
      "Reward publish blocked",
      "Collection inventory write blocked",
      "Generated surprise reward blocked",
      "Spin Wheel ticket issuance blocked",
      "Avatar evolution write blocked",
      "Student assignment blocked",
    ],
    nextRecords: [
      "game_scoring_profile_snapshot",
      "progress_event_acceptance_map",
      "collection_unlock_binding",
      "earned_collection_inventory",
      "ai_draft_correction_queue",
    ],
  };
});

export function filterAiRewardReadinessGatesByTenant(
  gates: AiRewardReadinessGate[],
  tenantId: string,
): AiRewardReadinessGate[] {
  return gates.filter((gate) => gate.tenantId === tenantId);
}
