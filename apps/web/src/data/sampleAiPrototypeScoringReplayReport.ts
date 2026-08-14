import {
  sampleAiPrototypeIntegrationPlans,
  type AiPrototypeModeIntegrationPlan,
} from "@/data/sampleAiPrototypeIntegrationPlan";
import {
  getAiPrototypeScoringReplayReportCollectionWarnings,
  validateAiPrototypeScoringReplayReports,
  type AiPrototypeModeScoringReplayReport as SharedAiPrototypeModeScoringReplayReport,
  type AiPrototypeScoringReplayReport as SharedAiPrototypeScoringReplayReport,
  type AiPrototypeScoringReplayReportStatus,
} from "@living-textbook/content-model/src/aiPrototypeScoringReplayReport";

export type AiPrototypeModeScoringReplayReport = SharedAiPrototypeModeScoringReplayReport;
export type AiPrototypeScoringReplayReport = SharedAiPrototypeScoringReplayReport;
export type { AiPrototypeScoringReplayReportStatus };

export const sampleAiPrototypeScoringReplayReports: AiPrototypeScoringReplayReport[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";

    return {
      reportId: `prototype-scoring-replay-report-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      integrationPlanId: plan.planId,
      label: isMiniStar ? "MiniStar prototype scoring replay report" : "AI prototype scoring replay report",
      status: "not-run",
      summary:
        "Review-only deterministic scoring checklist for proving that a returned prototype reports answer evidence without owning Star Dust, mastery, rewards, or score authority.",
      sourceRecords: [
        "prototype_scoring_replay_report",
        "ai_prototype_integration_plan",
        "game_scoring_profile_snapshot",
        "progress_event_acceptance_map",
        "collection_unlock_binding",
        "standard_event_contract",
      ],
      scoringProfilePolicy:
        "The parent engine and reviewed game_scoring_profile_snapshot own scoring. Prototype wrappers can report attempts only.",
      masteryPolicy:
        "Only accepted target-language answer results can become mastery candidates; support-language and media-only events stay support-only.",
      rewardBoundaryPolicy:
        "Collection unlocks remain deterministic and review-gated. Prototypes cannot write reward inventory, random rewards, Spin Wheel tickets, or avatar evolution.",
      scoringPurpose: [
        "Confirm the prototype emits answer evidence rather than direct score writes.",
        "Confirm deterministic scoring replays against the reviewed scoring profile.",
        "Confirm the 1,000 Star Dust cap and 75% mastery rule remain parent-engine rules.",
        "Confirm support-language, background media, and passive listening never produce mastery.",
        "Confirm reward and collection effects remain outside the returned prototype.",
      ],
      scoreReplayChecks: [
        "Deterministic scoring replay",
        "game_scoring_profile_snapshot is the scoring source",
        "No direct score authority",
        "No Star Dust write from prototype",
        "1,000 Star Dust cap preserved",
      ],
      masteryReplayChecks: [
        "Target-language answer result required",
        "progress_event_acceptance_map required",
        "No support-language-only mastery",
        "No media-only Star Dust",
        "75% mastery threshold remains parent-engine controlled",
      ],
      rewardBoundaryChecks: [
        "collection_unlock_binding is referenced only",
        "No reward inventory write",
        "No random reward",
        "No generated gacha",
        "No purchase-like unlock",
      ],
      blockedActions: [
        "No scoring profile mutation",
        "No direct score authority",
        "No Star Dust write from prototype",
        "No reward inventory write",
        "No random reward generation",
        "No media-only Star Dust",
        "No support-language-only mastery",
        "No package promotion",
        "No student assignment",
        ...(isMiniStar ? ["No Japanese support-language scoring or release"] : []),
      ],
      modeReports: plan.modePlans.map((modePlan) => createModeScoringReplayReport(modePlan, isMiniStar)),
    };
  });

export const sampleAiPrototypeScoringReplayReportErrors = validateAiPrototypeScoringReplayReports(
  sampleAiPrototypeScoringReplayReports,
);

export const sampleAiPrototypeScoringReplayReportWarnings =
  getAiPrototypeScoringReplayReportCollectionWarnings(sampleAiPrototypeScoringReplayReports);

function createModeScoringReplayReport(
  modePlan: AiPrototypeModeIntegrationPlan,
  isMiniStar: boolean,
): AiPrototypeModeScoringReplayReport {
  return {
    modeId: modePlan.modeId,
    parentEngine: modePlan.parentEngine,
    scoringHarness:
      "A non-student scoring replay harness that feeds fixture-driven attempts into the parent scoring profile and verifies emitted events without writing Star Dust, mastery, or rewards.",
    scoreInputs: [
      "Reviewed unit JSON fixture",
      "Standard answer_result events",
      "Attempt metadata",
      "Target-language flag",
      "Support-only flag",
    ],
    scoringSteps: [
      "Replay correct target-language attempt.",
      "Replay incorrect target-language attempt.",
      "Replay support-language audio request.",
      "Replay media-only interaction.",
      "Compare output to scoring profile snapshot.",
    ],
    masteryChecks: [
      "Correct target-language answer can become a mastery candidate.",
      "Support-language cue cannot unlock progress.",
      "Media-only action cannot earn Star Dust.",
      "Completion does not bypass accepted event effects.",
      ...(isMiniStar ? ["Japanese support stays support-only for English mastery."] : []),
    ],
    rewardBoundaryChecks: [
      "Prototype cannot write collection inventory.",
      "Prototype cannot issue Spin Wheel tickets.",
      "Prototype cannot evolve avatars directly.",
      "Prototype cannot generate random rewards.",
    ],
    failureTriggers: [
      "Prototype writes score, Star Dust, mastery, reward, route, package, or assignment state.",
      "Support-language event becomes a score source.",
      "Media-only interaction becomes a score source.",
      "Scoring profile is mutated by prototype code.",
      "Reward inventory or random reward is created by prototype code.",
    ],
  };
}

export function filterAiPrototypeScoringReplayReportsByTenant(
  reports: AiPrototypeScoringReplayReport[],
  tenantId: string,
): AiPrototypeScoringReplayReport[] {
  return reports.filter((report) => report.tenantId === tenantId);
}
