import { Card, StatusPill } from "@living-textbook/ui";
import type { FoundationWorkstreamIndex, FoundationWorkstreamStatus } from "@/data/sampleFoundationWorkstreamIndex";

interface FoundationWorkstreamIndexPanelProps {
  index: FoundationWorkstreamIndex;
}

const statusTone: Record<FoundationWorkstreamStatus, "neutral" | "success" | "warning"> = {
  active: "success",
  guarded: "neutral",
  blocked: "warning",
  "future-alert": "warning",
};

const statusLabel: Record<FoundationWorkstreamStatus, string> = {
  active: "Active",
  guarded: "Guarded",
  blocked: "Blocked",
  "future-alert": "Future alert",
};

export function FoundationWorkstreamIndexPanel({ index }: FoundationWorkstreamIndexPanelProps) {
  const activeCount = index.items.filter((item) => item.status === "active").length;
  const guardedCount = index.items.filter((item) => item.status === "guarded").length;
  const blockedCount = index.items.filter((item) => item.status === "blocked" || item.status === "future-alert").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Visible build map</p>
          <h2 className="mt-1 text-lg font-bold">{index.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{index.summary}</p>
        </div>
        <StatusPill label="No live feature activation" tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Current build focus</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{index.currentBuildFocus}</p>
      </section>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <WorkstreamMetric label="Active lanes" value={String(activeCount)} />
        <WorkstreamMetric label="Guarded lanes" value={String(guardedCount)} />
        <WorkstreamMetric label="Blocked or future" value={String(blockedCount)} />
      </dl>

      <div className="mt-5 grid gap-3 xl:grid-cols-3">
        {index.items.map((item) => (
          <article key={item.workstreamId} className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.owner}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h3>
              </div>
              <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{item.currentFocus}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Visible evidence</p>
              <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
                {item.visibleEvidence.map((evidence, indexValue) => (
                  <li key={`${item.workstreamId}-evidence-${indexValue}`}>{evidence}</li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Next gate:</span> {item.nextGate}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Blocked shortcuts</p>
        <ul className="mt-2 grid gap-2 text-sm leading-5 text-[var(--tenant-muted)] sm:grid-cols-2 lg:grid-cols-3">
          {index.blockedShortcuts.map((shortcut, indexValue) => (
            <li key={`${index.indexId}-shortcut-${indexValue}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              {shortcut}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function WorkstreamMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
