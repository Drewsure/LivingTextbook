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
};

export function getGameModeCatalogItem(mode: GameModeId): GameModeCatalogItem | undefined {
  return gameModeCatalog[mode];
}
