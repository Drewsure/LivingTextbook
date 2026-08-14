import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiPrototypePatchChangeSetPreviewCollectionWarnings,
  validateAiPrototypePatchChangeSetPreviews,
} from "@living-textbook/content-model/src/aiPrototypePatchChangeSetPreview";

import type {
  AiPrototypePatchChangeSetPreview,
  AiPrototypePatchChangeSetPreviewStatus,
} from "@/data/sampleAiPrototypePatchChangeSetPreview";

interface AiPrototypePatchChangeSetPreviewPanelProps {
  previews: AiPrototypePatchChangeSetPreview[];
}

const statusTone: Record<AiPrototypePatchChangeSetPreviewStatus, "neutral" | "warning" | "success"> = {
  blocked: "warning",
  "review-only": "neutral",
  "ready-for-change-set-review": "success",
};

const statusLabel: Record<AiPrototypePatchChangeSetPreviewStatus, string> = {
  blocked: "Change set blocked",
  "review-only": "Review only",
  "ready-for-change-set-review": "Ready for change-set review",
};

export function AiPrototypePatchChangeSetPreviewPanel({ previews }: AiPrototypePatchChangeSetPreviewPanelProps) {
  const guardBlocks = validateAiPrototypePatchChangeSetPreviews(previews);
  const guardWarnings = getAiPrototypePatchChangeSetPreviewCollectionWarnings(previews);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI prototype patch change set preview</p>
          <h2 className="mt-1 text-lg font-bold">File-level change set before patch</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview names the future files, invariants, blockers, and next records before any generated or returned
            prototype can become an app patch.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Patch change set preview guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="No app patch write" tone="warning" />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListPanel
          title="Patch change set preview guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared patch change set preview guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ListPanel
          title="Patch change set preview guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared patch change set preview guard warnings."]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="space-y-3">
        {previews.map((preview) => (
          <article key={preview.changeSetId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{preview.workOrderId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{preview.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preview.summary}</p>
              </div>
              <StatusPill label={statusLabel[preview.status]} tone={statusTone[preview.status]} />
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-[1.5fr_1fr]">
              <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Planned file changes</p>
                  <StatusPill label={String(preview.plannedFileChanges.length)} tone="neutral" />
                </div>
                <div className="mt-3 grid gap-2">
                  {preview.plannedFileChanges.map((change) => (
                    <div key={`${preview.changeSetId}-${change.filePath}`} className="rounded-md bg-white p-3">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <p className="text-sm font-semibold text-[var(--tenant-text)]">{change.filePath}</p>
                        <StatusPill label={change.action} tone="neutral" />
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                        {change.fileGroup}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{change.purpose}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{change.guardrail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-3">
                <ListPanel title="Invariant checks" items={preview.invariantChecks} />
                <ListPanel title="Review blockers" items={preview.reviewBlockers} tone="warning" />
                <ListPanel title="Blocked actions" items={preview.blockedActions} tone="warning" />
                <ListPanel title="Next required records" items={preview.nextRequiredRecords} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ListPanel({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
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
