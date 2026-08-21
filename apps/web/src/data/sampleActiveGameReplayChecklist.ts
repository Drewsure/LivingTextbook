import type { GameModeId, ParentEngine } from "@living-textbook/content-model";

export type ActiveGameReplayStatus = "ready" | "needs-evidence" | "blocked";

export interface ActiveGameReplayLane {
  laneId: string;
  label: string;
  summary: string;
  requiredBefore: string;
}

export interface ActiveGameReplayRecord {
  gameMode: GameModeId;
  label: string;
  engineId: ParentEngine;
  status: ActiveGameReplayStatus;
  routePaths: string[];
  fixtureExpectation: string;
  eventExpectation: string;
  audioExpectation: string;
  scoringExpectation: string;
  failureTriggers: string[];
}

export interface ActiveGameReplayChecklist {
  checklistId: string;
  label: string;
  summary: string;
  decisionRule: string;
  replayLanes: ActiveGameReplayLane[];
  records: ActiveGameReplayRecord[];
  blockedShortcuts: string[];
}

const sharedFailureTriggers = [
  "No hard-coded unit text",
  "No support-language-only progress",
  "No direct route or storage mutation",
  "No score or reward write inside the game component",
];

export const sampleActiveGameReplayChecklist: ActiveGameReplayChecklist = {
  checklistId: "active-game-replay-checklist-v1",
  label: "Fixture replay for active routes",
  summary:
    "Every active game route needs the same evidence posture: replay reviewed unit fixtures, emit standard events, prove target-language audio coverage, replay deterministic scoring, and stay mobile-safe before it can become a model for outside prototypes.",
  decisionRule:
    "Active game routes may be used as reference implementations only when fixture replay, event replay, audio coverage, scoring replay, and mobile/accessibility expectations remain visible and support-language shortcuts stay blocked.",
  replayLanes: [
    {
      laneId: "fixture-replay",
      label: "Fixture replay",
      summary: "Load reviewed JSON payloads from the tenant package instead of hard-coded labels, sentences, route text, or tenant assets.",
      requiredBefore: "Using a route as a reference for Z.ai, Phaser, AI-generated packages, or template conversion.",
    },
    {
      laneId: "event-replay",
      label: "Event replay",
      summary: "Emit the standard event envelope without owning backend state, reward inventory, report export, or assignment state.",
      requiredBefore: "Treating game completion, answer attempts, or mastery updates as reportable evidence.",
    },
    {
      laneId: "audio-coverage",
      label: "Audio coverage",
      summary: "Keep tap-to-speak or replay coverage for target-language terms, sentences, instructions, feedback, and critical controls.",
      requiredBefore: "Assigning the route to young learners or multilingual learners.",
    },
    {
      laneId: "scoring-replay",
      label: "Scoring replay",
      summary: "Use deterministic scoring profiles and block random reward, media-only, background-only, and support-language-only progress.",
      requiredBefore: "Connecting the route to Star Dust, collection unlocks, teacher reports, or Training Academy recommendations.",
    },
    {
      laneId: "mobile-accessibility",
      label: "Mobile/accessibility",
      summary: "Preserve mobile-first layout, readable controls, stable button labels, touch target size, and reduced-motion compatibility.",
      requiredBefore: "Promoting the route to a pilot package, local companion, or outside prototype build brief.",
    },
  ],
  records: [
    {
      gameMode: "flashcards",
      label: "Flashcards",
      engineId: "selection",
      status: "ready",
      routePaths: ["/flashcards/demo-unit-1", "/flashcards/partner-demo-unit-1"],
      fixtureExpectation: "Reviewed vocabulary and sentence cues load through the entry-practice package, not route-local text.",
      eventExpectation: "Entry completion can unlock the next reviewed activity only from target-language practice.",
      audioExpectation: "Every card has target-language tap-to-speak before progression.",
      scoringExpectation: "Entry practice uses deterministic completion, not random reward pressure.",
      failureTriggers: sharedFailureTriggers,
    },
    {
      gameMode: "memory-match",
      label: "Memory Match",
      engineId: "pairing",
      status: "ready",
      routePaths: ["/memory/demo-unit-1", "/memory/partner-demo-unit-1"],
      fixtureExpectation: "Pairs derive from reviewed terms and tenant package audio cues.",
      eventExpectation: "Pair attempts and completion emit standard game events without direct persistence.",
      audioExpectation: "Cards remain tap-to-speak before and during matching.",
      scoringExpectation: "Pair completion uses deterministic reinforcement scoring.",
      failureTriggers: sharedFailureTriggers,
    },
    {
      gameMode: "match-up",
      label: "Match Up",
      engineId: "pairing",
      status: "ready",
      routePaths: ["/match/demo-unit-1", "/match/partner-demo-unit-1"],
      fixtureExpectation: "Prompt and target lists derive from reviewed unit terms.",
      eventExpectation: "Prompt selection, answer submission, and result events stay envelope-compatible.",
      audioExpectation: "Prompt and feedback audio controls remain separate from submit actions.",
      scoringExpectation: "Correct target selection is deterministic and bounded by the pairing profile.",
      failureTriggers: sharedFailureTriggers,
    },
    {
      gameMode: "label-it",
      label: "Label It",
      engineId: "pairing",
      status: "ready",
      routePaths: ["/label-it/demo-unit-1", "/label-it/partner-demo-unit-1"],
      fixtureExpectation: "Labels and anchors come from reviewed asset metadata; upload-origin images stay blocked.",
      eventExpectation: "Label placement emits answer evidence without writing asset or anchor state.",
      audioExpectation: "Labels and feedback remain audio-supported.",
      scoringExpectation: "Label placement uses deterministic pairing scoring and no image-only progress.",
      failureTriggers: sharedFailureTriggers.concat("No unreviewed uploaded image"),
    },
    {
      gameMode: "quiz",
      label: "Quiz",
      engineId: "selection",
      status: "ready",
      routePaths: ["/quiz/demo-unit-1", "/quiz/partner-demo-unit-1"],
      fixtureExpectation: "Questions and options derive from reviewed target-language unit payloads.",
      eventExpectation: "Selected answers emit answer_submitted and answer_result style evidence.",
      audioExpectation: "Question, choice, feedback, and submit/replay controls preserve learning-audio priority.",
      scoringExpectation: "Quiz scoring is deterministic and cannot be overridden by teacher visual settings.",
      failureTriggers: sharedFailureTriggers,
    },
    {
      gameMode: "true-false",
      label: "True or False",
      engineId: "selection",
      status: "ready",
      routePaths: ["/true-false/demo-unit-1", "/true-false/partner-demo-unit-1"],
      fixtureExpectation: "True and false rounds derive from reviewed term match/mismatch fixtures.",
      eventExpectation: "True/false answers produce standard answer evidence and no direct report export.",
      audioExpectation: "Prompt, card, and feedback audio remain replayable.",
      scoringExpectation: "Selection scoring rejects support-language and media-only shortcuts.",
      failureTriggers: sharedFailureTriggers,
    },
    {
      gameMode: "balloon-pop",
      label: "Balloon Pop",
      engineId: "selection",
      status: "ready",
      routePaths: ["/balloon/demo-unit-1", "/balloon/partner-demo-unit-1"],
      fixtureExpectation: "Balloon labels derive from reviewed vocabulary terms, not arcade-local content.",
      eventExpectation: "Pops, misses, and completion emit events without owning mastery state.",
      audioExpectation: "Prompt and feedback audio remain clearer than sound effects or background media.",
      scoringExpectation: "Arcade bonus stays deterministic and bounded by the arcade profile.",
      failureTriggers: sharedFailureTriggers.concat("No background-media-only progress"),
    },
    {
      gameMode: "type-answer",
      label: "Type Answer",
      engineId: "text-spelling",
      status: "ready",
      routePaths: ["/type-answer/demo-unit-1", "/type-answer/partner-demo-unit-1"],
      fixtureExpectation: "Typed answers derive from reviewed target-language terms.",
      eventExpectation: "Attempts and result events preserve typed-answer evidence without storing freeform learner data.",
      audioExpectation: "Prompt replay remains available before submission.",
      scoringExpectation: "Answer normalization stays deterministic and unit-bounded.",
      failureTriggers: sharedFailureTriggers.concat("No freeform AI answer acceptance"),
    },
    {
      gameMode: "spelling-practice",
      label: "Spelling Practice",
      engineId: "text-spelling",
      status: "ready",
      routePaths: ["/spelling/demo-unit-1", "/spelling/partner-demo-unit-1"],
      fixtureExpectation: "Letter tiles derive from reviewed vocabulary terms.",
      eventExpectation: "Tile choices and result events remain envelope-compatible.",
      audioExpectation: "Word prompt and feedback audio remain replayable.",
      scoringExpectation: "Spelling scoring is deterministic and cannot write reward inventory directly.",
      failureTriggers: sharedFailureTriggers,
    },
    {
      gameMode: "fill-in-the-blank",
      label: "Fill in the Blank",
      engineId: "text-spelling",
      status: "ready",
      routePaths: ["/fill/demo-unit-1", "/fill/partner-demo-unit-1"],
      fixtureExpectation: "Blanked sentences derive from exactly two reviewed target sentence structures.",
      eventExpectation: "Choice submission and result events preserve syntax evidence.",
      audioExpectation: "Full sentence replay remains available before submission.",
      scoringExpectation: "Syntax scoring remains deterministic and support language cannot submit answers.",
      failureTriggers: sharedFailureTriggers.concat("No support-language answer submission"),
    },
    {
      gameMode: "sentence-builder",
      label: "Sentence Builder",
      engineId: "text-spelling",
      status: "ready",
      routePaths: ["/sentence/demo-unit-1", "/sentence/partner-demo-unit-1"],
      fixtureExpectation: "Word tiles derive from the reviewed target sentence structures.",
      eventExpectation: "Tile order attempts and completion events stay standard and reportable.",
      audioExpectation: "Instructions, sentence prompts, and feedback are replayable before submit.",
      scoringExpectation: "Sentence scoring remains deterministic and cannot accept support-language shortcuts.",
      failureTriggers: sharedFailureTriggers.concat("No freeform AI correction inside the game"),
    },
    {
      gameMode: "speak-it",
      label: "Speak It",
      engineId: "selection",
      status: "ready",
      routePaths: ["/speak/demo-unit-1", "/speak/partner-demo-unit-1"],
      fixtureExpectation: "Speaking prompts derive from reviewed terms and sentences.",
      eventExpectation: "Local record/replay events stay optional and do not upload raw audio or transcripts.",
      audioExpectation: "Model prompt audio is always available before any learner speaking action.",
      scoringExpectation: "Local practice completion stays deterministic; AI scoring remains premium and off.",
      failureTriggers: sharedFailureTriggers.concat("No raw microphone audio upload", "No live speech API billing"),
    },
  ],
  blockedShortcuts: [
    "No active game may become the template for a Z.ai or Phaser brief unless it passes the replay checklist.",
    "No activity may treat Japanese support text, assist-language audio, hints, media, or background music as mastery evidence.",
    "No game component may write routes, playlists, reports, storage records, Star Dust, collection inventory, or assignments directly.",
    "No premium skin, animation, sound layer, or mascot evolution may reduce target-language audio clarity.",
  ],
};
