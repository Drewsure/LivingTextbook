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

/**
 * Validates the platform-owned completion boundary for a playable game route.
 * Audio requests and other report-only events may appear between the required
 * learning events, but the learning sequence itself must remain deterministic.
 */
export function validateCanonicalGameEventSequence(
  events: GameProgressEvent[],
  expectedGameMode: GameModeId,
  expectedTenantId?: string,
): CanonicalGameEventSequenceReport {
  const errors: string[] = [];
  const eventTypes = events.map((event) => event.type);

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
