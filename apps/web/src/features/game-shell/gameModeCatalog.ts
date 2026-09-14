import {
  CANONICAL_GAME_SCORING_PROFILE_BY_MODE,
  type GameFamily,
  type GameModeId,
  type ParentEngine,
} from "@living-textbook/content-model";
import type { ScoringProfileId } from "./scoringProfiles";

export type GameModeRole = "entry-practice" | "reinforcement" | "assessment" | "review";
export type GameModeSkillFocus = "vocabulary" | "syntax" | "listening" | "speaking" | "review" | "mixed";

export interface GameModeCatalogItem {
  id: GameModeId;
  label: string;
  family: GameFamily;
  engineId: ParentEngine;
  role: GameModeRole;
  skillFocus: GameModeSkillFocus;
  supportedLevels: number[];
  recommendedTermRange: {
    min: number;
    max: number;
  };
  requiredSentenceCount: 2;
  scoringProfileId: ScoringProfileId;
  audioRequirement: "required";
  allowsBackgroundMedia: boolean;
  summary: string;
}

export const gameModeCatalog: Record<GameModeId, GameModeCatalogItem> = {
  flashcards: {
    id: "flashcards",
    label: "Flashcard Practice",
    family: "vocabulary-matching",
    engineId: "selection",
    role: "entry-practice",
    skillFocus: "vocabulary",
    supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE.flashcards,
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Introduce the unit terms with low-friction recognition before any scored game pressure.",
  },
  "memory-match": {
    id: "memory-match",
    label: "Memory Match",
    family: "memory-sorting",
    engineId: "pairing",
    role: "reinforcement",
    skillFocus: "vocabulary",
    supportedLevels: [1, 2, 3, 4],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["memory-match"],
    audioRequirement: "required",
    allowsBackgroundMedia: true,
    summary: "Reinforce term recognition after flashcards through pair finding, listening, and recall.",
  },
  "match-up": {
    id: "match-up",
    label: "Match Up",
    family: "vocabulary-matching",
    engineId: "pairing",
    role: "reinforcement",
    skillFocus: "vocabulary",
    supportedLevels: [1, 2, 3, 4],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["match-up"],
    audioRequirement: "required",
    allowsBackgroundMedia: true,
    summary: "Match audio prompts to reviewed vocabulary word cards through the shared pairing parent engine.",
  },
  "label-it": {
    id: "label-it",
    label: "Label It",
    family: "vocabulary-matching",
    engineId: "pairing",
    role: "reinforcement",
    skillFocus: "vocabulary",
    supportedLevels: [1, 2, 3, 4, 5, 6],
    recommendedTermRange: { min: 4, max: 8 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["label-it"],
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Place reviewed target-language labels onto reviewed image anchors after audio-supported practice.",
  },
  quiz: {
    id: "quiz",
    label: "Quiz",
    family: "core-quiz",
    engineId: "selection",
    role: "assessment",
    skillFocus: "mixed",
    supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE.quiz,
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Check vocabulary and target sentence understanding with audio-supported selected responses.",
  },
  "true-false": {
    id: "true-false",
    label: "True or False",
    family: "core-quiz",
    engineId: "selection",
    role: "assessment",
    skillFocus: "vocabulary",
    supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["true-false"],
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Check whether a listened target-language word matches the visible card through the selection parent engine.",
  },
  "sentence-builder": {
    id: "sentence-builder",
    label: "Sentence Builder",
    family: "syntax-construction",
    engineId: "text-spelling",
    role: "reinforcement",
    skillFocus: "syntax",
    supportedLevels: [2, 3, 4, 5, 6, 7, 8],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["sentence-builder"],
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Build the two approved target sentence patterns from unit-safe word parts and audio cues.",
  },
  "type-answer": {
    id: "type-answer",
    label: "Type Answer",
    family: "spelling-typing",
    engineId: "text-spelling",
    role: "reinforcement",
    skillFocus: "vocabulary",
    supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["type-answer"],
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Type the reviewed word after hearing the target-language prompt, with deterministic spelling feedback.",
  },
  "spelling-practice": {
    id: "spelling-practice",
    label: "Spelling Practice",
    family: "spelling-typing",
    engineId: "text-spelling",
    role: "reinforcement",
    skillFocus: "vocabulary",
    supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["spelling-practice"],
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Listen to the reviewed word and build its spelling from deterministic letter tiles with tap-to-speak support.",
  },
  "fill-in-the-blank": {
    id: "fill-in-the-blank",
    label: "Fill in the Blank",
    family: "syntax-construction",
    engineId: "text-spelling",
    role: "reinforcement",
    skillFocus: "syntax",
    supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["fill-in-the-blank"],
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Choose the missing reviewed word or phrase inside the two approved target sentence structures.",
  },
  "speak-it": {
    id: "speak-it",
    label: "Speak It",
    family: "speaking-listening",
    engineId: "selection",
    role: "reinforcement",
    skillFocus: "speaking",
    supportedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["speak-it"],
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Practice listening and oral repetition with teacher-controlled, audio-first prompts.",
  },
  "balloon-pop": {
    id: "balloon-pop",
    label: "Balloon Pop",
    family: "arcade-action",
    engineId: "selection",
    role: "reinforcement",
    skillFocus: "vocabulary",
    supportedLevels: [1, 2, 3],
    recommendedTermRange: { min: 8, max: 12 },
    requiredSentenceCount: 2,
    scoringProfileId: CANONICAL_GAME_SCORING_PROFILE_BY_MODE["balloon-pop"],
    audioRequirement: "required",
    allowsBackgroundMedia: true,
    summary: "Use short audio-supported vocabulary prompts in a future reflex game without hand-building a separate one-off app.",
  },
};

export function getGameModeCatalogItem(mode: GameModeId): GameModeCatalogItem | undefined {
  return gameModeCatalog[mode];
}
