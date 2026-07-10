import { Card, StatusPill } from "@living-textbook/ui";
import type { GameProgressEvent, StudentProgressionState } from "@living-textbook/content-model";
import { getTrainingEventType, summarizeTrainingRecoveryEvents } from "@/features/training/TrainingRecoveryReportSummary";
import type { TenantConfig } from "@/features/tenant/types";

interface FrontDoorTeacherReportPreviewProps {
  tenant: TenantConfig;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
}

export function FrontDoorTeacherReportPreview({ tenant, progression, events }: FrontDoorTeacherReportPreviewProps) {
  const entryPracticeCompletions = countEvents(events, "entry_practice_completed");
  const gameStarts = countEvents(events, "game_started");
  const gameCompletions = countEvents(events, "game_completed");
  const cardReveals = countEvents(events, "round_shown");
  const answersSubmitted = countEvents(events, "answer_submitted");
  const answerResults = countEvents(events, "answer_result");
  const masteryUpdates = countEvents(events, "mastery_updated");
  const mediaPlaylistOpens = countEvents(events, "media_playlist_opened");
  const mediaStarts = countEvents(events, "media_started");
  const mediaPauses = countEvents(events, "media_paused");
  const mediaCompletions = countEvents(events, "media_completed");
  const routeGuidanceListens = countEvents(events, "route_guidance_listened");
  const targetLanguageItemsHeard = sumMetadataNumber(events, "targetLanguageItemsHeard");
  const supportLanguageTaps = sumMetadataNumber(events, "supportLanguageTaps");
  const supportLanguageUnlockEvents = countMetadataBoolean(events, "supportLanguageUnlockAllowed", true);
  const recoverySummary = summarizeTrainingRecoveryEvents(events);
  const learnerLabels = collectLearnerLabels(events, progression.studentSessionId);
  const backgroundMediaEvents = events.filter(
    (event) => event.type === "background_media_enabled" || event.type === "background_media_disabled",
  ).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher-visible summary</p>
          <h3 className="text-lg font-bold">One report stream</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            The route keeps game progress, recovery practice, item attempts, and media engagement together while still reporting them separately.
          </p>
        </div>
        <StatusPill label={`${events.length} events`} tone={events.length > 0 ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Metric label="Learner slots" value={String(learnerLabels.length)} />
        <Metric label="Entry practice" value={String(entryPracticeCompletions)} />
        <Metric label="Game starts" value={String(gameStarts)} />
        <Metric label="Game complete" value={String(gameCompletions)} />
        <Metric label="Recovery events" value={String(recoverySummary.trainingEventCount)} />
        <Metric label="Recovery complete" value={String(recoverySummary.completedCount)} />
        <Metric label="Recovery returns" value={String(recoverySummary.returnedCount)} />
        <Metric label="Recovery reward" value={String(recoverySummary.earnedRecoveryReward)} />
        <Metric label="Card reveals" value={String(cardReveals)} />
        <Metric label="Answers" value={String(answersSubmitted)} />
        <Metric label="Results" value={String(answerResults)} />
        <Metric label="Mastery updates" value={String(masteryUpdates)} />
        <Metric label="Playlist opens" value={String(mediaPlaylistOpens)} />
        <Metric label="Media starts" value={String(mediaStarts)} />
        <Metric label="Media pauses" value={String(mediaPauses)} />
        <Metric label="Media complete" value={String(mediaCompletions)} />
        <Metric label="Route listens" value={String(routeGuidanceListens)} />
        <Metric label="English audio heard" value={String(targetLanguageItemsHeard)} />
        <Metric label="Support taps" value={String(supportLanguageTaps)} />
        <Metric label="Support unlocks" value={String(supportLanguageUnlockEvents)} />
        <Metric label="Background media" value={String(backgroundMediaEvents)} />
        <Metric label={tenant.rewardName} value={String(progression.earnedStarDust)} />
      </dl>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-[var(--tenant-text)]">Learner identity</p>
            <p className="mt-1">Reports use coded learner slots, not real names or accounts in the foundation slice.</p>
          </div>
          <StatusPill label="Coded slots" tone="neutral" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {learnerLabels.map((label) => (
            <span key={label} className="rounded-full border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--tenant-text)]">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-[var(--tenant-text)]">Language engagement rule</p>
            <p className="mt-1">
              English audio engagement can support progression. Support-language taps are reportable comprehension support only.
            </p>
          </div>
          <StatusPill label={supportLanguageUnlockEvents === 0 ? "Support only" : "Review"} tone={supportLanguageUnlockEvents === 0 ? "success" : "warning"} />
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
        <p className="font-semibold text-[var(--tenant-text)]">Recovery detail</p>
        <p className="mt-1">
          {recoverySummary.trainingEventCount > 0
            ? `${recoverySummary.focusLabel} via ${recoverySummary.modeLabel}; return path ${recoverySummary.returnPathLabel}.`
            : "No Training Academy recovery has been recorded for this stream yet."}
        </p>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-[var(--tenant-muted)]">
        {events.length === 0 ? (
          <p className="rounded-lg border border-[var(--tenant-border)] p-4">Open the unit to begin the report stream.</p>
        ) : (
          events.map((event, index) => {
            const trainingEventType = getTrainingEventType(event);
            const eventLabel = trainingEventType ?? event.type;

            return (
              <div key={`${event.type}-${event.occurredAt}-${index}`} className="rounded-lg border border-[var(--tenant-border)] p-3">
                <p className="font-semibold text-[var(--tenant-text)]">{eventLabel}</p>
                <p className="mt-1">{event.gameMode} / {event.studentSessionId}</p>
                {event.metadata && <p className="mt-2 font-mono text-xs">{formatMetadata(event.metadata)}</p>}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function countEvents(events: GameProgressEvent[], type: GameProgressEvent["type"]): number {
  return events.filter((event) => event.type === type).length;
}

function sumMetadataNumber(events: GameProgressEvent[], key: string): number {
  return events.reduce((total, event) => {
    const value = event.metadata?.[key];
    return typeof value === "number" ? total + value : total;
  }, 0);
}

function countMetadataBoolean(events: GameProgressEvent[], key: string, expected: boolean): number {
  return events.filter((event) => event.metadata?.[key] === expected).length;
}

function collectLearnerLabels(events: GameProgressEvent[], fallbackSessionId: string): string[] {
  const sessionIds = new Set([fallbackSessionId]);

  for (const event of events) {
    if (event.studentSessionId) {
      sessionIds.add(event.studentSessionId);
    }
  }

  return Array.from(
    new Set(
      Array.from(sessionIds).map((sessionId) => {
        const parts = sessionId.split(":");
        return parts[parts.length - 1] || sessionId;
      }),
    ),
  );
}

function formatMetadata(metadata: NonNullable<GameProgressEvent["metadata"]>): string {
  return Object.entries(metadata)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(" | ");
}
