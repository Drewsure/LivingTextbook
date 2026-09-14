import type { GameModeId, GameProgressEvent } from "./index";
import {
  CANONICAL_GAME_REQUIRED_EVENT_ORDER,
  validateCanonicalGameEventSequence,
} from "./canonicalGameIntegration";

export type CanonicalGameReportEvidenceStatus = "blocked" | "ready";

export interface CanonicalGameReportEvidenceGroup {
  evidenceId: string;
  attemptNumber: number;
  unitKey: string;
  launchCode: string;
  studentSessionId: string;
  gameMode: GameModeId;
  eventCount: number;
  status: CanonicalGameReportEvidenceStatus;
  eventTypes: GameProgressEvent["type"][];
  errors: string[];
}

export interface CanonicalGameReportEvidence {
  valid: boolean;
  status: CanonicalGameReportEvidenceStatus;
  groups: CanonicalGameReportEvidenceGroup[];
  errors: string[];
}

const canonicalEventTypes = new Set<string>([
  ...CANONICAL_GAME_REQUIRED_EVENT_ORDER,
  "audio_requested",
]);
const canonicalLearningEventTypes = new Set<string>(CANONICAL_GAME_REQUIRED_EVENT_ORDER);

/**
 * Checks the game evidence lane of a teacher report without treating support,
 * media, or navigation events as game completion evidence.
 */
export function validateCanonicalGameReportEvidence(
  events: GameProgressEvent[],
  expectedTenantId?: string,
  expectedLaunchCode?: string,
  expectedTargetLanguage?: string,
): CanonicalGameReportEvidence {
  const groups = new Map<string, GameProgressEvent[][]>();

  for (const event of events) {
    if (!canonicalEventTypes.has(event.type)) continue;

    const key = [event.unitKey, event.launchCode ?? "", event.studentSessionId ?? "", event.gameMode].join("|");
    const attempts = groups.get(key) ?? [];
    let group: GameProgressEvent[] | undefined = attempts[attempts.length - 1];
    if (event.type === "game_started" && group?.some((item) => item.type === "game_started")) {
      group = undefined;
    }
    if (!group) {
      group = [];
      attempts.push(group);
    }
    group.push(event);
    groups.set(key, attempts);
  }

  const evidenceGroups = [...groups.values()]
    .flatMap((attempts) => attempts.filter((group) => group.some((event) => canonicalLearningEventTypes.has(event.type))))
    .map((group, index) => {
      const firstEvent = group[0];
      const launchCode = firstEvent.launchCode ?? "";
      const studentSessionId = firstEvent.studentSessionId ?? "";
      const errors: string[] = [];

      if (!launchCode) errors.push("Canonical report game evidence must include launchCode.");
      if (!studentSessionId) errors.push("Canonical report game evidence must include studentSessionId.");
      if (expectedLaunchCode && launchCode !== expectedLaunchCode) {
        errors.push(`Canonical report game evidence must use launchCode ${expectedLaunchCode}; found ${launchCode || "(missing)"}.`);
      }

      const replay = validateCanonicalGameEventSequence(
        group,
        firstEvent.gameMode,
        expectedTenantId,
        undefined,
        launchCode && studentSessionId
          ? { unitKey: firstEvent.unitKey, launchCode, studentSessionId }
          : undefined,
        expectedTargetLanguage,
      );
      errors.push(...replay.errors);

      return {
        evidenceId: `canonical-game-report:${String(index + 1).padStart(3, "0")}:${firstEvent.gameMode}`,
        attemptNumber: index + 1,
        unitKey: firstEvent.unitKey,
        launchCode,
        studentSessionId,
        gameMode: firstEvent.gameMode,
        eventCount: group.length,
        status: errors.length === 0 ? "ready" : "blocked",
        eventTypes: replay.eventTypes,
        errors: [...new Set(errors)],
      } satisfies CanonicalGameReportEvidenceGroup;
    });

  const errors = evidenceGroups.flatMap((group) => group.errors.map((error) => `${group.gameMode}: ${error}`));
  if (evidenceGroups.length === 0) {
    errors.push("Canonical report game evidence must include at least one game event group.");
  }

  return {
    valid: evidenceGroups.length > 0 && errors.length === 0,
    status: evidenceGroups.length > 0 && errors.length === 0 ? "ready" : "blocked",
    groups: evidenceGroups,
    errors: [...new Set(errors)],
  };
}
