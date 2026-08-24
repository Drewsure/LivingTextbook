import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PrototypeReturnPackageChecklist,
  PrototypeReturnPackageItemStatus,
  PrototypeReturnPackageStatus,
} from "@/data/samplePrototypeReturnPackageChecklist";

interface PrototypeReturnPackageChecklistPanelProps {
  checklists: PrototypeReturnPackageChecklist[];
}

const statusLabel: Record<PrototypeReturnPackageStatus, string> = {
  "not-returned": "Not returned",
  "evidence-needed": "Evidence needed",
  "ready-for-return-review": "Ready for return review",
};

const itemStatusTone: Record<PrototypeReturnPackageItemStatus, "success" | "warning" | "neutral"> = {
  required: "neutral",
  missing: "warning",
  blocked: "warning",
  "ready-preview": "success",
};

export function PrototypeReturnPackageChecklistPanel({ checklists }: PrototypeReturnPackageChecklistPanelProps) {
  const blockedCount = checklists.reduce((total, checklist) => total + checklist.blockedActions.length, 0);
  const packageItemCount = checklists.reduce((total, checklist) => total + checklist.packageItems.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Returned prototype package checklist</p>
          <h2 className="mt-1 text-lg font-bold">Evidence package before any game intake</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Outside game work must return as a review package first. This checklist names source archive manifests,
            reviewed fixtures, event logs, audio maps, mobile evidence, and wrapper notes while keeping imports and route
            changes blocked.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={`${checklists.length} checklist(s)`} tone="neutral" />
          <StatusPill label={`${packageItemCount} package item(s)`} tone="neutral" />
          <StatusPill label={`${blockedCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {checklists.map((checklist) => (
          <article
            key={checklist.checklistId}
            className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {checklist.tenantId} / {checklist.sourceRepo} / {checklist.queueItemId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{checklist.targetMode}</h3>
                <p className="mt-1 text-sm font-semibold text-[var(--tenant-muted)]">
                  {checklist.parentEngine} / {checklist.targetSurface}
                </p>
              </div>
              <StatusPill label={statusLabel[checklist.status]} tone="warning" />
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{checklist.summary}</p>

            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              {checklist.packageItems.map((item) => (
                <section
                  key={`${checklist.checklistId}-${item.itemId}`}
                  className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Return package item</p>
                      <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
                    </div>
                    <StatusPill label={item.status} tone={itemStatusTone[item.status]} />
                  </div>
                  <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                    {item.requiredContents.map((content, index) => (
                      <li key={`${checklist.checklistId}-${item.itemId}-content-${index}-${content}`}>{content}</li>
                    ))}
                  </ul>
                  <p className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3 text-sm font-semibold leading-6 text-[var(--tenant-text)]">
                    Blocks until: {item.blocksUntil}
                  </p>
                </section>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ChecklistList
                title="Required before Codex review"
                items={checklist.requiredBeforeCodexReview}
                ownerId={checklist.checklistId}
              />
              <ChecklistList
                title="Blocked actions"
                items={checklist.blockedActions}
                ownerId={checklist.checklistId}
                tone="warning"
              />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ChecklistList({
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
