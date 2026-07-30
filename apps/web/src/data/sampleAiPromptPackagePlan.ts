export type AiPromptPackageStatus = "draft-only" | "premium-disabled" | "blocked";

export interface AiPromptInputSlot {
  slotId: string;
  label: string;
  value: string;
  required: boolean;
  rule: string;
  status: AiPromptPackageStatus;
}

export interface AiPromptOutputLock {
  lockId: string;
  label: string;
  requirement: string;
  rejectIfMissing: boolean;
}

export interface AiPromptCostControl {
  controlId: string;
  label: string;
  status: AiPromptPackageStatus;
  policy: string;
}

export interface AiPromptPackagePlan {
  promptPackageId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  templateVersion: string;
  promptFamily: string;
  modelUseState: string;
  packageTier: string;
  inputSlots: AiPromptInputSlot[];
  outputLocks: AiPromptOutputLock[];
  costControls: AiPromptCostControl[];
  tenantRules: string[];
  blockedActions: string[];
}

export const sampleAiPromptPackagePlans: AiPromptPackagePlan[] = [
  {
    promptPackageId: "prompt-package-sample-publisher-game-draft-v1",
    tenantId: "sample-publisher",
    requestId: "sample-publisher-l1-routines-game-draft",
    label: "Sample publisher generator prompt package",
    summary:
      "Versioned prompt-package preview for future AI-generated game drafts. It locks inputs, output schema, tenant rules, and cost controls before any live model use exists.",
    templateVersion: "ai-generator-prompt-v2026.07.foundation",
    promptFamily: "Living Textbook game package draft",
    modelUseState: "Model use disabled until tenant AI package approval",
    packageTier: "premium-disabled",
    inputSlots: [
      {
        slotId: "source-evidence",
        label: "Source evidence packet",
        value: "source_extraction_review_packet",
        required: true,
        rule: "Only reviewed extraction evidence can seed a prompt.",
        status: "draft-only",
      },
      {
        slotId: "target-level",
        label: "Target level",
        value: "Level 1",
        required: true,
        rule: "Vocabulary and syntax must match the learner level.",
        status: "draft-only",
      },
      {
        slotId: "unit-theme",
        label: "Unit theme",
        value: "Daily Routines",
        required: true,
        rule: "The theme controls vocabulary, sentence structures, game choices, and media suggestions.",
        status: "draft-only",
      },
      {
        slotId: "curated-pathway",
        label: "Curated pathway",
        value: "Flashcards -> Memory Match -> Sentence Builder",
        required: true,
        rule: "Prompt may recommend reviewed pathways only, not switch-to-anything activity panels.",
        status: "draft-only",
      },
      {
        slotId: "audio-plan",
        label: "Audio coverage plan",
        value: "ai_audio_coverage_plan",
        required: true,
        rule: "Every learner-facing target-language text item must map to a future cue.",
        status: "blocked",
      },
      {
        slotId: "tenant-rules",
        label: "Tenant brand rules",
        value: "sample-publisher visual and content rules",
        required: true,
        rule: "White-label tenants own brand, mascot, blacklist, voice, and support-language policy.",
        status: "draft-only",
      },
    ],
    outputLocks: [
      {
        lockId: "json-schema-lock",
        label: "JSON schema lock",
        requirement: "Output must be a raw JSON draft package with no markdown or conversational filler.",
        rejectIfMissing: true,
      },
      {
        lockId: "vocabulary-range-lock",
        label: "Vocabulary range lock",
        requirement: "Default 8 vocabulary terms, with 8-12 allowed only when reviewed source requires extension.",
        rejectIfMissing: true,
      },
      {
        lockId: "sentence-count-lock",
        label: "Sentence count lock",
        requirement: "Exactly 2 target sentence structures.",
        rejectIfMissing: true,
      },
      {
        lockId: "teacher-launch-lock",
        label: "Teacher Launch Protocol lock",
        requirement: "Hook, activity, and review copy are required for every generated unit.",
        rejectIfMissing: true,
      },
      {
        lockId: "audio-manifest-lock",
        label: "Audio cue manifest lock",
        requirement: "Output must name target-language term, sentence, instruction, feedback, and control audio needs.",
        rejectIfMissing: true,
      },
    ],
    costControls: [
      {
        controlId: "usage-budget",
        label: "Usage budget required",
        status: "blocked",
        policy: "No API cost without tenant approval.",
      },
      {
        controlId: "model-choice",
        label: "Model choice review required",
        status: "blocked",
        policy: "Live model choice must be approved for quality, latency, privacy, and price before enablement.",
      },
      {
        controlId: "voice-generation",
        label: "Voice generation separate package",
        status: "premium-disabled",
        policy: "Synthetic voice generation is separate from text generation and remains disabled.",
      },
      {
        controlId: "prompt-logging",
        label: "Prompt logging policy required",
        status: "blocked",
        policy: "Prompt and output retention policy must be accepted before storage.",
      },
    ],
    tenantRules: [
      "Tenant brand rules are input data, not hard-coded global code.",
      "No MiniStar mascot hard-coding inside the white-label prompt package.",
      "Visual blacklist rules remain tenant-configurable.",
      "No raw student data in prompt.",
      "No prompt edits by students.",
      "No child-facing premium upsell.",
    ],
    blockedActions: [
      "Run prompt blocked",
      "Change prompt template live blocked",
      "Save generated answer as package blocked",
      "Bill tenant blocked",
      "Generate voice from prompt blocked",
      "Send draft to students blocked",
    ],
  },
  {
    promptPackageId: "prompt-package-ministar-greetings-game-draft-v1",
    tenantId: "ministar",
    requestId: "ministar-l1-greetings-game-draft",
    label: "MiniStar generator prompt package",
    summary:
      "Versioned prompt-package preview for the MiniStar Level 1 greetings entry sequence. It uses MiniStar as the flagship tenant while keeping all brand, mascot, support-language, and cost choices configurable.",
    templateVersion: "ai-generator-prompt-v2026.07.foundation",
    promptFamily: "Living Textbook game package draft",
    modelUseState: "Model use disabled until MiniStar AI package approval",
    packageTier: "premium-disabled",
    inputSlots: [
      {
        slotId: "source-evidence",
        label: "Source evidence packet",
        value: "source_extraction_review_packet",
        required: true,
        rule: "Only reviewed MiniStar DOCX extraction evidence can seed a prompt.",
        status: "draft-only",
      },
      {
        slotId: "target-level",
        label: "Target level",
        value: "Level 1",
        required: true,
        rule: "Foundation vocabulary must stay concrete, short, audio-supported, and teacher-led.",
        status: "draft-only",
      },
      {
        slotId: "unit-theme",
        label: "Unit theme",
        value: "Greetings",
        required: true,
        rule: "The theme controls the eight canonical terms, two target sentences, pathway, and audio needs.",
        status: "draft-only",
      },
      {
        slotId: "curated-pathway",
        label: "Curated pathway",
        value: "Flashcards -> Memory Match -> Speak It",
        required: true,
        rule: "Prompt may recommend reviewed MiniStar pathways only, not a broad switch panel.",
        status: "draft-only",
      },
      {
        slotId: "assist-language",
        label: "Assist language policy",
        value: "Japanese support is hiragana-only for Foundation/Bronze/Plus and cannot unlock progress.",
        required: true,
        rule: "English target-language events are the only progress trigger.",
        status: "draft-only",
      },
      {
        slotId: "audio-plan",
        label: "Audio coverage plan",
        value: "ai_audio_coverage_plan",
        required: true,
        rule: "Every learner-facing English term, sentence, instruction, feedback line, and action label must map to a future cue.",
        status: "blocked",
      },
    ],
    outputLocks: [
      {
        lockId: "json-schema-lock",
        label: "JSON schema lock",
        requirement: "Output must be a raw JSON draft package with no markdown or conversational filler.",
        rejectIfMissing: true,
      },
      {
        lockId: "vocabulary-range-lock",
        label: "Vocabulary range lock",
        requirement: "Default 8 vocabulary terms, with 8-12 allowed only when reviewed source requires extension.",
        rejectIfMissing: true,
      },
      {
        lockId: "sentence-count-lock",
        label: "Sentence count lock",
        requirement: "Exactly 2 target sentence structures.",
        rejectIfMissing: true,
      },
      {
        lockId: "target-language-progress-lock",
        label: "Target-language progress lock",
        requirement: "English answer events unlock progress; Japanese support text and audio remain support-only.",
        rejectIfMissing: true,
      },
      {
        lockId: "audio-manifest-lock",
        label: "Audio cue manifest lock",
        requirement: "Output must name target-language term, sentence, instruction, feedback, and control audio needs.",
        rejectIfMissing: true,
      },
    ],
    costControls: [
      {
        controlId: "usage-budget",
        label: "Usage budget required",
        status: "blocked",
        policy: "No API cost without MiniStar approval.",
      },
      {
        controlId: "model-choice",
        label: "Model choice review required",
        status: "blocked",
        policy: "Live model choice must be approved for quality, latency, privacy, and price before enablement.",
      },
      {
        controlId: "voice-generation",
        label: "Voice generation separate package",
        status: "premium-disabled",
        policy: "Synthetic voice generation, speech scoring, and AI Tutor remain separate premium options.",
      },
      {
        controlId: "prompt-logging",
        label: "Prompt logging policy required",
        status: "blocked",
        policy: "Prompt and output retention policy must be accepted before storage.",
      },
    ],
    tenantRules: [
      "MiniStar is the flagship tenant, not a global hard-code.",
      "Cloud Dog, Star Kid, avatar choice, and reward language remain tenant-configurable.",
      "Foundation/Bronze/Plus Japanese support must be hiragana-only.",
      "No raw student data in prompt.",
      "No prompt edits by students.",
      "No child-facing premium upsell.",
    ],
    blockedActions: [
      "Run prompt blocked",
      "Change prompt template live blocked",
      "Save generated answer as package blocked",
      "Bill tenant blocked",
      "Generate voice from prompt blocked",
      "Send draft to students blocked",
    ],
  },
];

export function filterAiPromptPackagePlansByTenant(
  plans: AiPromptPackagePlan[],
  tenantId: string,
): AiPromptPackagePlan[] {
  return plans.filter((plan) => plan.tenantId === tenantId);
}
