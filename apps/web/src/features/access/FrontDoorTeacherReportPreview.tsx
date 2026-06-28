import { Card, StatusPill } from "@living-textbook/ui";
import type { GameProgressEvent, StudentProgressionState } from "@living-textbook/content-model";
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
  const mediaStarts = countEvents(events, "media_started");
  const mediaCompletions = countEvents(events, "media_completed");
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
            The route keeps game progress and media engagement together while still reporting them separately.
          </p>
        </div>
        <StatusPill label={`${events.length} events`} tone={events.length > 0 ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Metric label="Entry practice" value={String(entryPracticeCompletions)} />
        <Metric label="Game starts" value={String(gameStarts)} />
        <Metric label="Game complete" value={String(gameCompletions)} />
        <Metric label="Media starts" value={String(mediaStarts)} />
        <Metric label="Media complete" value={String(mediaCompletions)} />
        <Metric label="Background media" value={String(backgroundMediaEvents)} />
        <Metric label={tenant.rewardName} value={String(progression.earnedStarDust)} />
      </dl>

      <div className="mt-5 grid gap-2 text-sm text-[var(--tenant-muted)]">
        {events.length === 0 ? (
          <p className="rounded-lg border border-[var(--tenant-border)] p-4">Open the unit to begin the report stream.</p>
        ) : (
          events.map((event, index) => (
            <div key={`${event.type}-${event.occurredAt}-${index}`} className="rounded-lg border border-[var(--tenant-border)] p-3">
              <p className="font-semibold text-[var(--tenant-text)]">{event.type}</p>
              <p className="mt-1">{event.gameMode} / {event.studentSessionId}</p>
            </div>
          ))
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
