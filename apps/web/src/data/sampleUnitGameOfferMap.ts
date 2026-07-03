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
      offerId: "partner-l1-u1-memory-match",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "memory-match",
      label: "Memory Match",
      family: "memory-sorting",
      engineId: "pairing",
      availability: "required",
      readiness: "ready",
      recommendedOrder: 2,
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
      recommendedOrder: 3,
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
      offerId: "partner-l1-u1-balloon-pop",
      unitKey: "sample-publisher:starter-english:L1:U1",
      unitLabel: "Starter English Unit 1: Hello Friends",
      gameMode: "balloon-pop",
      label: "Balloon Pop",
      family: "arcade-action",
      engineId: "selection",
      availability: "premium",
      readiness: "needs-review",
      recommendedOrder: 4,
      packageTier: "premium",
      audioRequirement: "Prompt terms, wrong-answer feedback, and success feedback must be listenable.",
      mediaRequirement: "Can use unit music as optional background only after game audio remains clear.",
      teacherControls: ["Teacher enablement", "Motion/accessibility setting", "Separate media volume"],
      evidence: "Selection-engine preview exists, but a polished arcade implementation is not yet production-ready.",
      nextStep: "Assign as a later Z.ai prototype only after the selection-engine event contract is locked.",
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
      availability: "hidden",
      readiness: "blocked",
      packageTier: "games",
      audioRequirement: "Questions and answer options must have audio cues before student use.",
      mediaRequirement: "No media requirement.",
      teacherControls: ["Teacher preview only", "Not shown to students", "Requires question bank review"],
      evidence: "Quiz scoring profile exists, but no reviewed sample quiz payload is student-ready yet.",
      nextStep: "Add reviewed quiz payloads after the selection parent-engine preview is upgraded.",
      notAllowedYet: ["Unreviewed generated questions", "Student-facing hidden mode", "Assessment without teacher report policy"],
    },
  ],
};
