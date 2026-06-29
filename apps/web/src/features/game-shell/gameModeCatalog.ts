import type { GameFamily, GameModeId, ParentEngine } from "@living-textbook/content-model";
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

export const gameModeCatalog: Partial<Record<GameModeId, GameModeCatalogItem>> = {
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
    scoringProfileId: "entry-vocabulary-practice",
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
    scoringProfileId: "pairing-reinforcement-v1",
    audioRequirement: "required",
    allowsBackgroundMedia: true,
    summary: "Reinforce term recognition after flashcards through pair finding, listening, and recall.",
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
    scoringProfileId: "selection-assessment-v1",
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Check vocabulary and target sentence understanding with audio-supported selected responses.",
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
    scoringProfileId: "syntax-construction-v1",
    audioRequirement: "required",
    allowsBackgroundMedia: false,
    summary: "Build the two approved target sentence patterns from unit-safe word parts and audio cues.",
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
    scoringProfileId: "speaking-listening-practice-v1",
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
    scoringProfileId: "arcade-reinforcement-v1",
    audioRequirement: "required",
    allowsBackgroundMedia: true,
    summary: "Use short audio-supported vocabulary prompts in a future reflex game without hand-building a separate one-off app.",
  },
};

export function getGameModeCatalogItem(mode: GameModeId): GameModeCatalogItem | undefined {
  return gameModeCatalog[mode];
}
