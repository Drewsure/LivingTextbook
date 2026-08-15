import type { GameModeId } from "@living-textbook/content-model";

export type ScoringProfileId =
  | "entry-vocabulary-practice"
  | "pairing-reinforcement-v1"
  | "selection-assessment-v1"
  | "syntax-construction-v1"
  | "spelling-typing-v1"
  | "speaking-listening-practice-v1"
  | "arcade-reinforcement-v1";

export interface GameScoringProfile {
  id: ScoringProfileId;
  label: string;
  vocabularyDust: number;
  syntaxDust: number;
  bonusDust: number;
  completionDustCap: number;
  summary: string;
}

export const gameScoringProfiles: Record<ScoringProfileId, GameScoringProfile> = {
  "entry-vocabulary-practice": {
    id: "entry-vocabulary-practice",
    label: "Entry Vocabulary Practice",
    vocabularyDust: 300,
    syntaxDust: 0,
    bonusDust: 0,
    completionDustCap: 300,
    summary: "Awards the vocabulary slice when students complete the required flashcard entry practice.",
  },
  "pairing-reinforcement-v1": {
    id: "pairing-reinforcement-v1",
    label: "Pairing Reinforcement",
    vocabularyDust: 0,
    syntaxDust: 0,
    bonusDust: 200,
    completionDustCap: 200,
    summary: "Awards a small accuracy-sensitive bonus for completing a pairing reinforcement game after entry practice.",
  },
  "selection-assessment-v1": {
    id: "selection-assessment-v1",
    label: "Selection Assessment",
    vocabularyDust: 150,
    syntaxDust: 150,
    bonusDust: 200,
    completionDustCap: 500,
    summary: "Supports quiz-style assessment modes that check both vocabulary and sentence understanding.",
  },
  "syntax-construction-v1": {
    id: "syntax-construction-v1",
    label: "Syntax Construction",
    vocabularyDust: 0,
    syntaxDust: 300,
    bonusDust: 200,
    completionDustCap: 500,
    summary: "Supports sentence building, ordering, and fill-in modes focused on target structures.",
  },
  "spelling-typing-v1": {
    id: "spelling-typing-v1",
    label: "Spelling And Typing",
    vocabularyDust: 200,
    syntaxDust: 0,
    bonusDust: 200,
    completionDustCap: 400,
    summary: "Supports typed vocabulary answers where audio prompts and reviewed spelling drive deterministic scoring.",
  },
  "speaking-listening-practice-v1": {
    id: "speaking-listening-practice-v1",
    label: "Speaking And Listening Practice",
    vocabularyDust: 150,
    syntaxDust: 150,
    bonusDust: 100,
    completionDustCap: 400,
    summary: "Supports audio-led listening and speaking modes without requiring AI Tutor.",
  },
  "arcade-reinforcement-v1": {
    id: "arcade-reinforcement-v1",
    label: "Arcade Reinforcement",
    vocabularyDust: 100,
    syntaxDust: 0,
    bonusDust: 300,
    completionDustCap: 400,
    summary: "Supports reflex-based reinforcement modes where accuracy and timing drive the bonus slice.",
  },
};

export const gameModeScoringProfiles: Partial<Record<GameModeId, ScoringProfileId>> = {
  flashcards: "entry-vocabulary-practice",
  "match-up": "pairing-reinforcement-v1",
  "memory-match": "pairing-reinforcement-v1",
  quiz: "selection-assessment-v1",
  "true-false": "selection-assessment-v1",
  "type-answer": "spelling-typing-v1",
  "sentence-builder": "syntax-construction-v1",
  "speak-it": "speaking-listening-practice-v1",
  "balloon-pop": "arcade-reinforcement-v1",
};

export function getGameScoringProfileForMode(mode: GameModeId): GameScoringProfile | undefined {
  const profileId = gameModeScoringProfiles[mode];

  return profileId ? gameScoringProfiles[profileId] : undefined;
}

export function calculateAccuracyBonusDust(args: {
  attempts: number;
  targetAttempts: number;
  profile: GameScoringProfile;
  minimumDust?: number;
}): number {
  const safeAttempts = Math.max(args.attempts, 1);
  const safeTargetAttempts = Math.max(args.targetAttempts, 1);
  const accuracyRatio = Math.min(safeTargetAttempts / safeAttempts, 1);
  const calculatedDust = Math.round(accuracyRatio * args.profile.completionDustCap);

  return Math.max(args.minimumDust ?? 0, calculatedDust);
}
