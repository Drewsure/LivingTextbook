import { Card, StatusPill } from "@living-textbook/ui";
import type { SourceReviewItem, SourceReviewQueue, SourceReviewStatus } from "@/data/sampleSourceReviewQueue";
import { countSourceReviewItemsByStatus } from "@/data/sampleSourceReviewQueue";

interface SourceReviewQueuePanelProps {
  queue: SourceReviewQueue;
}

const statusTone: Record<SourceReviewStatus, "neutral" | "success" | "warning"> = {
  received: "neutral",
  triage: "neutral",
  "needs-owner": "warning",
  "ready-for-extraction": "success",
  blocked: "warning",
};

export function SourceReviewQueuePanel({ queue }: SourceReviewQueuePanelProps) {
  const readyCount = countSourceReviewItemsByStatus(queue, "ready-for-extraction");
  const ownerCount = countSourceReviewItemsByStatus(queue, "needs-owner");
  const triageCount = countSourceReviewItemsByStatus(queue, "triage");
  const blockedCount = queue.items.reduce((total, item) => total + item.blockedBy.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source review queue</p>
          <h2 className="mt-1 text-lg font-bold">{queue.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{queue.summary}</p>
        </div>
        <StatusPill label="Review first" tone="success" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QueueMetric label="Sources" value={String(queue.items.length)} tone="neutral" />
        <QueueMetric label="Ready" value={String(readyCount)} tone="success" />
        <QueueMetric label="Owner needed" value={String(ownerCount)} tone="warning" />
        <QueueMetric label="Triage" value={String(triageCount)} tone="neutral" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Hard rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What source intake cannot skip</h3>
          </div>
          <StatusPill label={`${blockedCount} blockers`} tone={blockedCount > 0 ? "warning" : "success"} />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {queue.hardRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <SourceReviewList title="Required records before extraction promotion" items={queue.requiredRecords} tone="neutral" />
        <SourceReviewList title="Blocked extraction shortcuts" items={queue.blockedShortcuts} tone="warning" />
      </div>

      <div className="mt-5 grid gap-4">
        {queue.items.map((item) => (
          <SourceReviewItemCard key={item.sourceId} item={item} />
        ))}
      </div>
    </Card>
  );
}

function QueueMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function SourceReviewItemCard({ item }: { item: SourceReviewItem }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.tenantName}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{item.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {item.kind} / {item.sourceReference} / package {item.targetPackageId}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={item.status} tone={statusTone[item.status]} />
          <StatusPill label={item.owner} tone={item.owner === "rights-review" ? "warning" : "neutral"} />
        </div>
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Extraction plan</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{item.extractionPlan}</p>
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <SourceReviewList title="Review needs" items={item.reviewNeeds} tone="neutral" />
        <SourceReviewList title="Blocked by" items={item.blockedBy} tone={item.blockedBy.length > 0 ? "warning" : "success"} />
        <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Output candidate</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{item.outputCandidate}</p>
        </section>
      </div>
    </article>
  );
}

function SourceReviewList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">No current blockers.</p>
      )}
    </section>
  );
}
