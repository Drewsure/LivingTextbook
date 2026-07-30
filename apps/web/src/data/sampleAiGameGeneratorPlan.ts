export type AiGameGeneratorStatus = "draft-only" | "blocked" | "premium-gated";

export interface AiGameGeneratorRequest {
  requestId: string;
  tenantId: string;
  label: string;
  targetLevel: number;
  unitTheme: string;
  targetLanguage: string;
  assistLanguagePolicy: string;
  requestedModes: string[];
  generatorInputs: string[];
  outputDraftRecords: string[];
  verifierChecks: string[];
  blockedActions: string[];
  costGate: string;
  pathwayRule: string;
  audioRule: string;
  status: AiGameGeneratorStatus;
}

export interface AiGameGeneratorPlan {
  planId: string;
  label: string;
  summary: string;
  releaseRule: string;
  modelUseRule: string;
  acceptedInputs: string[];
  requiredOutputRules: string[];
  blockedActions: string[];
  requests: AiGameGeneratorRequest[];
}

export const sampleAiGameGeneratorPlan: AiGameGeneratorPlan = {
  planId: "ai-teaching-game-generator-foundation",
  label: "AI teaching game generator",
  summary:
    "A teacher/admin preview for turning reviewed source material into draft game-package requests. The generator creates draft package data, verifier submissions, audio plans, and curated activity pathway proposals; it does not publish games, write student routes, or call a live model in this foundation scaffold.",
  releaseRule:
    "Generated content remains Draft only until source lineage, schema, pedagogy, target-language audio, assist-language, rights, pathway compatibility, teacher approval, package publish, and launch-safety gates pass.",
  modelUseRule:
    "No live model call is made in the foundation preview. Schools and tenants must opt into AI generation, speech scoring, or tutor features as a premium package with API cost controls.",
  acceptedInputs: [
    "Reviewed source queue item",
    "Teacher-entered text or table",
    "PDF/DOCX extraction evidence packet",
    "Partner-provided audio, music, video, image, or worksheet metadata",
    "Tenant content rules and visual blacklist rules",
    "Approved game mode catalog entry",
  ],
  requiredOutputRules: [
    "8 default vocabulary terms",
    "8-12 allowed terms when a unit genuinely requires extension",
    "Exactly 2 target sentence structures",
    "JSON-first draft package payload",
    "Curated activity pathway rather than switch-to-anything",
    "Every target-language text needs audio",
    "Support language cannot unlock progress",
    "Teacher Launch Protocol required",
    "Verifier packet required before package review",
  ],
  blockedActions: [
    "No direct AI publish",
    "No live model call",
    "No student assignment",
    "No unreviewed activity conversion",
    "No support-language-only progression",
    "No generated media prompt as production artwork",
    "No API cost without tenant approval",
  ],
  requests: [
    {
      requestId: "sample-publisher-l1-routines-game-draft",
      tenantId: "sample-publisher",
      label: "Sample publisher daily routines game draft",
      targetLevel: 1,
      unitTheme: "Daily Routines",
      targetLanguage: "English",
      assistLanguagePolicy: "No assist language for this sample package unless the tenant supplies reviewed support text.",
      requestedModes: ["Flashcards", "Memory Match", "Sentence Builder"],
      generatorInputs: [
        "Partner textbook sample unit PDF",
        "Teacher-entered eight-term vocabulary list",
        "Partner audio and chant folder metadata",
        "Partner video folder metadata",
        "Sample publisher visual rules",
      ],
      outputDraftRecords: [
        "teacher_draft_package",
        "teacher_draft_verifier_submission",
        "activity_compatibility_snapshot",
        "package_game_audio_coverage",
        "media_playlist_binding",
      ],
      verifierChecks: [
        "Schema and pedagogy check",
        "Target-language audio coverage check",
        "Media rights and manifest check",
        "Curated activity pathway check",
        "Teacher/package approval check",
      ],
      blockedActions: [
        "No automatic PDF-to-game publish",
        "No playlist creation from uploaded media",
        "No route creation from the draft request",
        "No student assignment from generated draft",
      ],
      costGate: "API cost package gate: disabled until the tenant selects an AI generation package.",
      pathwayRule: "Curated activity pathway: Flashcards first, Memory Match second, Sentence Builder after vocabulary confidence.",
      audioRule: "Every target-language term, sentence, instruction, feedback line, and action label needs audio before student use.",
      status: "draft-only",
    },
    {
      requestId: "ministar-l1-greetings-game-draft",
      tenantId: "ministar",
      label: "MiniStar greetings entry-sequence draft",
      targetLevel: 1,
      unitTheme: "Greetings",
      targetLanguage: "English",
      assistLanguagePolicy:
        "Japanese support is teacher-enabled only. Foundation, Bronze, and Plus support text must be hiragana-only and cannot trigger progress.",
      requestedModes: ["Flashcards", "Memory Match", "Speak It"],
      generatorInputs: [
        "MiniStar master curriculum DOCX extraction packet",
        "Eight canonical greeting terms",
        "Reviewed teacher launch protocol",
        "MiniStar tenant avatar and reward rules",
      ],
      outputDraftRecords: [
        "teacher_draft_package",
        "teacher_draft_verifier_submission",
        "activity_compatibility_snapshot",
        "package_game_audio_coverage",
      ],
      verifierChecks: [
        "MiniStar tenant visual rule check",
        "Hiragana-only assist-language check",
        "Target-language audio coverage check",
        "Speaking mode microphone policy check",
      ],
      blockedActions: [
        "No direct AI publish",
        "No support-language unlock event",
        "No microphone scoring without teacher approval",
        "No generated avatar art as tenant-standard artwork",
      ],
      costGate: "AI drafting can be enabled for MiniStar later, but speech scoring and AI Tutor remain premium-gated.",
      pathwayRule: "Curated activity pathway: entry flashcards, Memory Match reinforcement, then Speak It with teacher microphone approval.",
      audioRule: "English is the target-language trigger; Japanese support audio is support-only.",
      status: "draft-only",
    },
    {
      requestId: "upper-level-ai-tutor-role-play-draft",
      tenantId: "sample-publisher",
      label: "Upper-level AI tutor role-play draft",
      targetLevel: 7,
      unitTheme: "Opinions and reasons",
      targetLanguage: "English",
      assistLanguagePolicy: "Assist language remains optional support; target-language responses drive progress.",
      requestedModes: ["Speak It", "Mystery Detective", "AI Tutor role play"],
      generatorInputs: [
        "Reviewed upper-level unit package",
        "Teacher-approved conversation objective",
        "Tenant AI Tutor entitlement",
        "Transcript retention policy",
        "Usage-limit policy",
      ],
      outputDraftRecords: [
        "teacher_draft_package",
        "teacher_draft_verifier_submission",
        "ai_tutor_entitlement_packet",
        "package_game_audio_coverage",
      ],
      verifierChecks: [
        "Teacher/school AI approval check",
        "Usage and cost limit check",
        "Transcript privacy check",
        "Safety prompt and escalation check",
      ],
      blockedActions: [
        "No AI Tutor activation",
        "No microphone or transcript storage",
        "No adaptive progression from unreviewed tutor output",
        "No premium upsell shown to children",
      ],
      costGate: "API cost package gate: premium AI Tutor is optional and disabled unless the school adopts it.",
      pathwayRule: "Curated activity pathway: reviewed speaking practice first, then teacher-approved AI Tutor only for upper levels.",
      audioRule: "Tutor prompts, retry prompts, feedback, and teacher summaries require reviewed audio/transcript policy before launch.",
      status: "premium-gated",
    },
  ],
};

export function filterAiGameGeneratorRequestsByTenant(
  plan: AiGameGeneratorPlan,
  tenantId: string,
): AiGameGeneratorRequest[] {
  return plan.requests.filter((request) => request.tenantId === tenantId);
}

export function countAiGameGeneratorRequestsByStatus(
  plan: AiGameGeneratorPlan,
  status: AiGameGeneratorStatus,
): number {
  return plan.requests.filter((request) => request.status === status).length;
}
