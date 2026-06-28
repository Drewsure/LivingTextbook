import {
  calculateStarDust,
  completeEntryPractice,
} from "@living-textbook/content-model";
import type {
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StarDustBreakdown,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";

export interface EntryPracticeCompletionResult {
  progression: StudentProgressionState;
  dust: StarDustBreakdown;
  events: GameProgressEvent[];
}

const zeroDust: StarDustBreakdown = {
  vocabulary: 0,
  syntax: 0,
  bonus: 0,
  total: 0,
};

export function completeFlashcardEntryPractice(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  unit: UnitPayload;
  occurredAt: string;
}): EntryPracticeCompletionResult {
  const alreadyCompleted = args.progression.completedGameModes.includes(args.launchSession.entryMode);

  if (alreadyCompleted) {
    return {
      progression: args.progression,
      dust: zeroDust,
      events: [],
    };
  }

  const dust = calculateStarDust({
    masteredTerms: args.unit.pedagogicalPayload.vocabularyTerms.length,
    totalTerms: args.unit.pedagogicalPayload.vocabularyTerms.length,
    masteredSyntaxChecks: 0,
    totalSyntaxChecks: args.unit.pedagogicalPayload.targetSentences.length,
    bonusRatio: 0,
  });

  const baseProgression = completeEntryPractice({
    progression: args.progression,
    launchSession: args.launchSession,
    occurredAt: args.occurredAt,
  });

  const progression: StudentProgressionState = {
    ...baseProgression,
    earnedStarDust: args.progression.earnedStarDust + dust.total,
  };

  const completionEvent: GameProgressEvent = {
    type: "entry_practice_completed",
    unitKey: args.launchSession.unitKey,
    gameMode: args.launchSession.entryMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      earnedStarDust: dust.total,
      masteredTerms: args.unit.pedagogicalPayload.vocabularyTerms.length,
      totalTerms: args.unit.pedagogicalPayload.vocabularyTerms.length,
    },
  };

  const unlockEvents: GameProgressEvent[] = args.launchSession.recommendedNextModes.map((gameMode, index) => ({
    type: "game_unlocked",
    unitKey: args.launchSession.unitKey,
    gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      sourceMode: args.launchSession.entryMode,
      unlockedModeIndex: index,
    },
  }));

  return {
    progression,
    dust,
    events: [completionEvent, ...unlockEvents],
  };
}

export function startUnlockedGameMode(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  occurredAt: string;
}): GameProgressEvent | undefined {
  const modeIsUnlocked = args.progression.unlockedGameModes.includes(args.gameMode);

  if (!modeIsUnlocked) {
    return undefined;
  }

  return {
    type: "game_started",
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      sourceMode: args.launchSession.entryMode,
    },
  };
}
