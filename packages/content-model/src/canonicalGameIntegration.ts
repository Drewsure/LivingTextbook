import { UNIT_STAR_DUST_CAP } from "./economyPolicy";
import { isCanonicalGameReplaySeed } from "./canonicalGameReplay";
import { isGameEventType } from "./gameEventTypes";
import type { GameEventType, GameModeId, GameProgressEvent } from "./index";

export const CANONICAL_GAME_REQUIRED_EVENT_ORDER = [
  "game_started",
  "round_shown",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
] as const satisfies readonly GameEventType[];

export const CANONICAL_GAME_SCORING_PROFILE_BY_MODE: Record<GameModeId, string> = {
  flashcards: "entry-vocabulary-practice",
  "memory-match": "pairing-reinforcement-v1",
  "match-up": "pairing-reinforcement-v1",
  "label-it": "pairing-reinforcement-v1",
  quiz: "selection-assessment-v1",
  "true-false": "selection-assessment-v1",
  "sentence-builder": "syntax-construction-v1",
  "fill-in-the-blank": "syntax-construction-v1",
  "type-answer": "spelling-typing-v1",
  "spelling-practice": "spelling-typing-v1",
  "speak-it": "speaking-listening-practice-v1",
  "balloon-pop": "arcade-reinforcement-v1",
};

export interface CanonicalGameEventSequenceReport {
  valid: boolean;
  errors: string[];
  eventTypes: GameEventType[];
}

export interface CanonicalGameEventIdentity {
  unitKey: string;
  launchCode: string;
  studentSessionId: string;
}

/**
 * Validates the platform-owned completion boundary for a playable game route.
 * Audio requests and other report-only events may appear between the required
 * learning events, but the learning sequence itself must remain deterministic.
 */
export function validateCanonicalGameEventSequence(
  rawEvents: GameProgressEvent[],
  expectedGameMode: GameModeId,
  expectedTenantId?: string,
  expectedEarnedStarDust?: number,
  expectedIdentity?: CanonicalGameEventIdentity,
): CanonicalGameEventSequenceReport {
  const events = Array.isArray(rawEvents) ? rawEvents.filter(isGameProgressEvent) : [];
  const errors: string[] = [];
  if (!Array.isArray(rawEvents)) {
    errors.push("Canonical game event sequence must be provided as an array.");
  } else if (events.length !== rawEvents.length) {
    errors.push("Canonical game event sequence contains malformed event entries.");
  }
  const eventTypes = events.map((event) => event.type);
  const unsupportedEventTypes = [...new Set(
    events
      .map((event) => event.type)
      .filter((eventType) => !isGameEventType(eventType)),
  )];
  for (const eventType of unsupportedEventTypes) {
    errors.push(`Canonical game event sequence contains unsupported event type ${String(eventType)}.`);
  }
  const replayEvidenceRequiredTypes: readonly string[] = [
    ...CANONICAL_GAME_REQUIRED_EVENT_ORDER,
    "audio_requested",
  ];

  if (events.length === 0) {
    errors.push("Canonical game event sequence must include at least one event.");
  }

  for (const event of events) {
    if (readNonBlankString(event.metadata?.tenantId) === undefined) {
      errors.push(`Canonical game event ${event.type} must include tenantId metadata.`);
    }
    if (readNonBlankString(event.unitKey) === undefined) {
      errors.push(`Canonical game event ${event.type} must include unit identity.`);
    }
    if (readNonBlankString(event.launchCode) === undefined) {
      errors.push(`Canonical game event ${event.type} must include launch identity.`);
    }
    if (readNonBlankString(event.studentSessionId) === undefined) {
      errors.push(`Canonical game event ${event.type} must include student session identity.`);
    }
  }

  if (!events.some((event) => event.type === "game_started")) {
    errors.push("Canonical game event sequence must include game_started.");
  }

  if (!events.some((event) => event.type === "round_shown")) {
    errors.push("Canonical game event sequence must include round_shown.");
  }

  if (!events.some((event) => event.type === "answer_submitted")) {
    errors.push("Canonical game event sequence must include answer_submitted.");
  }

  if (!events.some((event) => event.type === "answer_result")) {
    errors.push("Canonical game event sequence must include answer_result.");
  }

  if (!events.some((event) => event.type === "audio_requested")) {
    errors.push("Canonical game event sequence must include audio_requested evidence.");
  }

  const gameStartedIndex = events.findIndex((event) => event.type === "game_started");
  const audioEvents = events.filter((event) => event.type === "audio_requested");
  if (gameStartedIndex >= 0 && !events.some((event, index) => event.type === "audio_requested" && index > gameStartedIndex)) {
    errors.push("Canonical game event sequence must include audio_requested evidence after game_started.");
  }
  for (const audioEvent of audioEvents) {
    const cueText = audioEvent.metadata?.cueText;
    const language = audioEvent.metadata?.language;
    const cueKind = audioEvent.metadata?.cueKind;
    if (typeof cueText !== "string" || cueText.trim().length === 0) {
      errors.push("Canonical game audio_requested events must include non-blank cueText.");
    }
    if (typeof language !== "string" || language.trim().length === 0) {
      errors.push("Canonical game audio_requested events must include a language.");
    }
    if (!["term", "sentence", "instruction", "feedback"].includes(String(cueKind))) {
      errors.push("Canonical game audio_requested events must include a supported cueKind.");
    }
  }

  if (!events.some((event) => event.type === "mastery_updated")) {
    errors.push("Canonical game event sequence must include mastery_updated.");
  }

  if (!events.some((event) => event.type === "game_completed")) {
    errors.push("Canonical game event sequence must include game_completed.");
  }

  const modeMismatch = events.find((event) => event.gameMode !== expectedGameMode);
  if (modeMismatch) {
    errors.push(
      `Canonical game event sequence must use game mode ${expectedGameMode}; found ${modeMismatch.gameMode} on ${modeMismatch.type}.`,
    );
  }

  if (expectedTenantId) {
    const tenantMismatch = events.find((event) => event.metadata?.tenantId !== expectedTenantId);
    if (tenantMismatch) {
      errors.push(
        `Canonical game event sequence must preserve tenant ${expectedTenantId}; ${tenantMismatch.type} has tenant ${String(tenantMismatch.metadata?.tenantId ?? "(missing)")}.`,
      );
    }
  }

  if (expectedIdentity) {
    for (const event of events) {
      if (event.unitKey !== expectedIdentity.unitKey) {
        errors.push(
          `Canonical game event ${event.type} must preserve unit ${expectedIdentity.unitKey}; found ${event.unitKey}.`,
        );
      }

      if (event.launchCode !== expectedIdentity.launchCode) {
        errors.push(
          `Canonical game event ${event.type} must preserve launch ${expectedIdentity.launchCode}; found ${String(event.launchCode ?? "(missing)")}.`,
        );
      }

      if (event.studentSessionId !== expectedIdentity.studentSessionId) {
        errors.push(
          `Canonical game event ${event.type} must preserve student session ${expectedIdentity.studentSessionId}; found ${String(event.studentSessionId ?? "(missing)")}.`,
        );
      }
    }
  }

  const answerSubmittedCount = countEvents(events, "answer_submitted");
  const answerResultCount = countEvents(events, "answer_result");
  if (answerSubmittedCount !== answerResultCount) {
    errors.push(
      `Canonical game event sequence must pair answer_submitted and answer_result events; found ${answerSubmittedCount} and ${answerResultCount}.`,
    );
  }

  if (countEvents(events, "game_started") !== 1) {
    errors.push("Canonical game event sequence must contain exactly one game_started event.");
  }

  if (countEvents(events, "game_completed") !== 1) {
    errors.push("Canonical game event sequence must contain exactly one game_completed event.");
  }

  if (countEvents(events, "mastery_updated") !== 1) {
    errors.push("Canonical game event sequence must contain exactly one mastery_updated event.");
  }

  const masteryEvent = events.find((event) => event.type === "mastery_updated");
  const completionEvent = events.find((event) => event.type === "game_completed");
  const masteryIndex = events.findIndex((event) => event.type === "mastery_updated");
  const completionIndex = events.findIndex((event) => event.type === "game_completed");
  const lastAnswerActivityIndex = Math.max(
    findLastEventIndex(events, "answer_submitted"),
    findLastEventIndex(events, "answer_result"),
  );

  for (let index = 1; index < events.length; index += 1) {
    const previousTime = Date.parse(events[index - 1].occurredAt);
    const currentTime = Date.parse(events[index].occurredAt);
    if (!Number.isFinite(previousTime) || !Number.isFinite(currentTime)) {
      errors.push("Canonical game event sequence must use valid occurredAt timestamps.");
      break;
    }
    if (currentTime < previousTime) {
      errors.push("Canonical game event sequence must be chronological by occurredAt.");
      break;
    }
  }

  if (masteryIndex >= 0 && lastAnswerActivityIndex > masteryIndex) {
    errors.push("Canonical game event sequence must place all answer activity before mastery_updated.");
  }

  if (completionIndex >= 0 && lastAnswerActivityIndex > completionIndex) {
    errors.push("Canonical game event sequence must place all answer activity before game_completed.");
  }

  if (completionIndex >= 0) {
    const gameplayEventsAfterCompletion = events
      .slice(completionIndex + 1)
      .filter((event) => ["game_started", "round_shown", "answer_submitted", "answer_result", "mastery_updated"].includes(event.type));
    for (const event of gameplayEventsAfterCompletion) {
      errors.push(`Canonical game event sequence must not include ${event.type} after game_completed.`);
    }
  }

  const masteryDust = readFiniteStarDust(masteryEvent);
  const completionDust = readFiniteStarDust(completionEvent);

  if (masteryEvent && masteryEvent.metadata?.completed !== true) {
    errors.push("Canonical game mastery_updated event must mark the completed game as true.");
  }

  if (masteryEvent && masteryDust === undefined) {
    errors.push(`Canonical game mastery_updated event must include an integer earnedStarDust value from 0 to ${UNIT_STAR_DUST_CAP}.`);
  }

  if (completionEvent && completionDust === undefined) {
    errors.push(`Canonical game game_completed event must include an integer earnedStarDust value from 0 to ${UNIT_STAR_DUST_CAP}.`);
  }

  if (masteryDust !== undefined && completionDust !== undefined && masteryDust !== completionDust) {
    errors.push(
      `Canonical game mastery and completion awards must agree; found ${masteryDust} and ${completionDust}.`,
    );
  }

  if (expectedEarnedStarDust !== undefined && completionDust !== undefined && completionDust !== expectedEarnedStarDust) {
    errors.push(
      `Canonical game completion award must match the progression result; expected ${expectedEarnedStarDust}, found ${completionDust}.`,
    );
  }

  if (masteryEvent && typeof masteryEvent.metadata?.scoringProfileId !== "string") {
    errors.push("Canonical game mastery_updated event must identify its deterministic scoring profile.");
  }

  const masteryScoringProfileId = readNonBlankString(masteryEvent?.metadata?.scoringProfileId);
  const completionScoringProfileId = readNonBlankString(completionEvent?.metadata?.scoringProfileId);
  if (completionEvent && completionScoringProfileId === undefined) {
    errors.push("Canonical game game_completed event must identify its deterministic scoring profile.");
  }
  if (
    masteryScoringProfileId !== undefined
    && completionScoringProfileId !== undefined
    && masteryScoringProfileId !== completionScoringProfileId
  ) {
    errors.push(
      `Canonical game mastery and completion scoring profiles must agree; found ${masteryScoringProfileId} and ${completionScoringProfileId}.`,
    );
  }

  const expectedScoringProfileId = CANONICAL_GAME_SCORING_PROFILE_BY_MODE[expectedGameMode];
  if (masteryEvent && masteryScoringProfileId !== expectedScoringProfileId) {
    errors.push(
      `Canonical game mastery_updated event must use scoring profile ${expectedScoringProfileId} for game mode ${expectedGameMode}; found ${masteryScoringProfileId ?? "(missing)"}.`,
    );
  }
  if (completionEvent && completionScoringProfileId !== expectedScoringProfileId) {
    errors.push(
      `Canonical game game_completed event must use scoring profile ${expectedScoringProfileId} for game mode ${expectedGameMode}; found ${completionScoringProfileId ?? "(missing)"}.`,
    );
  }

  const requiredIndexes = CANONICAL_GAME_REQUIRED_EVENT_ORDER.map((eventType) =>
    events.findIndex((event) => event.type === eventType),
  );

  for (let index = 1; index < requiredIndexes.length; index += 1) {
    const previousIndex = requiredIndexes[index - 1];
    const currentIndex = requiredIndexes[index];
    if (previousIndex >= 0 && currentIndex >= 0 && currentIndex <= previousIndex) {
      errors.push(
        `Canonical game event sequence must place ${CANONICAL_GAME_REQUIRED_EVENT_ORDER[index]} after ${CANONICAL_GAME_REQUIRED_EVENT_ORDER[index - 1]}.`,
      );
    }
  }

  let canonicalReplaySeed: string | undefined;
  for (const event of events) {
    if (
      replayEvidenceRequiredTypes.includes(event.type)
      && !isCanonicalGameReplaySeed(event.metadata?.replaySeed)
    ) {
      errors.push(`Canonical game event ${event.type} must carry replay-v1 evidence.`);
    }

    if (replayEvidenceRequiredTypes.includes(event.type) && typeof event.metadata?.replaySeed === "string") {
      if (canonicalReplaySeed === undefined) {
        canonicalReplaySeed = event.metadata.replaySeed;
      } else if (canonicalReplaySeed !== event.metadata.replaySeed) {
        errors.push(
          `Canonical game event ${event.type} must preserve replay seed ${canonicalReplaySeed}; found ${event.metadata.replaySeed}.`,
        );
      }
    }

    if (event.metadata?.supportLanguageUnlockAllowed === true) {
      errors.push(`Canonical game event ${event.type} must not unlock progress through support language.`);
    }

    if (event.metadata?.masteryCreditAllowed === true && event.type === "audio_requested") {
      errors.push("Canonical game audio_requested events must not carry mastery credit.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    eventTypes,
  };
}

function countEvents(events: GameProgressEvent[], eventType: GameEventType): number {
  return events.filter((event) => event.type === eventType).length;
}

function findLastEventIndex(events: GameProgressEvent[], eventType: GameEventType): number {
  return events.reduce((lastIndex, event, index) => (event.type === eventType ? index : lastIndex), -1);
}

function isGameProgressEvent(value: unknown): value is GameProgressEvent {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readFiniteStarDust(event: GameProgressEvent | undefined): number | undefined {
  const value = event?.metadata?.earnedStarDust;
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    return undefined;
  }

  return value >= 0 && value <= UNIT_STAR_DUST_CAP ? value : undefined;
}

function readNonBlankString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}
