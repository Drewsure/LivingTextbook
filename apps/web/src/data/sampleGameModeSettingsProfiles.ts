import type { GameModeId, ParentEngine } from "@living-textbook/content-model";

export type GameModeSettingsStatus = "safe-default" | "teacher-review" | "blocked";
export type GameTimerPolicy = "untimed" | "teacher-adjustable" | "fixed-review";
export type GameMotionIntensity = "none" | "low" | "medium";

export interface GameModeSettingsProfile {
  profileId: string;
  gameMode: GameModeId;
  label: string;
  engineId: ParentEngine;
  status: GameModeSettingsStatus;
  timerPolicy: GameTimerPolicy;
  difficultyPolicy: string;
  motionIntensity: GameMotionIntensity;
  attemptsPolicy: string;
  backgroundMediaPolicy: string;
  learningAudioPriority: string;
  targetLanguageProgressTrigger: string;
  assistLanguagePolicy: string;
  reportEvents: string[];
  blockedActions: string[];
}

export interface GameModeSettingsProfilePlan {
  planId: string;
  tenantId: string;
  label: string;
  summary: string;
  decisionRule: string;
  globalRules: string[];
  profiles: GameModeSettingsProfile[];
  releaseGates: string[];
}

const noSettingSave = "No setting save until school policy, persistence adapter, and release-control gates are accepted.";
const targetOnly = "Only target-language game events can trigger mastery, Star Dust, or next-step readiness.";
const assistSupportOnly = "Assist-language text, audio, hints, and UI labels remain support-only.";
const audioPriority = "Learning audio always has priority over background media, music, sound effects, and celebration sounds.";

export const sampleGameModeSettingsProfilePlan: GameModeSettingsProfilePlan = {
  planId: "sample-publisher-l1-u1-game-mode-settings-v1",
  tenantId: "sample-publisher",
  label: "Game mode settings",
  summary:
    "Review-only timer, difficulty, motion, audio, background media, and attempts settings for active game modes. These profiles guide future teacher controls without enabling live setting saves.",
  decisionRule:
    "Use safe defaults first. Teacher-adjustable settings become live only after persistence, school policy, accessibility, and release-control gates are accepted.",
  globalRules: [noSettingSave, targetOnly, assistSupportOnly, audioPriority],
  profiles: [
    createProfile("flashcards", "Flashcards", "selection", "safe-default", "untimed", "none", "No scored attempts; completion requires target-language card engagement."),
    createProfile("match-up", "Match Up", "pairing", "safe-default", "untimed", "none", "One clean attempt per reviewed match; retry stays local until persistence exists."),
    createProfile("label-it", "Label It", "pairing", "teacher-review", "untimed", "none", "Anchor placement retries allowed after reviewed image/label records exist."),
    createProfile("memory-match", "Memory Match", "pairing", "safe-default", "teacher-adjustable", "low", "Attempts count pair flips; no speed pressure for early levels."),
    createProfile("balloon-pop", "Balloon Pop", "selection", "teacher-review", "teacher-adjustable", "medium", "Difficulty can tune target count and speed only after motion policy review."),
    createProfile("quiz", "Quiz", "selection", "safe-default", "teacher-adjustable", "none", "Attempts count submitted answers; teacher can later choose review or assessment mode."),
    createProfile("true-false", "True or False", "selection", "safe-default", "teacher-adjustable", "none", "Attempts count target-language decisions; mismatch rounds stay deterministic."),
    createProfile("type-answer", "Type Answer", "text-spelling", "teacher-review", "untimed", "none", "Attempts count submitted typed answers and reviewed spelling variants only."),
    createProfile("spelling-practice", "Spelling Practice", "text-spelling", "safe-default", "untimed", "none", "Attempts count submitted letter-tile spelling answers."),
    createProfile("sentence-builder", "Sentence Builder", "text-spelling", "teacher-review", "untimed", "none", "Attempts count submitted sentence builds using reviewed segmentation."),
    createProfile("speak-it", "Speak It", "selection", "teacher-review", "untimed", "none", "Attempts count local practice rounds; microphone and AI scoring stay optional and gated."),
  ],
  releaseGates: [
    "school_policy_acceptance_record",
    "teacher_session_settings_review_packet",
    "settings_persistence_adapter",
    "accessibility_motion_review",
    "release_control_packet",
  ],
};

function createProfile(
  gameMode: GameModeId,
  label: string,
  engineId: ParentEngine,
  status: GameModeSettingsStatus,
  timerPolicy: GameTimerPolicy,
  motionIntensity: GameMotionIntensity,
  attemptsPolicy: string,
): GameModeSettingsProfile {
  const arcade = motionIntensity !== "none";

  return {
    profileId: `settings-${gameMode}`,
    gameMode,
    label,
    engineId,
    status,
    timerPolicy,
    difficultyPolicy: arcade
      ? "Teacher-review difficulty only; young learner default is slow and forgiving."
      : "Safe default difficulty; later teacher controls must not bypass reviewed payload rules.",
    motionIntensity,
    attemptsPolicy,
    backgroundMediaPolicy: arcade
      ? "Background media allowed only when it ducks under prompts and pauses for learning audio."
      : "Background media is off by default and never required for progress.",
    learningAudioPriority: audioPriority,
    targetLanguageProgressTrigger: targetOnly,
    assistLanguagePolicy: assistSupportOnly,
    reportEvents: ["game_started", "round_shown", "answer_submitted", "answer_result", "game_completed", "mastery_updated"],
    blockedActions: [
      noSettingSave,
      "No timer pressure for Foundation/Bronze defaults without teacher approval.",
      "No motion-heavy skin without accessibility review.",
      "No support-language-only mastery.",
      "No background-media-only progress.",
      "No scoring profile override.",
    ],
  };
}
