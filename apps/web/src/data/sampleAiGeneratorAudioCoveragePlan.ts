export type AiGeneratorAudioCoverageStatus = "required-not-approved" | "planned" | "support-only" | "blocked";

export type AiGeneratorAudioCueKind =
  | "term"
  | "sentence"
  | "instruction"
  | "feedback"
  | "control"
  | "support-language"
  | "background-media";

export interface AiGeneratorAudioCuePlan {
  cueId: string;
  kind: AiGeneratorAudioCueKind;
  label: string;
  text: string;
  language: string;
  modeScope: string;
  status: AiGeneratorAudioCoverageStatus;
  progressPolicy: string;
  reviewNote: string;
}

export interface AiGeneratorAudioCoveragePlan {
  planId: string;
  requestId: string;
  tenantId: string;
  label: string;
  summary: string;
  targetLanguage: string;
  assistLanguagePolicy: string;
  learningAudioPriorityRule: string;
  requiredRecords: string[];
  blockedActions: string[];
  cues: AiGeneratorAudioCuePlan[];
}

export const sampleAiGeneratorAudioCoveragePlans: AiGeneratorAudioCoveragePlan[] = [
  {
    planId: "audio-plan-sample-publisher-ai-game-request-v1",
    requestId: "sample-publisher-l1-routines-game-draft",
    tenantId: "sample-publisher",
    label: "Sample publisher AI audio coverage plan",
    summary:
      "Review-only plan for the audio cues a generated Daily Routines package must carry before it can become a student route.",
    targetLanguage: "English",
    assistLanguagePolicy: "No support language for this sample. Any future support audio remains support-only and non-scoring.",
    learningAudioPriorityRule:
      "Learning audio wins over background music, video sound, support-language prompts, and decorative media in every generated game.",
    requiredRecords: [
      "ai_audio_coverage_plan",
      "package_game_audio_coverage",
      "audio_cue_manifest",
      "background_media_policy_binding",
      "teacher_draft_verifier_submission",
    ],
    blockedActions: [
      "Generate target audio blocked",
      "Use synthetic voice blocked",
      "Attach media as learning audio blocked",
      "Mark package audio-complete blocked",
      "Student route creation blocked",
      "API voice cost blocked",
    ],
    cues: [
      {
        cueId: "audio-term-wake-up",
        kind: "term",
        label: "Term audio",
        text: "wake up",
        language: "en",
        modeScope: "Flashcards, Memory Match, Sentence Builder",
        status: "required-not-approved",
        progressPolicy: "Target-language cue supports progress only after review.",
        reviewNote: "Needs approved teacher, partner, or fallback voice before student use.",
      },
      {
        cueId: "audio-term-brush",
        kind: "term",
        label: "Term audio",
        text: "brush",
        language: "en",
        modeScope: "Flashcards, Memory Match, Sentence Builder",
        status: "required-not-approved",
        progressPolicy: "Target-language cue supports progress only after review.",
        reviewNote: "Needs approved teacher, partner, or fallback voice before student use.",
      },
      {
        cueId: "audio-sentence-i-wake-up",
        kind: "sentence",
        label: "Sentence audio",
        text: "I wake up in the morning.",
        language: "en",
        modeScope: "Sentence Builder, Speak It candidate",
        status: "required-not-approved",
        progressPolicy: "Correct English sentence activity is the progress trigger.",
        reviewNote: "Sentence audio must match the reviewed target sentence exactly.",
      },
      {
        cueId: "audio-sentence-i-brush",
        kind: "sentence",
        label: "Sentence audio",
        text: "I brush my teeth, please.",
        language: "en",
        modeScope: "Sentence Builder, Speak It candidate",
        status: "required-not-approved",
        progressPolicy: "Correct English sentence activity is the progress trigger.",
        reviewNote: "Sentence audio must match the reviewed target sentence exactly.",
      },
      {
        cueId: "audio-instruction-tap-cards",
        kind: "instruction",
        label: "Instruction audio",
        text: "Tap each card. Listen and repeat.",
        language: "en",
        modeScope: "Entry Flashcards",
        status: "required-not-approved",
        progressPolicy: "Instruction audio helps access but does not unlock by itself.",
        reviewNote: "Instruction must be available through tap-to-speak.",
      },
      {
        cueId: "audio-instruction-match-pairs",
        kind: "instruction",
        label: "Instruction audio",
        text: "Find the matching words.",
        language: "en",
        modeScope: "Memory Match",
        status: "required-not-approved",
        progressPolicy: "Instruction audio helps access but does not unlock by itself.",
        reviewNote: "Instruction must be available through tap-to-speak and replay.",
      },
      {
        cueId: "audio-feedback-try-again",
        kind: "feedback",
        label: "Feedback audio",
        text: "Try again.",
        language: "en",
        modeScope: "All generated student games",
        status: "planned",
        progressPolicy: "Feedback audio is supportive and never a standalone scoring event.",
        reviewNote: "Shared engine feedback voice can cover repeated controls if tenant-approved.",
      },
      {
        cueId: "audio-control-ready-next",
        kind: "control",
        label: "Control audio",
        text: "Ready for the next activity.",
        language: "en",
        modeScope: "Curated pathway unlock controls",
        status: "required-not-approved",
        progressPolicy: "Control replay supports navigation but does not replace the English answer event.",
        reviewNote: "Critical buttons need separate listen/replay controls for young learners.",
      },
      {
        cueId: "audio-support-language-none",
        kind: "support-language",
        label: "Support audio",
        text: "Support language not supplied for this sample.",
        language: "support",
        modeScope: "Optional teacher setting",
        status: "support-only",
        progressPolicy: "Support-language audio cannot unlock progress.",
        reviewNote: "If added later, support-language cues must remain labelled and non-scoring.",
      },
      {
        cueId: "audio-background-media-policy",
        kind: "background-media",
        label: "Background media policy",
        text: "Background music may play only when it does not obscure learning audio.",
        language: "policy",
        modeScope: "Optional media playlist",
        status: "blocked",
        progressPolicy: "Media-only listening cannot count toward mastery.",
        reviewNote: "Background media needs teacher opt-in and ducking/mute behavior before use.",
      },
    ],
  },
];

export function filterAiGeneratorAudioCoveragePlansByTenant(
  plans: AiGeneratorAudioCoveragePlan[],
  tenantId: string,
): AiGeneratorAudioCoveragePlan[] {
  return plans.filter((plan) => plan.tenantId === tenantId);
}
