import type { GameModeId } from "@living-textbook/content-model";

export type ScoringProfileId = "entry-vocabulary-practice" | "pairing-reinforcement-v1";

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
};

export const gameModeScoringProfiles: Partial<Record<GameModeId, ScoringProfileId>> = {
  flashcards: "entry-vocabulary-practice",
  "memory-match": "pairing-reinforcement-v1",
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
