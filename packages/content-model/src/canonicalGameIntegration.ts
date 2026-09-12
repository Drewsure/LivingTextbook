import { UNIT_STAR_DUST_CAP } from "./economyPolicy";
import type { GameEventType, GameModeId, GameProgressEvent } from "./index";

export const CANONICAL_GAME_REQUIRED_EVENT_ORDER = [
  "game_started",
  "round_shown",
  "answer_submitted",
  "answer_result",
  "mastery_updated",
  "game_completed",
] as const satisfies readonly GameEventType[];

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
  events: GameProgressEvent[],
  expectedGameMode: GameModeId,
  expectedTenantId?: string,
  expectedEarnedStarDust?: number,
  expectedIdentity?: CanonicalGameEventIdentity,
): CanonicalGameEventSequenceReport {
  const errors: string[] = [];
  const eventTypes = events.map((event) => event.type);
  const replayEvidenceRequiredTypes: readonly string[] = [
    ...CANONICAL_GAME_REQUIRED_EVENT_ORDER,
    "audio_requested",
  ];

  if (events.length === 0) {
    errors.push("Canonical game event sequence must include at least one event.");
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

  for (const event of events) {
    if (
      replayEvidenceRequiredTypes.includes(event.type)
      && (typeof event.metadata?.replaySeed !== "string" || !event.metadata.replaySeed.startsWith("replay-v1:"))
    ) {
      errors.push(`Canonical game event ${event.type} must carry replay-v1 evidence.`);
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

function readFiniteStarDust(event: GameProgressEvent | undefined): number | undefined {
  const value = event?.metadata?.earnedStarDust;
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
    return undefined;
  }

  return value >= 0 && value <= UNIT_STAR_DUST_CAP ? value : undefined;
}
