import {
  sampleAiPrototypeReturnReviewPackets,
  type AiPrototypeModeReturnReview,
} from "@/data/sampleAiPrototypeReturnReview";
import {
  getAiPrototypeIntegrationPlanCollectionWarnings,
  validateAiPrototypeIntegrationPlans,
  type AiPrototypeIntegrationPlan as SharedAiPrototypeIntegrationPlan,
  type AiPrototypeIntegrationPlanStatus,
  type AiPrototypeModeIntegrationPlan as SharedAiPrototypeModeIntegrationPlan,
} from "@living-textbook/content-model/src/aiPrototypeIntegrationPlan";

export type AiPrototypeModeIntegrationPlan = SharedAiPrototypeModeIntegrationPlan;
export type AiPrototypeIntegrationPlan = SharedAiPrototypeIntegrationPlan;
export type { AiPrototypeIntegrationPlanStatus };

export const sampleAiPrototypeIntegrationPlans: AiPrototypeIntegrationPlan[] =
  sampleAiPrototypeReturnReviewPackets.map((review) => {
    const isMiniStar = review.tenantId === "ministar";

    return {
      planId: `prototype-integration-plan-${review.requestId}`,
      tenantId: review.tenantId,
      requestId: review.requestId,
      returnReviewId: review.reviewId,
      label: isMiniStar ? "MiniStar prototype integration plan" : "AI prototype integration plan",
      status: "needs-return-review",
      summary:
        "Review-only plan for converting a returned prototype into a LivingTextbook parent-engine integration candidate. It keeps returned files quarantined until fixture, event, audio, scoring, accessibility, and tenant-fit tests pass.",
      sourceRecords: [
        "ai_prototype_return_review",
        "ai_generated_game_build_brief",
        "standard_event_contract",
        "audio_cue_manifest",
        "game_scoring_profile_snapshot",
        "activity_compatibility_snapshot",
        "package_game_audio_coverage",
      ],
      integrationLanes: [
        "Quarantine returned files outside apps/web",
        "Create wrapper adapter proposal",
        "Run fixture conformance replay",
        "Run standard event replay",
        "Run target-language audio cue coverage",
        "Run deterministic scoring replay",
        "Run mobile and accessibility inspection",
        "Write Codex integration review decision",
      ],
      testHarnessRequirements: [
        "JSON fixture replay",
        "Standard event log replay",
        "Tap-to-speak coverage snapshot",
        "Scoring profile snapshot comparison",
        "Mobile viewport smoke evidence",
        "White-label theme injection check",
      ],
      blockedActions: [
        "No direct import into apps/web",
        "No route registry write",
        "No game sequence mutation",
        "No scoring profile mutation",
        "No audio manifest mutation",
        "No package promotion",
        "No student assignment",
        ...(isMiniStar ? ["No Japanese support-language scoring or release"] : []),
      ],
      nextReviewRecords: [
        "prototype_wrapper_adapter_review",
        "prototype_fixture_replay_report",
        "prototype_event_replay_report",
        "prototype_audio_coverage_report",
        "prototype_mobile_accessibility_report",
        "prototype_scoring_replay_report",
        "codex_integration_review_decision",
      ],
      modePlans: review.modeReviews.map((modeReview) => createModeIntegrationPlan(modeReview, isMiniStar)),
    };
  });

export const sampleAiPrototypeIntegrationPlanErrors = validateAiPrototypeIntegrationPlans(
  sampleAiPrototypeIntegrationPlans,
);

export const sampleAiPrototypeIntegrationPlanWarnings = getAiPrototypeIntegrationPlanCollectionWarnings(
  sampleAiPrototypeIntegrationPlans,
);

function createModeIntegrationPlan(
  modeReview: AiPrototypeModeReturnReview,
  isMiniStar: boolean,
): AiPrototypeModeIntegrationPlan {
  const prefersPhaserWrapper = modeReview.prototypeSurface.includes("Phaser");

  return {
    modeId: modeReview.modeId,
    parentEngine: modeReview.parentEngine,
    proposedSurface: prefersPhaserWrapper ? "Phaser wrapper candidate" : "DOM parent-engine wrapper candidate",
    adapterBoundary:
      "Prototype must expose a fixture-driven adapter boundary and report LivingTextbook events without owning route, scoring, audio, tenant, or assignment state.",
    integrationSequence: [
      "Map prototype input to reviewed unit JSON fixture.",
      "Map prototype output to standard event contract.",
      "Attach target-language audio cues through the shared audio manifest.",
      "Replay deterministic scoring against the existing scoring profile.",
      "Review mobile layout, visible control text, and accessible touch targets.",
      "Only then propose an apps/web integration patch.",
    ],
    requiredTests: [
      "Fixture parse test",
      "Event contract replay test",
      "Audio cue coverage test",
      "Scoring profile replay test",
      "Mobile viewport smoke test",
      "Tenant theme injection test",
    ],
    acceptanceEvidence: [
      "All target-language text has tap-to-speak or replay support.",
      "Support language remains support-only.",
      "No random reward, gacha, or media-only mastery path exists.",
      "No hidden black button text or unreadable learner control exists.",
      "Prototype can be removed without breaking route contracts.",
      ...(isMiniStar ? ["Foundation Japanese support remains hiragana-only."] : []),
    ],
    blockedShortcuts: [
      "Cannot bypass parent engine.",
      "Cannot mutate route registry.",
      "Cannot mutate scoring profile.",
      "Cannot mutate audio manifest.",
      "Cannot assign students.",
      "Cannot become package-ready from prototype evidence alone.",
    ],
  };
}

export function filterAiPrototypeIntegrationPlansByTenant(
  plans: AiPrototypeIntegrationPlan[],
  tenantId: string,
): AiPrototypeIntegrationPlan[] {
  return plans.filter((plan) => plan.tenantId === tenantId);
}
