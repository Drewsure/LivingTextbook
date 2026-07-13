import { Card, StatusPill } from "@living-textbook/ui";
import type {
  UploadReviewDecisionOption,
  UploadReviewQueue,
  UploadReviewQueueItem,
  UploadReviewQueueStatus,
} from "@/data/sampleUploadReviewQueue";
import { countUploadReviewItemsByStatus } from "@/data/sampleUploadReviewQueue";

interface UploadReviewQueuePanelProps {
  queue: UploadReviewQueue;
}

const statusTone: Record<UploadReviewQueueStatus, "neutral" | "warning" | "success"> = {
  "blocked-preview": "warning",
  "needs-review": "warning",
  "ready-preview": "success",
};

const decisionTone: Record<UploadReviewDecisionOption["status"], "neutral" | "warning"> = {
  "preview-only": "neutral",
  blocked: "warning",
};

export function UploadReviewQueuePanel({ queue }: UploadReviewQueuePanelProps) {
  const needsReviewCount = countUploadReviewItemsByStatus(queue, "needs-review");
  const blockedPreviewCount = countUploadReviewItemsByStatus(queue, "blocked-preview");
  const readyPreviewCount = countUploadReviewItemsByStatus(queue, "ready-preview");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Review queue preview</p>
          <h2 className="mt-1 text-lg font-bold">{queue.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{queue.summary}</p>
        </div>
        <StatusPill label="Live actions blocked" tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <UploadReviewMetric label="Needs review" value={String(needsReviewCount)} tone="warning" />
        <UploadReviewMetric label="Blocked preview" value={String(blockedPreviewCount)} tone="warning" />
        <UploadReviewMetric label="Ready preview" value={String(readyPreviewCount)} tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Hard rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Upload review cannot skip safety gates</h3>
          </div>
          <StatusPill label={String(queue.hardRules.length)} tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {queue.hardRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5 grid gap-4">
        {queue.items.map((item) => (
          <UploadReviewItemCard key={item.uploadId} item={item} />
        ))}
      </div>
    </Card>
  );
}

function UploadReviewMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : "Gate"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function UploadReviewItemCard({ item }: { item: UploadReviewQueueItem }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.fileKind}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{item.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {item.channelId} / {item.targetLabel}
          </p>
        </div>
        <StatusPill label={item.status} tone={statusTone[item.status]} />
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Source lineage</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{item.sourceLineage}</p>
      </section>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <UploadReviewList title="Required packets" items={item.requiredPackets} tone="neutral" />
        <UploadReviewList title="Blocked by" items={item.blockedBy} tone="warning" />
        <UploadReviewList title="Allowed preview actions" items={item.allowedPreviewActions} tone="neutral" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <UploadReviewList title="Not allowed yet" items={item.notAllowedYet} tone="warning" />
        <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[var(--tenant-text)]">Reviewer decision preview</h4>
            <StatusPill label="Disabled" tone="warning" />
          </div>
          <div className="mt-3 grid gap-2">
            {item.decisionOptions.map((option) => (
              <DecisionPreview key={option.optionId} option={option} />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next step</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{item.nextStep}</p>
      </section>
    </article>
  );
}

function DecisionPreview({ option }: { option: UploadReviewDecisionOption }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-[var(--tenant-text)]">{option.label}</p>
        <StatusPill label={option.status} tone={decisionTone[option.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{option.detail}</p>
    </article>
  );
}

function UploadReviewList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
