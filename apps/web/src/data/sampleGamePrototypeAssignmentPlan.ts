export type PrototypeBuildSurface = "dom-reference" | "phaser" | "hybrid" | "defer";
export type PrototypeAssignmentStatus = "ready-to-brief" | "in-prototype" | "needs-contract" | "defer";
export type PrototypeIntegrationRisk = "low" | "medium" | "high";

export interface GamePrototypeAssignment {
  assignmentId: string;
  gameMode: string;
  label: string;
  parentEngine: string;
  recommendedSurface: PrototypeBuildSurface;
  status: PrototypeAssignmentStatus;
  integrationRisk: PrototypeIntegrationRisk;
  whyThisSurface: string;
  zaiInstruction: string;
  acceptanceGate: string[];
  notAllowedYet: string[];
}

export interface GamePrototypeAssignmentPlan {
  planId: string;
  label: string;
  summary: string;
  decisionRule: string;
  assignments: GamePrototypeAssignment[];
  standingRules: string[];
}

export const sampleGamePrototypeAssignmentPlan: GamePrototypeAssignmentPlan = {
  planId: "zai-game-prototype-assignment-plan",
  label: "Z.ai game prototype assignment board",
  summary:
    "Z.ai may keep building Phaser where motion is the learning experience, while text-heavy engines start as clean DOM reference implementations for accessibility, audio, localization, and reporting.",
  decisionRule:
    "Choose Phaser for action/physics/reflex modes; choose DOM/React reference UI for text, syntax, spelling, and reporting-heavy modes; integrate neither until schema, audio, events, scoring, and white-label boundaries pass review.",
  assignments: [
    {
      assignmentId: "sentence-builder-dom-reference",
      gameMode: "sentence-builder",
      label: "Sentence Builder",
      parentEngine: "text-spelling",
      recommendedSurface: "dom-reference",
      status: "ready-to-brief",
      integrationRisk: "low",
      whyThisSurface:
        "Sentence Builder is a syntax-construction game. Clean word-order logic, tap-to-speak text, accessible tiles, and deterministic events matter more than arcade rendering in the first prototype.",
      zaiInstruction:
        "Build a clean isolated DOM/React-style reference prototype in Drewsure/ministar-lab. Phaser is optional only as a later premium skin after the logic/event contract is accepted.",
      acceptanceGate: [
        "Splits exactly two target sentences into ordered tiles.",
        "Every tile and instruction is tap-to-speak.",
        "Submit has a separate listen/replay control.",
        "Emits game_started, round_shown, answer_submitted, answer_result, game_completed, and mastery_updated.",
      ],
      notAllowedYet: ["Canvas-only text controls", "Unlabelled drag targets", "Random rewards", "Production integration before Codex review"],
    },
    {
      assignmentId: "fill-in-blank-dom-reference",
      gameMode: "fill-in-the-blank",
      label: "Fill in the Blank",
      parentEngine: "text-spelling",
      recommendedSurface: "dom-reference",
      status: "ready-to-brief",
      integrationRisk: "low",
      whyThisSurface:
        "This mode is mostly sentence text, answer choices, audio replay, and deterministic feedback. DOM keeps accessibility and localization cleaner than canvas.",
      zaiInstruction:
        "Build as a clean text-engine prototype with reusable prompt/choice logic, not as a Phaser arcade game.",
      acceptanceGate: ["Audio-supported prompt", "Audio-supported choices", "Standard events", "Mobile stable layout"],
      notAllowedYet: ["Unreviewed generated distractors", "Canvas-only text", "Hidden scoring logic"],
    },
    {
      assignmentId: "quiz-selection-reference",
      gameMode: "quiz",
      label: "Quiz / True-False",
      parentEngine: "selection",
      recommendedSurface: "dom-reference",
      status: "needs-contract",
      integrationRisk: "medium",
      whyThisSurface:
        "Quiz needs strong reportability and accessible answer controls. It can later receive animated skins, but the first useful prototype is a clean selection engine.",
      zaiInstruction:
        "Prototype selection logic and event output first. Avoid gameshow polish until question payload and reporting shape are reviewed.",
      acceptanceGate: ["Question payload shape", "Audio-supported prompts", "Standard answer events", "Teacher report mapping"],
      notAllowedYet: ["High-stakes assessment without report policy", "Unreviewed AI questions", "Visual-only feedback"],
    },
    {
      assignmentId: "balloon-pop-phaser",
      gameMode: "balloon-pop",
      label: "Balloon Pop",
      parentEngine: "selection",
      recommendedSurface: "phaser",
      status: "in-prototype",
      integrationRisk: "medium",
      whyThisSurface:
        "Balloon Pop is an action/reflex mode. Phaser is appropriate because motion, collision, timing, and playful feedback are core to the learning experience.",
      zaiInstruction:
        "Continue Phaser prototype work, but wrap it around the LivingTextbook event contract and audio requirements. Keep it isolated in Drewsure/ministar-lab.",
      acceptanceGate: ["Standard events", "Tap-to-speak prompts", "Separate background media volume", "Mobile performance check"],
      notAllowedYet: ["One-off scoring", "Hard-coded MiniStar-only art", "Background music overpowering comprehension audio"],
    },
    {
      assignmentId: "whack-a-mole-phaser",
      gameMode: "whack-a-mole",
      label: "Whack-a-Mole",
      parentEngine: "selection",
      recommendedSurface: "phaser",
      status: "in-prototype",
      integrationRisk: "medium",
      whyThisSurface:
        "This is a reflex selection mode where spawn timing, hit feedback, and motion make Phaser a better fit than static UI.",
      zaiInstruction:
        "Use Phaser, but treat prompts, answer mapping, scoring, and events as external data contracts, not local game-only state.",
      acceptanceGate: ["Selection payload adapter", "Correct/incorrect hit events", "Audio prompts", "Pause/teacher-friendly controls"],
      notAllowedYet: ["Random target scoring", "No accessibility fallback", "No event export"],
    },
    {
      assignmentId: "maze-chase-phaser",
      gameMode: "maze-chase",
      label: "Maze Chase",
      parentEngine: "selection",
      recommendedSurface: "phaser",
      status: "defer",
      integrationRisk: "high",
      whyThisSurface:
        "Maze Chase benefits from Phaser, but it needs stronger movement, collision, accessibility, and content-mapping rules than simpler selection games.",
      zaiInstruction:
        "Do not prioritize until Balloon Pop or Whack-a-Mole proves the Phaser event wrapper pattern.",
      acceptanceGate: ["Movement rules", "Collision rules", "Answer target mapping", "Mobile controls"],
      notAllowedYet: ["Open-world scope", "No pause state", "No teacher-safe difficulty controls"],
    },
  ],
  standingRules: [
    "Phaser is preferred for motion-heavy action, physics, and reflex modes.",
    "DOM/React reference UI is preferred for text, syntax, spelling, quiz, and reporting-heavy modes.",
    "A Phaser prototype can be visually better and still be architecturally unready until it emits LivingTextbook events.",
    "A DOM prototype can be structurally better and still receive a Phaser or premium animation skin later.",
    "Z.ai prototypes stay in Drewsure/ministar-lab until Codex reviews schema, audio, scoring, events, accessibility, and white-label fit.",
  ],
};
