import { Card, StatusPill } from "@living-textbook/ui";
import type {
  TeacherSessionLaunchGateBoundary,
  TeacherSessionLaunchGateBoundaryStatus,
} from "@/data/sampleTeacherSessionMonitor";

interface TeacherSessionLaunchGateBoundaryPanelProps {
  boundary: TeacherSessionLaunchGateBoundary;
}

const statusTone: Record<TeacherSessionLaunchGateBoundaryStatus, "neutral" | "success" | "warning"> = {
  "launch-blocked": "warning",
  "preview-only": "neutral",
  ready: "success",
};

export function TeacherSessionLaunchGateBoundaryPanel({
  boundary,
}: TeacherSessionLaunchGateBoundaryPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session launch gate</p>
          <h2 className="mt-1 text-lg font-bold">{boundary.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{boundary.summary}</p>
          <a
            href={boundary.workspacePath}
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)] underline decoration-[var(--tenant-border)] underline-offset-4 transition hover:text-[var(--tenant-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
          >
            Open classroom launch gate
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={boundary.launchStatus} tone={statusTone[boundary.status]} />
          <StatusPill label="No live classroom launch" tone="warning" />
          <StatusPill label="Preview only" tone="neutral" />
        </div>
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{boundary.sourceOfTruth}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">{boundary.decision}</p>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <BoundaryList title="Blocked actions" items={boundary.blockedActions} tone="warning" />
        <BoundaryList title="Required before live session" items={boundary.requiredBeforeLiveSession} tone="neutral" />
        <BoundaryList title="Report rules" items={boundary.reportRules} tone="warning" />
      </div>
    </Card>
  );
}

function BoundaryList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
