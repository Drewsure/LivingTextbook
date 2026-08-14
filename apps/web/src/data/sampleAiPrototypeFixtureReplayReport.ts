import {
  sampleAiPrototypeIntegrationPlans,
  type AiPrototypeModeIntegrationPlan,
} from "@/data/sampleAiPrototypeIntegrationPlan";
import {
  getAiPrototypeFixtureReplayReportCollectionWarnings,
  validateAiPrototypeFixtureReplayReports,
  type AiPrototypeFixtureReplayReport as SharedAiPrototypeFixtureReplayReport,
  type AiPrototypeFixtureReplayReportStatus,
  type AiPrototypeModeFixtureReplayReport as SharedAiPrototypeModeFixtureReplayReport,
} from "@living-textbook/content-model/src/aiPrototypeFixtureReplayReport";

export type AiPrototypeModeFixtureReplayReport = SharedAiPrototypeModeFixtureReplayReport;
export type AiPrototypeFixtureReplayReport = SharedAiPrototypeFixtureReplayReport;
export type { AiPrototypeFixtureReplayReportStatus };

export const sampleAiPrototypeFixtureReplayReports: AiPrototypeFixtureReplayReport[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const isMiniStar = plan.tenantId === "ministar";

    return {
      reportId: `prototype-fixture-replay-report-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      integrationPlanId: plan.planId,
      label: isMiniStar ? "MiniStar prototype fixture replay report" : "AI prototype fixture replay report",
      status: "not-run",
      summary:
        "Review-only fixture replay checklist for proving that a returned prototype can load reviewed JSON payloads without hard-coded unit text, tenant assumptions, or hidden progress shortcuts.",
      sourceRecords: [
        "prototype_fixture_replay_report",
        "prototype_wrapper_adapter_review",
        "ai_prototype_integration_plan",
        "ai_prototype_return_review",
        "reviewed_unit_json_fixture",
        "ai_generated_draft_payload_preview",
      ],
      replayPurpose: [
        "Confirm the prototype receives reviewed unit JSON through a wrapper input.",
        "Confirm vocabulary terms and target sentences are read from the fixture.",
        "Confirm audio cues are requested from the fixture manifest.",
        "Confirm support language remains metadata for support only.",
        "Confirm scoring, rewards, and mastery stay outside the prototype.",
      ],
      fixtureCoverage: [
        "unit_meta",
        "pedagogical_payload",
        "audio_cues",
        "game_mode_config",
        "scoring_profile",
        "assist_language_policy",
        "tenant_theme_tokens",
      ],
      replayAcceptanceChecks: [
        "No hard-coded unit text",
        "8-12 vocabulary terms accepted from fixture",
        "Exactly 2 target sentences accepted from fixture",
        "Target-language text remains the only progress trigger",
        "Support language is support-only",
        "No missing target-language audio cue references",
        "No tenant hard-coded assets or mascot assumptions",
      ],
      blockedActions: [
        "No live model call",
        "No direct import into apps/web",
        "No route registry write",
        "No scoring profile mutation",
        "No audio manifest mutation",
        "No reward inventory write",
        "No student assignment",
        "No support-language progress trigger",
        ...(isMiniStar ? ["No Japanese support-language scoring or release"] : []),
      ],
      modeReports: plan.modePlans.map((modePlan) => createModeFixtureReplayReport(modePlan, isMiniStar)),
    };
  });

export const sampleAiPrototypeFixtureReplayReportErrors = validateAiPrototypeFixtureReplayReports(
  sampleAiPrototypeFixtureReplayReports,
);

export const sampleAiPrototypeFixtureReplayReportWarnings =
  getAiPrototypeFixtureReplayReportCollectionWarnings(sampleAiPrototypeFixtureReplayReports);

function createModeFixtureReplayReport(
  modePlan: AiPrototypeModeIntegrationPlan,
  isMiniStar: boolean,
): AiPrototypeModeFixtureReplayReport {
  return {
    modeId: modePlan.modeId,
    parentEngine: modePlan.parentEngine,
    fixtureName: `${modePlan.modeId}-reviewed-unit-json-fixture`,
    replaySurface:
      "A non-student replay harness that passes reviewed JSON into the wrapper and captures parsed inputs plus emitted standard events.",
    inputAssertions: [
      "unit_meta.game_mode matches requested mode",
      "unit_meta.engine_id matches parent engine",
      "pedagogical_payload.vocabulary_terms is read from fixture",
      "pedagogical_payload.target_sentences is read from fixture",
      "audio_cues are referenced by text and language",
      "tenant theme tokens are injected, not hard-coded",
      ...(isMiniStar ? ["ja-hiragana support language remains support-only"] : []),
    ],
    outputAssertions: [
      "game_started emitted after fixture load",
      "round_shown emitted with fixture-derived terms or sentences",
      "audio_requested emitted for target-language text",
      "answer_submitted emitted with learner interaction metadata only",
      "answer_result emitted without direct score authority",
      "game_completed emitted without reward inventory writes",
    ],
    replayEvidence: [
      "Fixture parse result",
      "Parsed term count",
      "Parsed target sentence count",
      "Audio cue request sample",
      "Standard event log sample",
      "Tenant theme injection sample",
    ],
    failureTriggers: [
      "Hard-coded vocabulary or sentence text",
      "Hard-coded tenant, mascot, media, or theme token",
      "Missing target-language audio cue request",
      "Support-language progress trigger",
      "Score or reward write inside prototype",
      "Route or assignment side effect",
    ],
  };
}

export function filterAiPrototypeFixtureReplayReportsByTenant(
  reports: AiPrototypeFixtureReplayReport[],
  tenantId: string,
): AiPrototypeFixtureReplayReport[] {
  return reports.filter((report) => report.tenantId === tenantId);
}
