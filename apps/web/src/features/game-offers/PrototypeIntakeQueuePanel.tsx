import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PrototypeIntakePriority,
  PrototypeIntakeQueueItem,
  PrototypeIntakeQueueStatus,
  PrototypeIntakeSurface,
} from "@/data/samplePrototypeIntakeQueue";

interface PrototypeIntakeQueuePanelProps {
  items: PrototypeIntakeQueueItem[];
}

const statusLabel: Record<PrototypeIntakeQueueStatus, string> = {
  "inventory-only": "Inventory only",
  "awaiting-evidence": "Awaiting evidence",
  "ready-for-codex-review": "Ready for Codex review",
  deferred: "Deferred",
};

const priorityLabel: Record<PrototypeIntakePriority, string> = {
  now: "Now",
  next: "Next",
  later: "Later",
};

const surfaceLabel: Record<PrototypeIntakeSurface, string> = {
  "dom-reference": "DOM reference",
  phaser: "Phaser",
  hybrid: "Hybrid",
};

const warningStatuses: PrototypeIntakeQueueStatus[] = ["inventory-only", "awaiting-evidence", "deferred"];

export function PrototypeIntakeQueuePanel({ items }: PrototypeIntakeQueuePanelProps) {
  const nowCount = items.filter((item) => item.priority === "now").length;
  const phaserCount = items.filter((item) => item.targetSurface === "phaser").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Prototype intake queue</p>
          <h2 className="mt-1 text-lg font-bold">Outside game inventory before Codex review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This queue records which Z.ai or outside prototypes would be reviewed first, what evidence is still missing,
            and which actions stay blocked. It does not import code, create routes, mutate scoring, or approve Phaser wrappers.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={`${items.length} candidate(s)`} tone="neutral" />
          <StatusPill label={`${nowCount} now`} tone="success" />
          <StatusPill label={`${phaserCount} Phaser`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <article key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {item.tenantId} / {item.sourceRepo} / {item.parentEngine}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{item.gameMode}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={priorityLabel[item.priority]} tone={item.priority === "now" ? "success" : "neutral"} />
                <StatusPill label={surfaceLabel[item.targetSurface]} tone={item.targetSurface === "phaser" ? "warning" : "success"} />
                <StatusPill
                  label={statusLabel[item.status]}
                  tone={warningStatuses.includes(item.status) ? "warning" : "success"}
                />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{item.summary}</p>
            <a
              className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 text-sm font-bold text-[var(--tenant-text)] underline-offset-4 hover:underline"
              href={item.reviewRoute}
            >
              Open review route
            </a>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <QueueList title="Required evidence" items={item.requiredEvidence} ownerId={item.itemId} />
              <QueueList title="Missing evidence" items={item.missingEvidence} ownerId={item.itemId} tone="warning" />
              <QueueList title="Blocked actions" items={item.blockedActions} ownerId={item.itemId} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function QueueList({
  title,
  items,
  ownerId,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  ownerId: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${ownerId}-${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
