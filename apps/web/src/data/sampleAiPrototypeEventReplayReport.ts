import {
  sampleAiPrototypeIntegrationPlans,
  type AiPrototypeModeIntegrationPlan,
} from "@/data/sampleAiPrototypeIntegrationPlan";

export type AiPrototypeEventReplayReportStatus = "not-run" | "review-only" | "blocked";

export interface AiPrototypeModeEventReplayReport {
  modeId: string;
  parentEngine: string;
  replayHarness: string;
  requiredEventOrder: string[];
  allowedPayloadFields: string[];
  acceptedProgressEffects: string[];
  failureTriggers: string[];
}

export interface AiPrototypeEventReplayReport {
  reportId: string;
  tenantId: string;
  requestId: string;
  integrationPlanId: string;
  label: string;
  status: AiPrototypeEventReplayReportStatus;
  summary: string;
  sourceRecords: string[];
  replayPurpose: string[];
  standardEventCoverage: string[];
  eventAcceptanceChecks: string[];
  blockedActions: string[];
  modeReports: AiPrototypeModeEventReplayReport[];
}

export const sampleAiPrototypeEventReplayReports: AiPrototypeEventReplayReport[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";

    return {
      reportId: `prototype-event-replay-report-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      integrationPlanId: plan.planId,
      label: isMiniStar ? "MiniStar prototype event replay report" : "AI prototype event replay report",
      status: "not-run",
      summary:
        "Review-only standard event replay checklist for proving that a returned prototype emits LivingTextbook events instead of creating hidden progress, scoring, reward, or route side effects.",
      sourceRecords: [
        "prototype_event_replay_report",
        "prototype_fixture_replay_report",
        "prototype_wrapper_adapter_review",
        "ai_prototype_integration_plan",
        "standard_event_contract",
        "progress_event_acceptance_map",
      ],
      replayPurpose: [
        "Confirm standard events are emitted in the expected learning sequence.",
        "Confirm answer and mastery events carry metadata only, not score authority.",
        "Confirm target-language learning events are the only progress triggers.",
        "Confirm support-language, media-only, and background-audio events remain support-only.",
        "Confirm reportable events are compatible with teacher summaries and collection gates.",
      ],
      standardEventCoverage: [
        "game_started",
        "round_shown",
        "audio_requested",
        "answer_submitted",
        "answer_result",
        "mastery_updated",
        "game_completed",
      ],
      eventAcceptanceChecks: [
        "Event order is deterministic",
        "Every event includes tenant, package, unit, mode, and source ids",
        "answer_result does not directly write Star Dust",
        "mastery_updated is derived from accepted target-language results",
        "game_completed does not write reward inventory",
        "Support-language events are marked support-only",
        "No hidden local progress counter bypasses the event stream",
      ],
      blockedActions: [
        "No progress event write from prototype",
        "No direct score authority",
        "No reward inventory write",
        "No route registry write",
        "No student assignment",
        "No report export",
        ...(isMiniStar ? ["No Japanese support-language event can unlock English progress"] : []),
      ],
      modeReports: plan.modePlans.map((modePlan) => createModeEventReplayReport(modePlan, isMiniStar)),
    };
  });

function createModeEventReplayReport(
  modePlan: AiPrototypeModeIntegrationPlan,
  isMiniStar: boolean,
): AiPrototypeModeEventReplayReport {
  return {
    modeId: modePlan.modeId,
    parentEngine: modePlan.parentEngine,
    replayHarness:
      "A non-student event replay harness that captures emitted events from fixture-driven interaction without writing progress, score, reward, report, route, or assignment state.",
    requiredEventOrder: [
      "game_started",
      "round_shown",
      "audio_requested",
      "answer_submitted",
      "answer_result",
      "mastery_updated",
      "game_completed",
    ],
    allowedPayloadFields: [
      "tenantId",
      "packageId",
      "unitId",
      "gameMode",
      "roundId",
      "sourceText",
      "targetLanguage",
      "attemptMetadata",
      "supportOnly",
    ],
    acceptedProgressEffects: [
      "target_language_attempt_recorded",
      "target_language_answer_result_recorded",
      "mastery_candidate_marked_for_parent_engine",
      "teacher_report_event_previewed",
      "collection_gate_input_previewed",
      ...(isMiniStar ? ["ja_hiragana_support_event_marked_support_only"] : []),
    ],
    failureTriggers: [
      "Missing game_started or game_completed",
      "answer_result emitted before answer_submitted",
      "mastery_updated emitted from support-language text",
      "Prototype writes score or Star Dust directly",
      "Prototype writes reward inventory directly",
      "Prototype mutates route, playlist, report, assignment, or local bundle state",
    ],
  };
}

export function filterAiPrototypeEventReplayReportsByTenant(
  reports: AiPrototypeEventReplayReport[],
  tenantId: string,
): AiPrototypeEventReplayReport[] {
  return reports.filter((report) => report.tenantId === tenantId);
}
