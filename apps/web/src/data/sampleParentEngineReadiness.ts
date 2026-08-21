import type { GameModeId, ParentEngine } from "@living-textbook/content-model";

export type ParentEngineReadinessStatus = "ready" | "review-only" | "blocked";

export interface ParentEngineReadinessRecord {
  engineId: ParentEngine;
  label: string;
  status: ParentEngineReadinessStatus;
  activeModes: GameModeId[];
  contractSummary: string;
  readyEvidence: string[];
  remainingWork: string[];
  blockedActions: string[];
}

export interface ParentEngineReadinessPlan {
  planId: string;
  label: string;
  summary: string;
  decisionRule: string;
  zAiIntakeRule: string;
  records: ParentEngineReadinessRecord[];
  hardRules: string[];
}

export const sampleParentEngineReadinessPlan: ParentEngineReadinessPlan = {
  planId: "parent-engine-readiness-v1",
  label: "Parent engine readiness before more game intake",
  summary:
    "The platform grows through reusable parent engines, shared scoring, shared audio behavior, and reviewed mode configs. Individual game surfaces, including Phaser builds, remain integration candidates until they prove they can obey the parent-engine contract.",
  decisionRule:
    "Do not build 48 isolated games. A new mode becomes active only after its parent engine declares standard events, deterministic scoring, learning-audio priority, target-language progress rules, settings boundaries, and route-shell compatibility.",
  zAiIntakeRule:
    "Z.ai prototype intake waits for the Codex integration gate. Phaser wrapper only after review: fixture replay, event replay, audio coverage, scoring replay, mobile/accessibility evidence, and parent-engine mapping must pass before any outside prototype is promoted.",
  hardRules: [
    "No support-language-only progress. Assist-language, media-only, background-music, and hint events remain support-only and cannot unlock mastery.",
    "Learning audio always outranks background media, game sounds, visual skins, and arcade pacing.",
    "Teacher settings can adjust pace, visibility, and support, but cannot override scoring profiles or target-language mastery triggers.",
    "Premium polish, Phaser wrappers, and mascot skins wait until structural route shells and event contracts remain stable.",
  ],
  records: [
    {
      engineId: "pairing",
      label: "Pairing parent engine",
      status: "ready",
      activeModes: ["memory-match", "match-up", "label-it"],
      contractSummary:
        "Binary source-target matching is active through Memory Match, Match Up, and Label It using reviewed targets, tap-to-speak controls, deterministic scoring, and support-only media/image boundaries.",
      readyEvidence: [
        "Shared pairing routes are active for both MiniStar and sample publisher tenants.",
        "Cards, labels, image anchors, and prompts are audio-supported before scoring.",
        "Labelled Diagram image upload remains review-only until asset and rights gates pass.",
      ],
      remainingWork: [
        "Add richer pair-state replay evidence before importing external pairing prototypes.",
        "Add print/export mappings for pairing worksheets after printable output storage is decided.",
      ],
      blockedActions: [
        "No live image-label editor.",
        "No unreviewed uploaded image in a student game.",
        "No random rewards from pair completion.",
      ],
    },
    {
      engineId: "selection",
      label: "Selection parent engine",
      status: "ready",
      activeModes: ["flashcards", "quiz", "true-false", "speak-it", "balloon-pop"],
      contractSummary:
        "Prompt-response selection is active for entry practice, quizzes, true/false, audio-led speaking practice, and the first arcade-selection slice. It preserves teacher-led QR entry and target-language-only mastery.",
      readyEvidence: [
        "Flashcards remain the entry doorway, with English/target-language interaction as the unlock trigger.",
        "Quiz and True or False reuse selected-response scoring without support-language shortcuts.",
        "Speak It remains audio-led unless a school enables premium microphone scoring.",
      ],
      remainingWork: [
        "Separate arcade timing and difficulty settings into persistent teacher snapshots after the storage gate.",
        "Add engine-level fixture replay for wrong-answer, timeout, and retry paths.",
      ],
      blockedActions: [
        "No live microphone API scoring without school enablement and cost policy.",
        "No arcade speed persistence before settings storage is selected.",
        "No media-only or support-language-only completion.",
      ],
    },
    {
      engineId: "text-spelling",
      label: "Text-spelling parent engine",
      status: "ready",
      activeModes: ["sentence-builder", "type-answer", "spelling-practice", "fill-in-the-blank"],
      contractSummary:
        "Text construction is active for sentence building, typing, spelling, and fill-in-the-blank with exact target sentences, deterministic answer checks, and tap-to-speak instructions.",
      readyEvidence: [
        "All active text-spelling modes use the shared playable route shell.",
        "The two target sentence structures remain the canonical syntax payload.",
        "Support language helps comprehension but does not submit answers or unlock progress.",
      ],
      remainingWork: [
        "Add punctuation-normalization policy before accepting richer upper-level sentence variants.",
        "Add future crossword/word-search compatibility checks only for text-only payloads.",
      ],
      blockedActions: [
        "No freeform AI answer acceptance.",
        "No teacher-created template switch without compatibility review.",
        "No support-language answer submission.",
      ],
    },
    {
      engineId: "narrative",
      label: "Narrative parent engine",
      status: "blocked",
      activeModes: [],
      contractSummary:
        "Narrative gameplay is not active yet. Boss Battle, Mystery Detective, Story Bridge, and dialogue tutor experiences need state, branching, persistence, privacy, and cost controls before becoming student-facing.",
      readyEvidence: [
        "AI Tutor is documented as an optional paid package, not a core dependency.",
        "Upper-level narrative/tutor concepts are preserved in docs but disabled for Level 1 pilot routes.",
      ],
      remainingWork: [
        "Define narrative state machine and event taxonomy before any story route is built.",
        "Define teacher enablement, transcript handling, privacy retention, and usage limits.",
        "Select one upper-level unit for a contained narrative prototype after foundation verification.",
      ],
      blockedActions: [
        "No live AI Tutor route.",
        "No branching dialogue persistence.",
        "No Boss Battle or Mystery Detective student route.",
        "No transcript capture or model call.",
      ],
    },
  ],
};
