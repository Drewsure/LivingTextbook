import type { GameFamily, GameModeId, ParentEngine } from "@living-textbook/content-model";

export type GameModeRole = "entry-practice" | "reinforcement" | "assessment" | "review";

export interface GameModeCatalogItem {
  id: GameModeId;
  label: string;
  family: GameFamily;
  engineId: ParentEngine;
  role: GameModeRole;
  summary: string;
}

export const gameModeCatalog: Partial<Record<GameModeId, GameModeCatalogItem>> = {
  flashcards: {
    id: "flashcards",
    label: "Flashcard Practice",
    family: "vocabulary-matching",
    engineId: "selection",
    role: "entry-practice",
    summary: "Introduce the unit terms with low-friction recognition before any scored game pressure.",
  },
  "memory-match": {
    id: "memory-match",
    label: "Memory Match",
    family: "memory-sorting",
    engineId: "pairing",
    role: "reinforcement",
    summary: "Reinforce term recognition after flashcards through pair finding and recall.",
  },
};

export function getGameModeCatalogItem(mode: GameModeId): GameModeCatalogItem | undefined {
  return gameModeCatalog[mode];
}
