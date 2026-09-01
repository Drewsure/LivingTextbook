import { Card, StatusPill } from "@living-textbook/ui";
import type { FoundationStatusSnapshot, FoundationStatusSnapshotTone } from "@/data/sampleFoundationStatusSnapshot";

interface FoundationStatusSnapshotPanelProps {
  snapshot: FoundationStatusSnapshot;
}

const toneMap: Record<FoundationStatusSnapshotTone, "neutral" | "success" | "warning"> = {
  neutral: "neutral",
  success: "success",
  warning: "warning",
};

export function FoundationStatusSnapshotPanel({ snapshot }: FoundationStatusSnapshotPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Build stage</p>
          <h2 className="mt-1 text-lg font-bold">{snapshot.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{snapshot.summary}</p>
        </div>
        <a
          href={snapshot.controlRoomPath}
          className="inline-flex min-h-10 items-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-[var(--tenant-primary-text)] transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open foundation control room
        </a>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-4">
        {snapshot.items.map((item) => (
          <section key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.label}</p>
              <StatusPill label={item.tone === "warning" ? "Guarded" : "OK"} tone={toneMap[item.tone]} />
            </div>
            <p className="mt-2 text-base font-bold text-[var(--tenant-text)]">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{item.detail}</p>
          </section>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Still blocked</p>
        <ul className="mt-2 grid gap-2 text-sm leading-5 text-[var(--tenant-muted)] sm:grid-cols-2 lg:grid-cols-5">
          {snapshot.blockedActions.map((action, index) => (
            <li key={`${snapshot.snapshotId}-blocked-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              {action}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}
