import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiDraftCorrectionItemSeverity,
  AiDraftCorrectionQueue,
  AiDraftCorrectionQueueStatus,
} from "@/data/sampleAiDraftCorrectionQueue";

interface AiDraftCorrectionQueuePanelProps {
  queues: AiDraftCorrectionQueue[];
}

const queueTone: Record<AiDraftCorrectionQueueStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "needs-review": "warning",
  "ready-for-review": "success",
};

const severityTone: Record<AiDraftCorrectionItemSeverity, "neutral" | "warning"> = {
  "validation block": "warning",
  "review warning": "neutral",
};

export function AiDraftCorrectionQueuePanel({ queues }: AiDraftCorrectionQueuePanelProps) {
  const blockCount = queues.reduce((total, queue) => total + queue.validationBlockCount, 0);
  const warningCount = queues.reduce((total, queue) => total + queue.warningCount, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI draft correction queue</p>
          <h2 className="mt-1 text-lg font-bold">Repair before review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Schema guard output is converted into teacher/admin repair work. The queue explains the owner, lane, and
            next record without offering auto-fix, live regeneration, package assembly, routes, playlists, or assignment.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${blockCount} validation block(s)`} tone={blockCount > 0 ? "warning" : "success"} />
          <StatusPill label={`${warningCount} review warning(s)`} tone={warningCount > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {queues.map((queue) => (
          <article key={queue.queueId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{queue.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{queue.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{queue.summary}</p>
              </div>
              <StatusPill label={queue.status} tone={queueTone[queue.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
              <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-[var(--tenant-text)]">Schema/audio/progress repair lanes</h4>
                  <StatusPill label={String(queue.items.length)} tone="warning" />
                </div>
                <div className="mt-3 grid gap-3">
                  {queue.items.map((item) => (
                    <article key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.lane}</p>
                          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.issue}</h5>
                        </div>
                        <StatusPill label={item.severity} tone={severityTone[item.severity]} />
                      </div>
                      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-3">
                        <CorrectionFact label="Required owner" value={item.requiredOwner} />
                        <CorrectionFact label="Next record" value={item.nextRecord} />
                        <CorrectionFact label="Student-use effect" value={item.studentUseEffect} />
                      </dl>
                    </article>
                  ))}
                </div>
              </section>

              <div className="grid gap-3">
                <CorrectionList title="Blocked correction actions" items={queue.blockedActions} tone="warning" />
                <CorrectionList title="Next requirements" items={queue.nextRequirements} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function CorrectionFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function CorrectionList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
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
