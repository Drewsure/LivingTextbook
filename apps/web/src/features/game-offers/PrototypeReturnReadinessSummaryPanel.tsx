import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PrototypeReturnReadinessLane,
  PrototypeReturnReadinessStatus,
  PrototypeReturnReadinessSummary,
} from "@/data/samplePrototypeReturnReadinessSummary";

interface PrototypeReturnReadinessSummaryPanelProps {
  summary: PrototypeReturnReadinessSummary;
}

const statusLabel: Record<PrototypeReturnReadinessStatus, string> = {
  "not-ready": "Not ready",
  "evidence-review-needed": "Evidence review needed",
  "ready-for-codex-return-review": "Ready for Codex return review",
};

const laneTone: Record<PrototypeReturnReadinessLane["status"], "success" | "warning"> = {
  ready: "success",
  missing: "warning",
  blocked: "warning",
};

export function PrototypeReturnReadinessSummaryPanel({ summary }: PrototypeReturnReadinessSummaryPanelProps) {
  const readyCount = summary.lanes.filter((lane) => lane.status === "ready").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Prototype return readiness</p>
          <h2 className="mt-1 text-lg font-bold">{summary.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{summary.summary}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={statusLabel[summary.status]} tone="warning" />
          <StatusPill label={`${readyCount}/${summary.lanes.length} ready`} tone={readyCount === summary.lanes.length ? "success" : "warning"} />
          <StatusPill label={summary.codexReviewState} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {summary.lanes.map((lane) => (
          <section key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h3>
              <StatusPill label={lane.status} tone={laneTone[lane.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.summary}</p>
          </section>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Blocked return actions</h3>
          <StatusPill label={String(summary.blockedNextActions.length)} tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
          {summary.blockedNextActions.map((action, index) => (
            <li key={`${summary.summaryId}-${index}-${action}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              {action}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}
