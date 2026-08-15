import type { FeaturePackageTier, GameFamily, GameModeId, ParentEngine } from "@living-textbook/content-model";

export type UnitGameOfferAvailability = "required" | "optional" | "premium" | "teacher-only" | "hidden" | "blocked";
export type UnitGameOfferReadiness = "ready" | "needs-review" | "blocked";

export interface UnitGameOffer {
  offerId: string;
  unitKey: string;
  unitLabel: string;
  gameMode: GameModeId;
  label: string;
  family: GameFamily;
  engineId: ParentEngine;
  availability: UnitGameOfferAvailability;
  readiness: UnitGameOfferReadiness;
  recommendedOrder?: number;
  packageTier: FeaturePackageTier;
  launchRoute?: string;
  audioRequirement: string;
  mediaRequirement: string;
  teacherControls: string[];
  evidence: string;
  nextStep: string;
  notAllowedYet: string[];
}

export interface UnitGameOfferMap {
  mapId: string;
  tenantId: string;
  contentPackageId: string;
  label: string;
  summary: string;
  decisionRule: string;
  offers: UnitGameOffer[];
}

export const sampleUnitGameOfferMap: UnitGameOfferMap = {
  mapId: "sample-publisher-unit-game-offers",
  tenantId: "sample-publisher",
  contentPackageId: "sample-publisher-l1-u1-package",
  label: "Unit-to-game offer map",
  summary:
    "Each textbook unit needs a reviewed game availability map so partners can maintain yearly game offers without one-off game pages or broken progress reporting.",
  decisionRule:
    "Every offered game must name its parent engine, access status, audio requirement, teacher controls, route expectation, and what is not allowed before pilot release.",
  offers: [
    {
      offerId: "partner-l1-u1-flashcards",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "flashcards",
      label: "Entry Flashcards",
      family: "vocabulary-matching",
      engineId: "pairing",
      availability: "required",
      readiness: "ready",
      recommendedOrder: 1,
      packageTier: "core",
      launchRoute: "/launch/partner-demo-unit-1",
      audioRequirement: "All vocabulary, target sentences, instructions, and completion controls need tap-to-hear audio.",
      mediaRequirement: "Can reference the unit playlist, but background music is not required for completion.",
      teacherControls: ["Teacher launch", "Entry-code optional", "Support language does not unlock progress"],
      evidence: "The current student launch flow already uses flashcards as the entry practice gate.",
      nextStep: "Promote this from sample data into the package manifest once persistence is selected.",
      notAllowedYet: ["Japanese/support-language-only completion", "Autoplay-only instructions", "Skipping audio support"],
    },
    {
      offerId: "partner-l1-u1-match-up",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "match-up",
      label: "Match Up",
      family: "vocabulary-matching",
      engineId: "pairing",
      availability: "required",
      readiness: "ready",
      recommendedOrder: 2,
      packageTier: "games",
      launchRoute: "/match/partner-demo-unit-1",
      audioRequirement: "Listening prompts, word cards, instructions, and feedback must stay tap-to-hear.",
      mediaRequirement: "Optional quiet background audio may be enabled only when teacher-controlled.",
      teacherControls: ["Unlock after entry practice", "Visible cards before hidden memory recall", "Progress event summary"],
      evidence: "Match Up uses the pairing parent engine as a visible listening-prompt-to-word-card route before Memory Match.",
      nextStep: "Use this as the default early-learner pairing offer before more difficult hidden-card modes.",
      notAllowedYet: ["Support-language-only matching", "Completion without target-language audio", "One-off pairing logic outside the parent engine"],
    },
    {
      offerId: "partner-l1-u1-memory-match",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "memory-match",
      label: "Memory Match",
      family: "memory-sorting",
      engineId: "pairing",
      availability: "required",
      readiness: "ready",
      recommendedOrder: 3,
      packageTier: "games",
      launchRoute: "/launch/partner-demo-unit-1",
      audioRequirement: "Cards remain tap-to-hear and answer feedback must stay audio-supported.",
      mediaRequirement: "Optional quiet background audio may be enabled only when teacher-controlled.",
      teacherControls: ["Unlock after entry practice", "Training Academy recommendation on repeated misses", "Progress event summary"],
      evidence: "Memory Match already emits standard game and answer events in the foundation slice.",
      nextStep: "Use this as the first reusable pairing-engine offer template for future publisher units.",
      notAllowedYet: ["Standalone game route without launch session", "Completion without progress event", "Mode-specific hard-coded scoring"],
    },
    {
      offerId: "partner-l1-u1-speak-it",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "speak-it",
      label: "Speak It Practice",
      family: "speaking-listening",
      engineId: "selection",
      availability: "teacher-only",
      readiness: "needs-review",
      recommendedOrder: 9,
      packageTier: "games",
      launchRoute: "/speak/partner-demo-unit-1",
      audioRequirement: "Model sentences must be listenable before any recording or repeat activity.",
      mediaRequirement: "No background media required; pronunciation practice should be quiet and focused.",
      teacherControls: ["Teacher microphone approval", "No upload", "No transcript storage", "Local record/replay only"],
      evidence: "The Speak It route already supports optional local microphone record/replay without AI dependency.",
      nextStep: "Add tenant-level microphone approval to persisted launch settings before real classrooms.",
      notAllowedYet: ["Automatic microphone start", "Raw audio upload", "AI scoring without premium entitlement"],
    },
    {
      offerId: "partner-l1-u1-sentence-builder",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "sentence-builder",
      label: "Sentence Builder",
      family: "syntax-construction",
      engineId: "text-spelling",
      availability: "optional",
      readiness: "ready",
      recommendedOrder: 8,
      packageTier: "games",
      launchRoute: "/sentence/partner-demo-unit-1",
      audioRequirement: "Target sentences, instructions, feedback, and word tiles must be tap-to-hear.",
      mediaRequirement: "No media requirement; syntax construction should stay focused and quiet.",
      teacherControls: ["Teacher launch", "Deterministic scoring", "Reviewed target sentences only"],
      evidence: "The Sentence Builder route now provides a playable text-spelling scaffold for reviewed target sentences.",
      nextStep: "Use this as the first text-spelling offer template before adding premium skins or Phaser overlays.",
      notAllowedYet: ["AI-generated sentence changes inside the game", "Random rewards", "Canvas-only text controls"],
    },
    {
      offerId: "partner-l1-u1-balloon-pop",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "balloon-pop",
      label: "Balloon Pop",
      family: "arcade-action",
      engineId: "selection",
      availability: "optional",
      readiness: "ready",
      recommendedOrder: 4,
      packageTier: "games",
      launchRoute: "/balloon/partner-demo-unit-1",
      audioRequirement: "Prompt terms, wrong-answer feedback, and success feedback must be listenable.",
      mediaRequirement: "Can use unit music as optional background only after game audio remains clear.",
      teacherControls: ["Teacher enablement", "Motion/accessibility setting", "Separate media volume"],
      evidence: "The structural Balloon Pop route now uses the selection parent-engine scaffold with audio-supported vocabulary prompts and deterministic scoring.",
      nextStep: "Keep this as the structural baseline before Z.ai or Phaser work adds motion and premium polish.",
      notAllowedYet: ["Premium upsell inside child flow", "One-off arcade scoring", "Background music overpowering learning audio"],
    },
    {
      offerId: "partner-l1-u1-quiz",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "quiz",
      label: "Teacher Review Quiz",
      family: "core-quiz",
      engineId: "selection",
      availability: "optional",
      readiness: "ready",
      recommendedOrder: 5,
      packageTier: "games",
      launchRoute: "/quiz/partner-demo-unit-1",
      audioRequirement: "Questions and answer options must have audio cues before student use.",
      mediaRequirement: "No media requirement.",
      teacherControls: ["Teacher launch", "Reviewed payload", "Standard progress events"],
      evidence: "The Quiz route now uses the selection parent-engine scaffold with audio-supported prompts and deterministic scoring.",
      nextStep: "Use this as the plain selection-engine template before arcade selection skins are assigned to Z.ai.",
      notAllowedYet: ["Unreviewed generated questions", "Autoplay-only questions", "Assessment without teacher report policy"],
    },
    {
      offerId: "partner-l1-u1-true-false",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "true-false",
      label: "True or False",
      family: "core-quiz",
      engineId: "selection",
      availability: "optional",
      readiness: "ready",
      recommendedOrder: 6,
      packageTier: "games",
      launchRoute: "/true-false/partner-demo-unit-1",
      audioRequirement: "The listened prompt, visible card, instructions, and feedback must stay tap-to-hear.",
      mediaRequirement: "No media requirement; this mode should stay quiet and audio-clear.",
      teacherControls: ["Teacher launch", "Reviewed vocabulary only", "Standard progress events"],
      evidence: "The True or False route uses deterministic reviewed term match/mismatch rounds through the selection parent engine.",
      nextStep: "Use this as a low-cost assessment variant before adding more complex conversion rules.",
      notAllowedYet: ["Support-language-only completion", "Unreviewed distractor generation", "Silent answer buttons"],
    },
    {
      offerId: "partner-l1-u1-type-answer",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "type-answer",
      label: "Type Answer",
      family: "spelling-typing",
      engineId: "text-spelling",
      availability: "optional",
      readiness: "ready",
      recommendedOrder: 7,
      packageTier: "games",
      launchRoute: "/type-answer/partner-demo-unit-1",
      audioRequirement: "The word prompt, input instruction, feedback, and submit control must stay tap-to-hear.",
      mediaRequirement: "No media requirement; typed response should stay quiet and audio-clear.",
      teacherControls: ["Teacher launch", "Reviewed vocabulary only", "Standard progress events"],
      evidence: "The Type Answer route uses deterministic reviewed vocabulary rounds through the text-spelling parent engine.",
      nextStep: "Use this as the first typing-mode offer before spelling variants, dictation, or Japanese target-language segmentation.",
      notAllowedYet: ["Support-language-only typing", "Unreviewed accepted-answer variants", "Progress without target-language prompt audio"],
    },
  ],
};
