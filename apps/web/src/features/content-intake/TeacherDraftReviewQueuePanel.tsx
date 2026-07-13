import { Card, StatusPill } from "@living-textbook/ui";
import type {
  TeacherDraftReviewQueue,
  TeacherDraftReviewQueueItem,
  TeacherDraftReviewQueueStatus,
  TeacherDraftReviewerDecisionOption,
  TeacherDraftReviewerDecisionStatus,
} from "@/data/sampleTeacherDraftReviewQueue";

interface TeacherDraftReviewQueuePanelProps {
  queue: TeacherDraftReviewQueue;
}

const statusTone: Record<TeacherDraftReviewQueueStatus, "neutral" | "success" | "warning"> = {
  "handoff-preview": "neutral",
  blocked: "warning",
  "ready-for-verifier": "success",
  returned: "warning",
};

const decisionStatusTone: Record<TeacherDraftReviewerDecisionStatus, "neutral" | "success" | "warning"> = {
  "preview-only": "neutral",
  blocked: "warning",
  future: "neutral",
};

export function TeacherDraftReviewQueuePanel({ queue }: TeacherDraftReviewQueuePanelProps) {
  const blockerCount = queue.items.reduce((total, item) => total + item.blockedBy.length, 0);

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher draft review queue</p>
            <h2 className="mt-1 text-2xl font-bold">Review workbench preview</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{queue.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label={`${queue.items.length} queue item`} tone="neutral" />
            <StatusPill label={`${blockerCount} blockers`} tone={blockerCount > 0 ? "warning" : "success"} />
          </div>
        </div>

        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Hard rules</p>
              <h3 className="mt-1 text-base font-bold">No live approval</h3>
            </div>
            <StatusPill label="Student assignment blocked" tone="warning" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {queue.hardRules.map((rule) => (
              <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {rule}
              </li>
            ))}
          </ul>
        </section>
      </Card>

      {queue.items.map((item) => (
        <ReviewQueueItemCard key={item.queueItemId} item={item} />
      ))}
    </div>
  );
}

function ReviewQueueItemCard({ item }: { item: TeacherDraftReviewQueueItem }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Review handoff packet</p>
          <h3 className="mt-1 text-lg font-bold">{item.draft.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Reviewer lane: {item.reviewerLane}. Draft source: {item.draft.sourcePackageId}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={item.status} tone={statusTone[item.status]} />
          <StatusPill label="Verifier submission blocked" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <ReviewQueueList title="Packet sections" items={item.packetSections} tone="neutral" />
        <ReviewQueueList title="Blocked by" items={item.blockedBy} tone="warning" />
        <ReviewQueueList title="Allowed actions" items={item.allowedActions} tone="success" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ReviewQueueList title="Not allowed yet" items={item.notAllowedYet} tone="warning" />
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[var(--tenant-text)]">Next foundation step</h4>
            <StatusPill label="No direct AI publish" tone="warning" />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{item.nextStep}</p>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Reviewer decision preview</p>
            <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">Decision actions disabled</h4>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These are future reviewer outcomes only. They cannot submit, approve, publish, or assign until reviewer identity,
              evidence storage, verifier workflow, and release-control policy exist.
            </p>
          </div>
          <StatusPill label="Approval still blocked" tone="warning" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {item.reviewerDecisionOptions.map((decision) => (
            <ReviewerDecisionCard key={decision.decisionId} decision={decision} />
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Review evidence packet preview</p>
            <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">Evidence upload blocked</h4>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Reviewer decisions will need evidence, but this route does not upload files, capture signatures, or store proof.
            </p>
          </div>
          <StatusPill label="Evidence storage required" tone="warning" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <ReviewQueueList title="Evidence packet requirements" items={item.evidencePacketPreview} tone="neutral" />
          <ReviewQueueList title="Evidence upload blocked by" items={item.evidenceUploadBlockedBy} tone="warning" />
        </div>
      </section>
    </Card>
  );
}

function ReviewerDecisionCard({ decision }: { decision: TeacherDraftReviewerDecisionOption }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h5 className="text-sm font-bold text-[var(--tenant-text)]">{decision.label}</h5>
        <StatusPill label={decision.status} tone={decisionStatusTone[decision.status]} />
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{decision.outcome}</p>

      <div className="mt-3 grid gap-3">
        <ReviewQueueList title="Evidence required" items={decision.evidenceRequired} tone="neutral" />
        <ReviewQueueList title="Decision blocked by" items={decision.blockedBy} tone={decision.blockedBy.length > 0 ? "warning" : "success"} />
      </div>
    </article>
  );
}

function ReviewQueueList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((itemText) => (
          <li key={itemText}>{itemText}</li>
        ))}
      </ul>
    </section>
  );
}
