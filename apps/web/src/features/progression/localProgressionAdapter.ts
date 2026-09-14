import {
  calculateStarDust,
  CANONICAL_GAME_COMPLETION_DUST_CAP_BY_MODE,
  completeEntryPractice,
  resolveCanonicalGameReplaySeed,
  getLevelAwareRecommendedGameModes,
  isGameModeSupportedAtLevel,
  getCanonicalUnitKeyLevel,
  validateProgressionLaunchIdentity,
  UNIT_STAR_DUST_CAP,
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
  completed: boolean;
  blockedReason?: "target-language-gate" | "identity-mismatch";
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
  targetLanguageEngagedItems: number;
  requiredTargetLanguageItems: number;
}): EntryPracticeCompletionResult {
  if (validateProgressionLaunchIdentity(args.progression, args.launchSession).length > 0) {
    return {
      progression: args.progression,
      dust: zeroDust,
      events: [],
      completed: false,
      blockedReason: "identity-mismatch",
    };
  }

  const alreadyCompleted = args.progression.completedGameModes.includes(args.launchSession.entryMode);

  if (alreadyCompleted) {
    return {
      progression: args.progression,
      dust: zeroDust,
      events: [],
      completed: true,
    };
  }

  const targetLanguageGateSatisfied =
    Number.isSafeInteger(args.targetLanguageEngagedItems) &&
    Number.isSafeInteger(args.requiredTargetLanguageItems) &&
    args.requiredTargetLanguageItems > 0 &&
    args.targetLanguageEngagedItems >= args.requiredTargetLanguageItems;

  if (!targetLanguageGateSatisfied) {
    return {
      progression: args.progression,
      dust: zeroDust,
      events: [],
      completed: false,
      blockedReason: "target-language-gate",
    };
  }

  const calculatedDust = calculateStarDust({
    masteredTerms: args.unit.pedagogicalPayload.vocabularyTerms.length,
    totalTerms: args.unit.pedagogicalPayload.vocabularyTerms.length,
    masteredSyntaxChecks: 0,
    totalSyntaxChecks: args.unit.pedagogicalPayload.targetSentences.length,
    bonusRatio: 0,
  });
  const earnedStarDust = capUnitStarDust(args.progression.earnedStarDust, calculatedDust.total);
  const dust: StarDustBreakdown = {
    ...calculatedDust,
    vocabulary: earnedStarDust,
    total: earnedStarDust,
  };

  const baseProgression = completeEntryPractice({
    progression: args.progression,
    launchSession: args.launchSession,
    occurredAt: args.occurredAt,
  });

  const progression: StudentProgressionState = {
    ...baseProgression,
    earnedStarDust: args.progression.earnedStarDust + earnedStarDust,
  };

  const completionEvent: GameProgressEvent = {
    type: "entry_practice_completed",
    unitKey: args.launchSession.unitKey,
    gameMode: args.launchSession.entryMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: withTenantMetadata(args.launchSession, {
      earnedStarDust,
      masteredTerms: args.unit.pedagogicalPayload.vocabularyTerms.length,
      totalTerms: args.unit.pedagogicalPayload.vocabularyTerms.length,
      targetLanguageEngagedItems: args.targetLanguageEngagedItems ?? 0,
      requiredTargetLanguageItems: args.requiredTargetLanguageItems ?? 0,
      supportLanguageUnlockAllowed: false,
    }),
  };

  const unlockEvents: GameProgressEvent[] = getLevelAwareRecommendedGameModes(args.launchSession).map((gameMode, index) => ({
    type: "game_unlocked",
    unitKey: args.launchSession.unitKey,
    gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: withTenantMetadata(args.launchSession, {
      sourceMode: args.launchSession.entryMode,
      unlockedModeIndex: index,
      targetLanguageGateSatisfied: true,
      supportLanguageUnlockAllowed: false,
    }),
  }));

  return {
    progression,
    dust,
    events: [completionEvent, ...unlockEvents],
    completed: true,
  };
}

export function startUnlockedGameMode(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  occurredAt: string;
  replaySeed?: string;
}): GameProgressEvent | undefined {
  if (validateProgressionLaunchIdentity(args.progression, args.launchSession).length > 0) {
    return undefined;
  }

  if (!isLaunchGameModeSupported(args.launchSession, args.gameMode)) {
    return undefined;
  }

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
      replaySeed: resolveCanonicalGameReplaySeed({
        unitKey: args.launchSession.unitKey,
        gameMode: args.gameMode,
        platformReplaySeed: args.replaySeed,
      }),
      tenantId: args.launchSession.tenantId,
    },
  };
}

export function createGameInteractionEvent(args: {
  type: "round_shown" | "answer_submitted" | "answer_result" | "mastery_updated";
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  occurredAt: string;
  replaySeed?: string;
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

  event.metadata = {
    ...args.metadata,
    replaySeed: resolveReplaySeed(args.replaySeed, args.metadata, args.launchSession.unitKey, args.gameMode),
    tenantId: args.launchSession.tenantId,
  };

  return event;
}

export function createAudioRequestedEvent(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  occurredAt: string;
  replaySeed?: string;
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
      replaySeed: resolveCanonicalGameReplaySeed({
        unitKey: args.launchSession.unitKey,
        gameMode: args.gameMode,
        platformReplaySeed: args.replaySeed,
      }),
      tenantId: args.launchSession.tenantId,
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      starDustAwarded: 0,
      supportLanguageUnlockAllowed: false,
    },
  };
}

export function createMicrophonePracticeEvent(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  occurredAt: string;
  microphoneEvent: string;
  promptText: string;
  metadata?: Record<string, string | number | boolean>;
}): GameProgressEvent {
  return {
    type: "microphone_practice",
    unitKey: args.launchSession.unitKey,
    gameMode: args.gameMode,
    launchCode: args.launchSession.launchCode,
    studentSessionId: args.progression.studentSessionId,
    occurredAt: args.occurredAt,
    metadata: withTenantMetadata(args.launchSession, {
      microphoneEvent: args.microphoneEvent,
      promptText: args.promptText,
      microphoneUsed: true,
      uploadUsed: false,
      audioPersisted: false,
      transcriptGenerated: false,
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      supportLanguageUnlockAllowed: false,
      ...args.metadata,
    }),
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
    metadata: withTenantMetadata(args.launchSession, {
      routeStatus: args.routeStatus,
      routeHref: args.routeHref,
      progressionUnlockAllowed: false,
      supportLanguageUnlockAllowed: false,
    }),
  };
}

export function completeGameMode(args: {
  progression: StudentProgressionState;
  launchSession: LaunchSession;
  gameMode: GameModeId;
  earnedStarDust: number;
  occurredAt: string;
  replaySeed?: string;
  metadata?: Record<string, string | number | boolean>;
}): GameModeCompletionResult {
  if (validateProgressionLaunchIdentity(args.progression, args.launchSession).length > 0) {
    return {
      progression: args.progression,
      earnedStarDust: 0,
    };
  }

  if (!isLaunchGameModeSupported(args.launchSession, args.gameMode)) {
    return {
      progression: args.progression,
      earnedStarDust: 0,
    };
  }

  if (!args.progression.unlockedGameModes.includes(args.gameMode)) {
    return {
      progression: args.progression,
      earnedStarDust: 0,
    };
  }

  const alreadyCompleted = args.progression.completedGameModes.includes(args.gameMode);

  if (alreadyCompleted) {
    return {
      progression: args.progression,
      earnedStarDust: 0,
    };
  }

  const earnedStarDust = capUnitStarDust(
    args.progression.earnedStarDust,
    args.earnedStarDust,
    CANONICAL_GAME_COMPLETION_DUST_CAP_BY_MODE[args.gameMode],
  );

  const progression: StudentProgressionState = {
    ...args.progression,
    completedGameModes: Array.from(new Set([...args.progression.completedGameModes, args.gameMode])),
    earnedStarDust: args.progression.earnedStarDust + earnedStarDust,
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
      ...args.metadata,
      replaySeed: resolveReplaySeed(args.replaySeed, args.metadata, args.launchSession.unitKey, args.gameMode),
      tenantId: args.launchSession.tenantId,
      earnedStarDust,
    },
  };

  return {
    progression,
    event,
    earnedStarDust,
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
    metadata: withTenantMetadata(args.launchSession, {
      accessMode: args.launchSession.accessMode,
      entryCodeProvided: Boolean(args.entryCode),
      userCodeProvided: Boolean(args.userCode),
    }),
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
    metadata: withTenantMetadata(args.launchSession, {
      mediaAssetId: args.mediaAsset.mediaAssetId,
      mediaKind: args.mediaAsset.kind,
      mediaType: args.mediaAsset.type,
      durationSeconds: args.mediaAsset.durationSeconds ?? 0,
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      starDustAwarded: 0,
    }),
  };
}

function isLaunchGameModeSupported(launchSession: LaunchSession, gameMode: GameModeId): boolean {
  const level = getCanonicalUnitKeyLevel(launchSession.unitKey);
  return level === undefined || isGameModeSupportedAtLevel(gameMode, level);
}

function capUnitStarDust(currentStarDust: number, requestedStarDust: number, awardCap = UNIT_STAR_DUST_CAP): number {
  if (!Number.isFinite(currentStarDust) || !Number.isFinite(requestedStarDust)) return 0;

  const current = Math.min(Math.max(Math.trunc(currentStarDust), 0), UNIT_STAR_DUST_CAP);
  const cap = Math.min(Math.max(Math.trunc(awardCap), 0), UNIT_STAR_DUST_CAP);
  const requested = Math.min(Math.max(Math.trunc(requestedStarDust), 0), cap);
  return Math.min(requested, Math.max(UNIT_STAR_DUST_CAP - current, 0));
}

function resolveReplaySeed(
  suppliedReplaySeed: string | undefined,
  metadata: Record<string, string | number | boolean> | undefined,
  unitKey: string,
  gameMode: GameModeId,
): string {
  const metadataReplaySeed = typeof metadata?.replaySeed === "string" ? metadata.replaySeed : undefined;
  return resolveCanonicalGameReplaySeed({
    unitKey,
    gameMode,
    platformReplaySeed: suppliedReplaySeed ?? metadataReplaySeed,
  });
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
    metadata: withTenantMetadata(args.launchSession, {
      playlistId: args.playlistId,
      routeHref: args.routeHref,
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      starDustAwarded: 0,
    }),
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
    metadata: withTenantMetadata(args.launchSession, {
      mediaAssetId: args.mediaAsset.mediaAssetId,
      mediaKind: args.mediaAsset.kind,
      mediaType: args.mediaAsset.type,
      volumePercent: args.volumePercent,
      progressionUnlockAllowed: false,
      masteryCreditAllowed: false,
      starDustAwarded: 0,
      pausesForLearningAudio: true,
    }),
  };
}

function withTenantMetadata(
  launchSession: LaunchSession,
  metadata: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> {
  return {
    ...metadata,
    tenantId: launchSession.tenantId,
  };
}
