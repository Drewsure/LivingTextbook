export type AiGenerationRequestBuilderStatus = "ready-for-review" | "blocked";

export interface AiGenerationRequestField {
  fieldId: string;
  label: string;
  value: string;
  required: boolean;
  status: AiGenerationRequestBuilderStatus;
}

export interface AiGenerationRequestToggle {
  toggleId: string;
  label: string;
  enabled: boolean;
  policy: string;
}

export interface AiGenerationRequestBuilder {
  builderId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  fields: AiGenerationRequestField[];
  pathwayOptions: string[];
  safetyToggles: AiGenerationRequestToggle[];
  outputRecords: string[];
  blockedActions: string[];
}

export const sampleAiGenerationRequestBuilders: AiGenerationRequestBuilder[] = [
  {
    builderId: "builder-sample-publisher-ai-game-request-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher AI game request builder",
    summary:
      "A disabled setup form for a future teacher/admin generation request. It captures source evidence, level, theme, target language, support-language policy, curated modes, audio requirements, and AI package state before a draft can be generated.",
    fields: [
      {
        fieldId: "source-evidence-packet",
        label: "Source evidence packet",
        value: "source_extraction_review_packet: source-extract-sample-publisher-pdf-ocr-v1",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "target-level",
        label: "Target level",
        value: "Level 1",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "unit-theme",
        label: "Unit theme",
        value: "Daily Routines",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "target-language",
        label: "Target language",
        value: "English",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "assist-language-policy",
        label: "Assist language policy",
        value: "None for this sample; support language cannot unlock progress.",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "curated-mode-pathway",
        label: "Curated mode pathway",
        value: "Flashcards -> Memory Match -> Sentence Builder",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "audio-coverage-requirement",
        label: "Audio coverage requirement",
        value: "Every target-language term, sentence, instruction, feedback line, and action label.",
        required: true,
        status: "blocked",
      },
      {
        fieldId: "ai-package-state",
        label: "AI package state",
        value: "Premium AI generation disabled until tenant approval and API cost controls exist.",
        required: true,
        status: "blocked",
      },
    ],
    pathwayOptions: [
      "Flashcards first",
      "Memory Match second",
      "Sentence Builder after vocabulary confidence",
      "Printable vocabulary sheet as teacher option",
      "Speak It remains optional and teacher-gated",
    ],
    safetyToggles: [
      {
        toggleId: "target-language-progress",
        label: "Target-language progress trigger",
        enabled: true,
        policy: "English target-language actions may unlock progress after review.",
      },
      {
        toggleId: "support-language-progress",
        label: "Support-language progress trigger",
        enabled: false,
        policy: "Support language cannot unlock progress.",
      },
      {
        toggleId: "live-model-dispatch",
        label: "Live model dispatch",
        enabled: false,
        policy: "No live prompt dispatch in the foundation preview.",
      },
      {
        toggleId: "model-billing",
        label: "Model billing",
        enabled: false,
        policy: "No model billing without tenant approval.",
      },
    ],
    outputRecords: [
      "ai_generation_request_packet",
      "request_builder_review_packet",
      "premium_ai_cost_gate",
      "teacher_draft_package",
      "teacher_draft_verifier_submission",
      "activity_compatibility_snapshot",
      "package_game_audio_coverage",
    ],
    blockedActions: [
      "Generate draft blocked",
      "Estimate API cost blocked",
      "Submit request blocked",
      "No live prompt dispatch",
      "No model billing",
      "No route creation",
      "No student assignment",
    ],
  },
  {
    builderId: "builder-ministar-ai-game-request-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar AI game request builder",
    summary:
      "A disabled setup form for the MiniStar greetings generator request. It keeps the flagship tenant's entry sequence review-only while capturing source evidence, level, target language, hiragana-only support policy, curated modes, and audio requirements.",
    fields: [
      {
        fieldId: "source-evidence-packet",
        label: "Source evidence packet",
        value: "source_extraction_review_packet: source-extract-ministar-master-docx-manual-v1",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "target-level",
        label: "Target level",
        value: "Level 1",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "unit-theme",
        label: "Unit theme",
        value: "Greetings",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "target-language",
        label: "Target language",
        value: "English",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "assist-language-policy",
        label: "Assist language policy",
        value: "Japanese support is teacher-enabled, hiragana-only, and support-only for Foundation/Bronze/Plus.",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "curated-mode-pathway",
        label: "Curated mode pathway",
        value: "Flashcards -> Memory Match -> Speak It",
        required: true,
        status: "ready-for-review",
      },
      {
        fieldId: "audio-coverage-requirement",
        label: "Audio coverage requirement",
        value: "English term, sentence, instruction, feedback, and control audio before student use.",
        required: true,
        status: "blocked",
      },
      {
        fieldId: "ai-package-state",
        label: "AI package state",
        value: "AI drafting disabled until MiniStar authoring package approval; speech scoring and AI Tutor are separate premium options.",
        required: true,
        status: "blocked",
      },
    ],
    pathwayOptions: [
      "Flashcards first",
      "Memory Match second",
      "Speak It after teacher microphone approval",
      "Printable vocabulary sheet as teacher option",
      "Training Academy recovery lane after missed English target-language events",
    ],
    safetyToggles: [
      {
        toggleId: "target-language-progress",
        label: "Target-language progress trigger",
        enabled: true,
        policy: "English target-language actions may unlock progress after review.",
      },
      {
        toggleId: "support-language-progress",
        label: "Support-language progress trigger",
        enabled: false,
        policy: "Japanese support cannot unlock progress.",
      },
      {
        toggleId: "microphone-scoring",
        label: "Microphone scoring",
        enabled: false,
        policy: "Speech scoring requires teacher and school approval because it can affect cost and privacy.",
      },
      {
        toggleId: "live-model-dispatch",
        label: "Live model dispatch",
        enabled: false,
        policy: "No live prompt dispatch in the foundation preview.",
      },
    ],
    outputRecords: [
      "ai_generation_request_packet",
      "request_builder_review_packet",
      "premium_ai_cost_gate",
      "teacher_draft_package",
      "teacher_draft_verifier_submission",
      "activity_compatibility_snapshot",
      "package_game_audio_coverage",
    ],
    blockedActions: [
      "Generate draft blocked",
      "Estimate API cost blocked",
      "Submit request blocked",
      "No live prompt dispatch",
      "No model billing",
      "No microphone scoring",
      "No route creation",
      "No student assignment",
    ],
  },
];

export function filterAiGenerationRequestBuildersByTenant(
  builders: AiGenerationRequestBuilder[],
  tenantId: string,
): AiGenerationRequestBuilder[] {
  return builders.filter((builder) => builder.tenantId === tenantId);
}
