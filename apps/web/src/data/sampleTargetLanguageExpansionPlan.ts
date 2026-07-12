export type TargetLanguageExpansionStatus = "ready" | "planned" | "blocked" | "optional";
export type TargetLanguageExpansionOwner = "platform" | "tenant-admin" | "teacher" | "verifier";

export interface TargetLanguageExpansionLane {
  laneId: string;
  label: string;
  owner: TargetLanguageExpansionOwner;
  status: TargetLanguageExpansionStatus;
  purpose: string;
  requiredCapabilities: string[];
  notSolvedBy: string[];
  nextStep: string;
}

export interface TargetLanguageExpansionGate {
  gateId: string;
  label: string;
  status: TargetLanguageExpansionStatus;
  protects: string;
  evidence: string;
  blocksPilot: boolean;
  nextStep: string;
}

export interface TargetLanguageExpansionPlan {
  planId: string;
  tenantId: string;
  label: string;
  summary: string;
  currentDecision: string;
  lanes: TargetLanguageExpansionLane[];
  gates: TargetLanguageExpansionGate[];
}

export const sampleTargetLanguageExpansionPlan: TargetLanguageExpansionPlan = {
  planId: "sample-publisher-target-language-expansion",
  tenantId: "sample-publisher",
  label: "Target language expansion",
  summary:
    "Japanese as target language is a plausible white-label opportunity, but it is not the same feature as MiniStar Japanese assist. Target-language support must be configured, reviewed, audio-backed, segmented correctly, and verified before a Japanese-learning pilot.",
  currentDecision:
    "Assist language is not target language. For MiniStar English, English remains the progression trigger. For a future Japanese-learning tenant, Japanese becomes the target-language trigger and English or another language can become assist support.",
  lanes: [
    {
      laneId: "target-language-config",
      label: "Target language configuration",
      owner: "platform",
      status: "planned",
      purpose: "Represent target language, default UI language, and assist languages separately in tenant and package data.",
      requiredCapabilities: ["Target language field", "Assist language list", "Per-package review status", "Progression trigger role"],
      notSolvedBy: ["Japanese assist glosses", "UI translation", "Live AI translation"],
      nextStep: "Promote explicit target-language and assist-language progression-role fields into package manifests before a non-English pilot.",
    },
    {
      laneId: "japanese-script-policy",
      label: "Japanese script policy",
      owner: "verifier",
      status: "planned",
      purpose: "Make hiragana, katakana, kanji, and optional furigana/ruby display rules reviewable by level and tenant.",
      requiredCapabilities: ["Hiragana policy", "Katakana policy", "Kanji policy", "Furigana or ruby display", "Level-band script rules"],
      notSolvedBy: ["Plain English word cards", "MiniStar support-only hiragana text"],
      nextStep: "Define script policy fields and verifier rules for Japanese target-language packages.",
    },
    {
      laneId: "segmentation-policy",
      label: "Segmentation policy",
      owner: "platform",
      status: "blocked",
      purpose: "Prevent English whitespace tokenization from being reused for Japanese activities where particles, phrases, or kana sequences need different boundaries.",
      requiredCapabilities: ["Phrase segmentation", "Particle handling", "Sentence-builder token policy", "Text-spelling engine language adapter"],
      notSolvedBy: ["Splitting target sentences on spaces", "Reusing English-only word tile logic"],
      nextStep: "Add a language-aware tokenization adapter before Japanese Sentence Builder, typing, or text puzzle modes.",
    },
    {
      laneId: "audio-pronunciation",
      label: "Audio and pronunciation",
      owner: "tenant-admin",
      status: "planned",
      purpose: "Ensure Japanese learner text has reviewed native audio or approved TTS, and that any speech matching uses the correct target-language model.",
      requiredCapabilities: ["Japanese audio cues", "Native or approved TTS source", "Pronunciation provider decision", "Teacher approval"],
      notSolvedBy: ["English audio cues", "Support-language listen taps"],
      nextStep: "Add provider selection and cost/usage policy before active Japanese speech games.",
    },
    {
      laneId: "typing-input",
      label: "Kana and kanji input",
      owner: "platform",
      status: "planned",
      purpose: "Support IME input, kana/kanji answers, answer normalization, and child-safe feedback for Japanese typing or spelling tasks.",
      requiredCapabilities: ["IME-safe input", "Kana normalization", "Accepted answer variants", "Reviewed hints"],
      notSolvedBy: ["English spelling input", "Case-insensitive English matching"],
      nextStep: "Scope normalization and accepted-answer rules before Japanese Type Answer or spelling modes.",
    },
    {
      laneId: "handwriting-stroke-order",
      label: "Handwriting and stroke order",
      owner: "teacher",
      status: "optional",
      purpose: "Preserve handwriting and stroke-order games as a future premium/tenant-specific lane, not a v1 blocker.",
      requiredCapabilities: ["Stroke data source", "Canvas input", "Teacher grading policy", "Device support review"],
      notSolvedBy: ["Text typing", "Speech matching"],
      nextStep: "Revisit only after the core target-language package and text-spelling engine support Japanese reliably.",
    },
  ],
  gates: [
    {
      gateId: "assist-target-separation",
      label: "Assist language is not target language",
      status: "ready",
      protects: "Support-language taps cannot unlock target-language progress, and Japanese assist does not imply Japanese-learning readiness.",
      evidence: "Existing target-language entry gate and assist-language standard separate support-only signals from mastery events.",
      blocksPilot: false,
      nextStep: "Keep this visible in `/teacher/intake` and package review until the fields are durable.",
    },
    {
      gateId: "target-language-trigger",
      label: "Target-language trigger",
      status: "ready",
      protects: "The configured target language, not the support language, controls progression and mastery.",
      evidence: "MiniStar sample uses English as the trigger; future Japanese tenants must invert this through configuration.",
      blocksPilot: false,
      nextStep: "Move the trigger role from sample behavior into package data before real tenant onboarding.",
    },
    {
      gateId: "furigana-rendering",
      label: "Furigana rendering",
      status: "planned",
      protects: "Young Japanese learners can see reviewed reading support without corrupting layout or audio cue mapping.",
      evidence: "Current app does not yet render ruby/furigana patterns for target-language activities.",
      blocksPilot: true,
      nextStep: "Prototype ruby rendering in a controlled text component before Japanese target-language routes.",
    },
    {
      gateId: "segmentation-engine",
      label: "Segmentation policy",
      status: "blocked",
      protects: "Sentence Builder, typing, puzzles, and quiz distractors do not rely on English-only whitespace splitting.",
      evidence: "Current Sentence Builder is suitable for English sample sentences only.",
      blocksPilot: true,
      nextStep: "Add language-aware segmentation contracts and fixtures before Japanese target-language games.",
    },
    {
      gateId: "teacher-review",
      label: "Teacher-reviewed Japanese curriculum",
      status: "planned",
      protects: "Japanese target-language packages follow school-specific pedagogy instead of raw translation.",
      evidence: "The platform has review gates, but no Japanese target-language curriculum package yet.",
      blocksPilot: true,
      nextStep: "Require a reviewed Japanese package, script policy, audio plan, and target-language game offer map for any pilot.",
    },
  ],
};
