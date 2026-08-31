import type { GameModeId, LaunchCode } from "@living-textbook/content-model";
import {
  getBalloonPopPath,
  getFillInTheBlankPath,
  getFlashcardsPath,
  getLabelItPath,
  getMatchUpPath,
  getMemoryMatchPath,
  getQuizPath,
  getSentenceBuilderPath,
  getSpeakItPath,
  getSpellingPracticePath,
  getTypeAnswerPath,
  getTrueFalsePath,
} from "./routeContracts";

type GameModePathBuilder = (launchCode: LaunchCode) => string;

const gameModePathBuilders: Record<GameModeId, GameModePathBuilder> = {
  flashcards: getFlashcardsPath,
  "memory-match": getMemoryMatchPath,
  "match-up": getMatchUpPath,
  "label-it": getLabelItPath,
  quiz: getQuizPath,
  "true-false": getTrueFalsePath,
  "balloon-pop": getBalloonPopPath,
  "type-answer": getTypeAnswerPath,
  "spelling-practice": getSpellingPracticePath,
  "fill-in-the-blank": getFillInTheBlankPath,
  "sentence-builder": getSentenceBuilderPath,
  "speak-it": getSpeakItPath,
};

export function getGameModeRoutePath(gameMode: GameModeId, launchCode: LaunchCode): string {
  return gameModePathBuilders[gameMode](launchCode);
}
