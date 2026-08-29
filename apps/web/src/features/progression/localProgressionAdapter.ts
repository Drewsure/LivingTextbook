import {
  calculateStarDust,
  completeEntryPractice,
} from "@living-textbook/content-model";
import type {
  AudioCueKind,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  MediaAsset,
  StarDustBreakdown,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";

export interface EntryPracticeCompletionResult {
  progression: StudentProgressionState;
  dust: StarDustBreakdown;
  events: GameProgressEvent[];
}

export interface GameModeCompletionResult {
  progression: StudentProgressionState;
  event?: GameProgressEvent;
  earnedStarDust: number;
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
  targetLanguageEngagedItems?: number;
  requiredTargetLanguageItems?: number;
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
      targetLanguageEngagedItems: args.targetLanguageEngagedItems ?? 0,
      requiredTargetLanguageItems: args.requiredTargetLanguageItems ?? 0,
      supportLanguageUnlockAllowed: false,
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
      targetLanguageGateSatisfied: true,
      supportLanguageUnlockAllowed: false,
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

export function createGameInteractionEvent(args: {
  type: "round_shown" | "answer_submitted" | "answer_result" | "mastery_updated";
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
}): GameProgressEvent {
  const event: GameProgressEvent = {
    type: args.type,
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
  };

  if (args.metadata) {
    event.metadata = args.metadata;
  }

  return event;
}

export function createAudioRequestedEvent(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  occurredAt: string;
  cueKind: AudioCueKind;
  cueText: string;
  language: string;
  source?: string;
}): GameProgressEvent {
  return {
    type: "audio_requested",
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      cueKind: args.cueKind,
      cueText: args.cueText,
      language: args.language,
      source: args.source ?? "game-audio-contract",
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      starDustAwarded: 0,
      supportLanguageUnlockAllowed: false,
    },
  };
}

export function createRouteGuidanceListenedEvent(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  occurredAt: string;
  routeStatus: "locked" | "unlocked" | "complete";
  routeHref: string;
}): GameProgressEvent {
  return {
    type: "route_guidance_listened",
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      routeStatus: args.routeStatus,
      routeHref: args.routeHref,
      progressionUnlockAllowed: false,
      supportLanguageUnlockAllowed: false,
    },
  };
}

export function completeGameMode(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  earnedStarDust: number;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
}): GameModeCompletionResult {
  const alreadyCompleted = args.progression.completedGameModes.includes(args.gameMode);

  if (alreadyCompleted) {
    return {
      progression: args.progression,
      earnedStarDust: 0,
    };
  }

  const progression: StudentProgressionState = {
    ...args.progression,
    completedGameModes: Array.from(new Set([...args.progression.completedGameModes, args.gameMode])),
    earnedStarDust: args.progression.earnedStarDust + args.earnedStarDust,
    masteryStatus: "in-progress",
    lastEventAt: args.occurredAt,
  };

  const event: GameProgressEvent = {
    type: "game_completed",
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      earnedStarDust: args.earnedStarDust,
      ...args.metadata,
    },
  };

  return {
    progression,
    event,
    earnedStarDust: args.earnedStarDust,
  };
}

export function createLaunchOpenedEvent(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  occurredAt: string;
  entryCode?: string;
  userCode?: string;
}): GameProgressEvent {
  return {
    type: "launch_opened",
    unitKey: args.launchSession.unitKey,
    gameMode: args.launchSession.entryMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      accessMode: args.launchSession.accessMode,
      entryCodeProvided: Boolean(args.entryCode),
      userCodeProvided: Boolean(args.userCode),
    },
  };
}

export function createMediaProgressEvent(args: {
  type: "media_started" | "media_paused" | "media_completed";
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  mediaAsset: MediaAsset;
  occurredAt: string;
  gameMode?: GameModeId;
}): GameProgressEvent {
  return {
    type: args.type,
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode ?? args.launchSession.entryMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      mediaAssetId: args.mediaAsset.mediaAssetId,
      mediaKind: args.mediaAsset.kind,
      mediaType: args.mediaAsset.type,
      durationSeconds: args.mediaAsset.durationSeconds ?? 0,
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      starDustAwarded: 0,
    },
  };
}

export function createMediaPlaylistOpenedEvent(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  playlistId: string;
  routeHref: string;
  occurredAt: string;
}): GameProgressEvent {
  return {
    type: "media_playlist_opened",
    unitKey: args.launchSession.unitKey,
    gameMode: args.launchSession.entryMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      playlistId: args.playlistId,
      routeHref: args.routeHref,
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      starDustAwarded: 0,
    },
  };
}

export function createBackgroundMediaEvent(args: {
  type: "background_media_enabled" | "background_media_disabled";
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  mediaAsset: MediaAsset;
  gameMode: GameModeId;
  volumePercent: number;
  occurredAt: string;
}): GameProgressEvent {
  return {
    type: args.type,
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: {
      mediaAssetId: args.mediaAsset.mediaAssetId,
      mediaKind: args.mediaAsset.kind,
      mediaType: args.mediaAsset.type,
      volumePercent: args.volumePercent,
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      starDustAwarded: 0,
      pausesForLearningAudio: true,
    },
  };
}
