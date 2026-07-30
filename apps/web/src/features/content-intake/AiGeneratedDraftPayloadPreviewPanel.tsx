import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratedDraftPayloadPreview,
  AiGeneratedDraftPayloadStatus,
} from "@/data/sampleAiGeneratedDraftPayloadPreview";

interface AiGeneratedDraftPayloadPreviewPanelProps {
  previews: AiGeneratedDraftPayloadPreview[];
}

const statusTone: Record<AiGeneratedDraftPayloadStatus, "neutral" | "warning"> = {
  "draft-only": "neutral",
  blocked: "warning",
};

export function AiGeneratedDraftPayloadPreviewPanel({ previews }: AiGeneratedDraftPayloadPreviewPanelProps) {
  const blockingCheckCount = previews.reduce(
    (total, preview) => total + preview.preflight.filter((check) => check.blocksStudentUse).length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI draft payload preview</p>
          <h2 className="mt-1 text-lg font-bold">Draft JSON preview</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview shows the generator output shape before persistence, verifier submission, teacher approval, media
            rights, target-language audio approval, playlist creation, route creation, or student assignment exists.
          </p>
        </div>
        <StatusPill label={`${blockingCheckCount} student-use block(s)`} tone="warning" />
      </div>

      <div className="mt-5 grid gap-4">
        {previews.map((preview) => (
          <article key={preview.previewId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{preview.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{preview.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preview.summary}</p>
              </div>
              <StatusPill label={preview.status} tone={statusTone[preview.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <DraftList title="Preflight checks" items={preview.preflight.map((check) => `${check.label}: ${check.result}`)} />
              <DraftList title="Blocked draft actions" items={preview.blockedActions} tone="warning" />
              <DraftList title="Next required records" items={preview.nextRecords} />
            </div>

            <pre className="mt-4 max-h-[34rem] overflow-auto rounded-lg border border-[var(--tenant-border)] bg-slate-950 p-4 text-xs leading-5 text-white">
              {JSON.stringify(preview.draftJson, null, 2)}
            </pre>
          </article>
        ))}
      </div>
    </Card>
  );
}

function DraftList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
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
