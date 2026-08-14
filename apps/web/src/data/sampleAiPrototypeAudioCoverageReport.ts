import { sampleAiGeneratorAudioCoveragePlans } from "@/data/sampleAiGeneratorAudioCoveragePlan";
import {
  sampleAiPrototypeIntegrationPlans,
  type AiPrototypeModeIntegrationPlan,
} from "@/data/sampleAiPrototypeIntegrationPlan";
import {
  getAiPrototypeAudioCoverageReportCollectionWarnings,
  validateAiPrototypeAudioCoverageReports,
  type AiPrototypeAudioCoverageReport as SharedAiPrototypeAudioCoverageReport,
  type AiPrototypeAudioCoverageReportStatus,
  type AiPrototypeAudioCueKind,
  type AiPrototypeModeAudioCoverageReport as SharedAiPrototypeModeAudioCoverageReport,
} from "@living-textbook/content-model/src/aiPrototypeAudioCoverageReport";

export type AiPrototypeModeAudioCoverageReport = SharedAiPrototypeModeAudioCoverageReport;
export type AiPrototypeAudioCoverageReport = SharedAiPrototypeAudioCoverageReport;
export type { AiPrototypeAudioCoverageReportStatus };

const requiredCueKinds: AiPrototypeAudioCueKind[] = ["term", "sentence", "instruction", "feedback", "control"];

export const sampleAiPrototypeAudioCoverageReports: AiPrototypeAudioCoverageReport[] =
  sampleAiPrototypeIntegrationPlans.map((plan) => {
    const audioPlan = sampleAiGeneratorAudioCoveragePlans.find((candidate) => candidate.requestId === plan.requestId);
    const isMiniStar = plan.tenantId === "ministar";

    return {
      reportId: `prototype-audio-coverage-report-${plan.requestId}`,
      tenantId: plan.tenantId,
      requestId: plan.requestId,
      integrationPlanId: plan.planId,
      label: isMiniStar ? "MiniStar prototype audio coverage report" : "AI prototype audio coverage report",
      status: "not-run",
      summary:
        "Review-only tap-to-speak and replay-audio checklist for proving that a returned prototype covers every learner-facing target-language text before integration.",
      sourceRecords: [
        "prototype_audio_coverage_report",
        "prototype_event_replay_report",
        "prototype_fixture_replay_report",
        "ai_audio_coverage_plan",
        "audio_cue_manifest",
        "package_game_audio_coverage",
        "background_media_policy_binding",
      ],
      targetLanguage: audioPlan?.targetLanguage ?? "English",
      assistLanguagePolicy:
        audioPlan?.assistLanguagePolicy ??
        "Support-language audio is optional, teacher-enabled, support-only, and cannot unlock progress.",
      learningAudioPriorityRule:
        audioPlan?.learningAudioPriorityRule ??
        "Learning audio wins over background music, video sound, support-language prompts, and decorative media.",
      coveragePurpose: [
        "Confirm every target-language vocabulary term has a tap-to-speak cue.",
        "Confirm every target sentence has replay audio before syntax or speaking play.",
        "Confirm all instructions, feedback lines, and critical controls have accessible replay support.",
        "Confirm audio_requested events are emitted without writing progress, score, reward, route, playlist, or report state.",
        "Confirm support-language audio and background media remain support-only.",
      ],
      requiredCueFamilies: [
        "Term audio",
        "Sentence audio",
        "Instruction audio",
        "Feedback audio",
        "Critical control audio",
      ],
      coverageChecks: [
        "No target-language text without audio",
        "Tap-to-speak coverage is present for learner text",
        "Submit controls have separate listen or replay controls where needed",
        "Audio cues reference the shared audio_cue_manifest",
        "Audio events are support evidence, not score authority",
        "Background media never overrides learning audio",
        ...(isMiniStar ? ["Foundation Japanese support remains hiragana-only and support-only"] : []),
      ],
      blockedActions: [
        "No audio manifest mutation from prototype",
        "No generated voice call",
        "No voice API cost",
        "No media-only mastery",
        "No support-language progress trigger",
        "No playlist write",
        "No package audio-complete marker",
        "No student assignment",
        ...(isMiniStar ? ["No Japanese support-language audio can unlock English progress"] : []),
      ],
      modeReports: plan.modePlans.map((modePlan) => createModeAudioCoverageReport(modePlan, isMiniStar)),
    };
  });

export const sampleAiPrototypeAudioCoverageReportErrors = validateAiPrototypeAudioCoverageReports(
  sampleAiPrototypeAudioCoverageReports,
);

export const sampleAiPrototypeAudioCoverageReportWarnings =
  getAiPrototypeAudioCoverageReportCollectionWarnings(sampleAiPrototypeAudioCoverageReports);

function createModeAudioCoverageReport(
  modePlan: AiPrototypeModeIntegrationPlan,
  isMiniStar: boolean,
): AiPrototypeModeAudioCoverageReport {
  const isSpeakingMode = modePlan.modeId === "speak-it";

  return {
    modeId: modePlan.modeId,
    parentEngine: modePlan.parentEngine,
    audioHarness:
      "A non-student audio replay harness that taps terms, sentences, instructions, feedback, and critical controls while capturing audio_requested events only.",
    requiredCueKinds,
    targetLanguageAudioChecks: [
      "Vocabulary tiles request target-language term audio.",
      "Sentence prompts request target-language sentence audio.",
      "Instructions can be tapped or replayed without advancing progress.",
      "Feedback audio is supportive and never a standalone score event.",
      ...(isSpeakingMode
        ? ["Speech matching prompts require replay audio before microphone scoring can be considered."]
        : []),
    ],
    controlAudioChecks: [
      "Start, submit, retry, and next controls have visible text and a separate listen or replay pathway where age-appropriate.",
      "No critical button hides its text or depends on color alone.",
      "Audio playback never blocks the target-language answer interaction.",
    ],
    supportLanguageRules: [
      "Support-language cues are marked support-only.",
      "Support-language cues cannot emit mastery_updated.",
      "Background music and video sound duck or pause for learning audio.",
      ...(isMiniStar ? ["Japanese support audio remains hiragana-only for Foundation/Bronze/Plus levels."] : []),
    ],
    replayEvidence: [
      "Tap-to-speak coverage snapshot",
      "Audio cue manifest reference sample",
      "audio_requested event log sample",
      "Missing cue list",
      "Control replay audit",
      "Background media conflict check",
    ],
    failureTriggers: [
      "Target-language text appears without audio coverage.",
      "Critical control lacks visible text or replay audio.",
      "Prototype generates voice or triggers billable API use.",
      "Support-language audio unlocks progress.",
      "Media-only listening counts toward mastery.",
      "Prototype mutates audio manifest, playlist, route, score, reward, report, or assignment state.",
    ],
  };
}

export function filterAiPrototypeAudioCoverageReportsByTenant(
  reports: AiPrototypeAudioCoverageReport[],
  tenantId: string,
): AiPrototypeAudioCoverageReport[] {
  return reports.filter((report) => report.tenantId === tenantId);
}
