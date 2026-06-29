import { Card, StatusPill } from "@living-textbook/ui";
import type { GameProgressEvent } from "@living-textbook/content-model";
import { formatLabel, formatMode } from "../studentLabels";

interface SessionEventLogProps {
  events: GameProgressEvent[];
}

export function SessionEventLog({ events }: SessionEventLogProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Progress Event Log</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            This session has recorded {events.length} update{events.length === 1 ? "" : "s"}.
          </p>
        </div>
        <StatusPill label={events.length > 0 ? "Updated" : "Waiting"} tone={events.length > 0 ? "success" : "neutral"} />
      </div>
      <div className="mt-4 grid gap-3">
        {events.length === 0 ? (
          <p className="rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
            Complete the flashcards to record the first progress update.
          </p>
        ) : (
          events.map((event, index) => (
            <div key={`${event.type}-${event.gameMode}-${index}`} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <p className="text-sm font-semibold">{formatLabel(event.type)}</p>
              <p className="mt-1 font-mono text-xs text-[var(--tenant-muted)]">{event.type}</p>
              <p className="mt-1 text-sm text-[var(--tenant-muted)]">{formatMode(event.gameMode)}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
