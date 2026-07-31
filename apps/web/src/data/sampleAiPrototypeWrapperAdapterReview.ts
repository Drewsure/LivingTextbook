import {
  sampleAiPrototypeIntegrationPlans,
  type AiPrototypeModeIntegrationPlan,
} from "@/data/sampleAiPrototypeIntegrationPlan";

export type AiPrototypeWrapperAdapterReviewStatus = "not-started" | "review-only" | "blocked";

export interface AiPrototypeModeWrapperAdapterReview {
  modeId: string;
  parentEngine: string;
  proposedSurface: string;
  adapterEntryPoint: string;
  fixtureInputContract: string[];
  standardEventOutputContract: string[];
  stateOwnershipRules: string[];
  wrapperEvidence: string[];
  rejectionTriggers: string[];
}

export interface AiPrototypeWrapperAdapterReview {
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
  modeReviews: AiPrototypeModeWrapperAdapterReview[];
}

export const sampleAiPrototypeWrapperAdapterReviews: AiPrototypeWrapperAdapterReview[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";

    return {
      reviewId: `prototype-wrapper-adapter-review-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      integrationPlanId: plan.planId,
      label: isMiniStar ? "MiniStar prototype wrapper adapter review" : "AI prototype wrapper adapter review",
      status: "not-started",
      summary:
        "Review-only adapter checklist for deciding whether a returned prototype can become a removable wrapper around an approved parent engine without owning routes, scoring, audio manifests, tenant branding, or assignment state.",
      sourceRecords: [
        "prototype_wrapper_adapter_review",
        "ai_prototype_integration_plan",
        "ai_prototype_return_review",
        "standard_event_contract",
        "audio_cue_manifest",
        "game_scoring_profile_snapshot",
      ],
      parentEngineAdapterBoundary: [
        "Prototype receives reviewed unit JSON as input.",
        "Prototype reports events through the standard_event_contract adapter.",
        "Prototype requests learning audio through the shared audio cue manifest.",
        "Prototype reads tenant theme, mascot, avatar, and media through injected config.",
        "Prototype owns only transient local interaction state.",
        "Parent engine owns route, scoring, mastery, progress, rewards, and assignment effects.",
      ],
      wrapperAcceptanceChecks: [
        "Fixture input contract is explicit and does not require hard-coded unit text.",
        "Standard event output contract covers start, round, audio, answer, result, mastery, and completion events.",
        "No event contract bypass exists.",
        "No tenant hard-coding exists.",
        "No hidden control text or unreadable button state exists.",
        "Wrapper can be removed without breaking route contracts.",
      ],
      blockedActions: [
        "No direct app import",
        "No route registry write",
        "No event contract bypass",
        "No scoring profile mutation",
        "No audio manifest mutation",
        "No tenant hard-coding",
        "No package promotion",
        "No student assignment",
        ...(isMiniStar ? ["No Japanese support-language scoring or release"] : []),
      ],
      modeReviews: plan.modePlans.map((modePlan) => createModeWrapperReview(modePlan, isMiniStar)),
    };
  });

function createModeWrapperReview(
  modePlan: AiPrototypeModeIntegrationPlan,
  isMiniStar: boolean,
): AiPrototypeModeWrapperAdapterReview {
  return {
    modeId: modePlan.modeId,
    parentEngine: modePlan.parentEngine,
    proposedSurface: modePlan.proposedSurface,
    adapterEntryPoint:
      "A small wrapper component or engine adapter that accepts the reviewed fixture and emits standard events without writing platform state.",
    fixtureInputContract: [
      "unit_meta",
      "pedagogical_payload",
      "audio_cues",
      "game_mode_config",
      "scoring_profile",
      "blocked_actions",
    ],
    standardEventOutputContract: [
      "game_started",
      "round_shown",
      "audio_requested",
      "answer_submitted",
      "answer_result",
      "mastery_updated",
      "game_completed",
    ],
    stateOwnershipRules: [
      "Wrapper may own current selection, animation state, and temporary drag state.",
      "Wrapper may not own route state.",
      "Wrapper may not own score authority.",
      "Wrapper may not own audio manifest authority.",
      "Wrapper may not own assignment or learner identity.",
      "Wrapper may not own reward inventory writes.",
    ],
    wrapperEvidence: [
      "Fixture parse smoke test",
      "Event emission sample",
      "Audio request sample",
      "Scoring replay compatibility note",
      "Mobile visible-control screenshot note",
      "Tenant theme injection note",
      ...(isMiniStar ? ["Hiragana-only support-language note"] : []),
    ],
    rejectionTriggers: [
      "Hard-coded vocabulary, sentence, tenant, mascot, or media.",
      "Custom event names without adapter mapping.",
      "Direct score or reward writes.",
      "Support-language progress trigger.",
      "Route or assignment side effect.",
      "Unreadable text or hidden button labels.",
    ],
  };
}

export function filterAiPrototypeWrapperAdapterReviewsByTenant(
  reviews: AiPrototypeWrapperAdapterReview[],
  tenantId: string,
): AiPrototypeWrapperAdapterReview[] {
  return reviews.filter((review) => review.tenantId === tenantId);
}
