import Link from "next/link";
import { Card, StatusPill } from "@living-textbook/ui";
import type { SourceDraftImportPreview, SourceDraftImportPreviewStatus } from "@living-textbook/content-model";

interface SourceDraftImportPreviewPanelProps {
  previews: SourceDraftImportPreview[];
  errors?: string[];
}

const statusTone: Record<SourceDraftImportPreviewStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "ready-preview": "neutral",
};

export function SourceDraftImportPreviewPanel({ previews, errors = [] }: SourceDraftImportPreviewPanelProps) {
  const findingCount = errors.length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source-to-draft handoff</p>
          <h2 className="mt-1 text-lg font-bold">Teacher draft import preview</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This evidence-only bridge reconciles the source assembly, extraction preview, and teacher draft identity before any draft write exists. It cannot save, assign, publish, or promote content.
          </p>
        </div>
        <StatusPill label={findingCount === 0 ? "Binding valid" : `${findingCount} finding(s)`} tone={findingCount === 0 ? "neutral" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Previews" value={String(previews.length)} />
        <Metric label="Blocked" value={String(previews.filter((preview) => preview.status === "blocked").length)} tone="warning" />
        <Metric label="Storage write" value="Blocked" tone="warning" />
        <Metric label="Assignment" value="Blocked" tone="warning" />
      </div>

      {errors.length > 0 ? (
        <ul className="mt-5 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`source-draft-import-error-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">{error}</li>)}
        </ul>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {previews.map((preview) => (
          <article key={preview.importPreviewId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{preview.tenantId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{preview.candidateUnitKey}</h3>
                <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{preview.assemblyPacketId} -&gt; {preview.draftId}</p>
              </div>
              <StatusPill label={preview.status} tone={statusTone[preview.status]} />
            </div>

            <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
              <Fact label="Source" value={preview.sourceId} />
              <Fact label="Extraction preview" value={preview.extractionPreviewId} />
              <Fact label="Checksum" value={preview.sourceChecksum} />
              <Fact label="Target package" value={preview.targetPackageId} />
            </dl>

            <div className="mt-4 grid gap-2">
              <Flag label="Draft creation" value="Blocked" />
              <Flag label="Storage write" value="Blocked" />
              <Flag label="Student payload" value="Blocked" />
              <Flag label="Assignment" value="Blocked" />
            </div>

            <Link
              href={`/teacher/authoring/${encodeURIComponent(preview.draftId)}`}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-4 py-2 text-sm font-bold text-[var(--tenant-text)] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--tenant-accent)]"
            >
              Open teacher-only draft preview
            </Link>

            <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Required next records</p>
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
                {preview.requiredRecords.map((record) => <li key={record}>{record}</li>)}
              </ul>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Open blockers</p>
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
                {preview.blockers.map((blocker, index) => <li key={`${preview.importPreviewId}-blocker-${index}`}>{blocker}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "warning" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className={`mt-2 text-sm font-bold ${tone === "warning" ? "text-[var(--tenant-text)]" : "text-[var(--tenant-text)]"}`}>{value}</p></section>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-2"><dt className="font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words font-semibold text-[var(--tenant-text)]">{value}</dd></div>;
}

function Flag({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--tenant-border)] px-3 py-2 text-sm"><span className="text-[var(--tenant-muted)]">{label}</span><span className="font-semibold text-[var(--tenant-text)]">{value}</span></div>;
}
