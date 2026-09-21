import type { GameModeId } from "./index";
import type { ProgressEventStreamPersistenceRecord } from "./progressEventPersistence";
import type { ProgressEventEnvelope } from "./progressEventTaxonomy";

export interface TeacherLaunchReportAggregationScope {
  tenantId: string;
  packageId: string;
  launchCode: string;
}

export interface TeacherLaunchLearnerSummary {
  learnerSlot: string;
  streamCount: number;
  eventCount: number;
  progressEventCount: number;
  reportOnlyEventCount: number;
  supportEventCount: number;
  completedGames: number;
  masteryUpdates: number;
  earnedStarDust: number;
  lastActivityAt: string;
  gameModes: GameModeId[];
}

export interface TeacherLaunchGameModeSummary {
  gameMode: GameModeId;
  streamCount: number;
  eventCount: number;
  completedGames: number;
  masteryUpdates: number;
  earnedStarDust: number;
}

export interface TeacherLaunchReportAggregation {
  reportVersion: 1;
  scope: TeacherLaunchReportAggregationScope;
  learnerCount: number;
  streamCount: number;
  eventCount: number;
  progressEventCount: number;
  reportOnlyEventCount: number;
  supportEventCount: number;
  completedGames: number;
  masteryUpdates: number;
  earnedStarDust: number;
  learnerSummaries: TeacherLaunchLearnerSummary[];
  gameModeSummaries: TeacherLaunchGameModeSummary[];
  excludedFields: ["raw learner audio", "learner transcripts", "real learner identifiers"];
}

/**
 * Creates a deterministic, review-only summary. Raw persistence records stay
 * behind the teacher authorization boundary and are never copied into this
 * report shape.
 */
export function createTeacherLaunchReportAggregation(
  records: ProgressEventStreamPersistenceRecord[],
  scope: TeacherLaunchReportAggregationScope,
): TeacherLaunchReportAggregation {
  const matchingRecords = records.filter((record) =>
    record.tenantId === scope.tenantId &&
    record.packageId === scope.packageId &&
    record.launchCode === scope.launchCode,
  );
  const learners = new Map<string, LearnerAccumulator>();
  const modes = new Map<GameModeId, ModeAccumulator>();

  for (const record of matchingRecords) {
    const learner = learners.get(record.studentSessionId) ?? createLearnerAccumulator();
    learner.streamCount += 1;
    learner.eventCount += record.events.length;
    learner.gameModes.add(record.gameMode);
    learner.lastActivityAt = latestTimestamp(learner.lastActivityAt, record.writtenAt);
    addRecordMetrics(learner, record.events);
    learners.set(record.studentSessionId, learner);

    const mode = modes.get(record.gameMode) ?? createModeAccumulator(record.gameMode);
    mode.streamCount += 1;
    mode.eventCount += record.events.length;
    addRecordMetrics(mode, record.events);
    modes.set(record.gameMode, mode);
  }

  const learnerSummaries = [...learners.entries()]
    .map(([studentSessionId, learner]) => ({
      learnerSlot: createPseudonymousLearnerSlot(studentSessionId),
      streamCount: learner.streamCount,
      eventCount: learner.eventCount,
      progressEventCount: learner.progressEventCount,
      reportOnlyEventCount: learner.reportOnlyEventCount,
      supportEventCount: learner.supportEventCount,
      completedGames: learner.completedGames,
      masteryUpdates: learner.masteryUpdates,
      earnedStarDust: learner.earnedStarDust,
      lastActivityAt: learner.lastActivityAt,
      gameModes: [...learner.gameModes].sort(),
    }))
    .sort((left, right) => left.learnerSlot.localeCompare(right.learnerSlot));
  const gameModeSummaries = [...modes.values()]
    .map((mode) => ({ ...mode, gameMode: mode.gameMode }))
    .sort((left, right) => left.gameMode.localeCompare(right.gameMode));

  return {
    reportVersion: 1,
    scope: { ...scope },
    learnerCount: learnerSummaries.length,
    streamCount: matchingRecords.length,
    eventCount: sum(learnerSummaries, (summary) => summary.eventCount),
    progressEventCount: sum(learnerSummaries, (summary) => summary.progressEventCount),
    reportOnlyEventCount: sum(learnerSummaries, (summary) => summary.reportOnlyEventCount),
    supportEventCount: sum(learnerSummaries, (summary) => summary.supportEventCount),
    completedGames: sum(learnerSummaries, (summary) => summary.completedGames),
    masteryUpdates: sum(learnerSummaries, (summary) => summary.masteryUpdates),
    earnedStarDust: sum(learnerSummaries, (summary) => summary.earnedStarDust),
    learnerSummaries,
    gameModeSummaries,
    excludedFields: ["raw learner audio", "learner transcripts", "real learner identifiers"],
  };
}

export function createPseudonymousLearnerSlot(studentSessionId: string): string {
  let hash = 2166136261;
  for (let index = 0; index < studentSessionId.length; index += 1) {
    hash ^= studentSessionId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `learner-${(hash >>> 0).toString(36).padStart(7, "0")}`;
}

interface MetricsAccumulator {
  eventCount: number;
  progressEventCount: number;
  reportOnlyEventCount: number;
  supportEventCount: number;
  completedGames: number;
  masteryUpdates: number;
  earnedStarDust: number;
}

interface LearnerAccumulator extends MetricsAccumulator {
  streamCount: number;
  lastActivityAt: string;
  gameModes: Set<GameModeId>;
}

interface ModeAccumulator extends MetricsAccumulator {
  gameMode: GameModeId;
  streamCount: number;
}

function createMetricsAccumulator(): MetricsAccumulator {
  return { eventCount: 0, progressEventCount: 0, reportOnlyEventCount: 0, supportEventCount: 0, completedGames: 0, masteryUpdates: 0, earnedStarDust: 0 };
}

function createLearnerAccumulator(): LearnerAccumulator {
  return { ...createMetricsAccumulator(), streamCount: 0, lastActivityAt: "", gameModes: new Set<GameModeId>() };
}

function createModeAccumulator(gameMode: GameModeId): ModeAccumulator {
  return { ...createMetricsAccumulator(), gameMode, streamCount: 0 };
}

function addRecordMetrics(target: MetricsAccumulator, events: ProgressEventEnvelope[]) {
  target.eventCount += events.length;
  for (const event of events) {
    if (event.event_effect === "progress-affecting") target.progressEventCount += 1;
    if (event.event_effect === "report-only") target.reportOnlyEventCount += 1;
    if (event.event_effect === "support-only") target.supportEventCount += 1;
    if (event.event_type === "game_completed") target.completedGames += 1;
    if (event.event_type === "mastery_updated") target.masteryUpdates += 1;
  }
  target.earnedStarDust += readRecordReward(events);
}

// A per-event starDustAwarded value is a delta. earnedStarDust is treated as
// a cumulative snapshot, so only its greatest progress-affecting value counts.
function readRecordReward(events: ProgressEventEnvelope[]): number {
  const progressEvents = events.filter((event) => event.event_effect === "progress-affecting");
  const deltas = progressEvents
    .map((event) => readNumber(event.metadata.starDustAwarded))
    .filter((value): value is number => value !== undefined && value > 0);
  if (deltas.length > 0) return deltas.reduce((total, value) => total + value, 0);
  const snapshots = progressEvents
    .filter((event) => event.event_type === "mastery_updated" || event.event_type === "game_completed")
    .map((event) => readNumber(event.metadata.earnedStarDust))
    .filter((value): value is number => value !== undefined && value >= 0);
  return snapshots.length > 0 ? Math.max(...snapshots) : 0;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function latestTimestamp(current: string, candidate: string): string {
  if (!current) return candidate;
  return candidate > current ? candidate : current;
}

function sum<T>(items: T[], read: (item: T) => number): number {
  return items.reduce((total, item) => total + read(item), 0);
}
