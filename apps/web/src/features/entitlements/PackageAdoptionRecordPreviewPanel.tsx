import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PackageAdoptionRecordPreview,
  PackageAdoptionRecordStatus,
} from "@/data/samplePackageAdoptionRecordPreview";

interface PackageAdoptionRecordPreviewPanelProps {
  records: PackageAdoptionRecordPreview[];
}

const statusLabels: Record<PackageAdoptionRecordStatus, string> = {
  "not-recorded": "Not recorded",
  blocked: "Blocked",
};

export function PackageAdoptionRecordPreviewPanel({ records }: PackageAdoptionRecordPreviewPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Future package adoption record preview</p>
          <h2 className="mt-1 text-lg font-bold">Minimum accepted-record fields before premium enablement</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            These previews show the record shape needed before package adoption can become durable. They are not accepted
            records, do not store terms, and cannot enable billing, model calls, speech scoring, report export, hosted
            storage, or local companion activation.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={`${records.length} record preview(s)`} tone="warning" />
          <StatusPill label="No accepted records" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {records.map((record) => (
          <article key={record.previewId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {record.tenantId} / {record.packageId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.label}</h3>
              </div>
              <StatusPill label={statusLabels[record.status]} tone="warning" />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{record.summary}</p>

            <div className="mt-4 grid gap-3 lg:grid-cols-5">
              <RecordList title="Minimum fields" items={record.minimumFields} ownerId={record.previewId} />
              <RecordList title="Required evidence" items={record.requiredEvidence} ownerId={record.previewId} />
              <RecordList title="Acceptance scopes" items={record.acceptanceScopes} ownerId={record.previewId} />
              <RecordList title="Blocked writes" items={record.blockedWrites} ownerId={record.previewId} tone="warning" />
              <RecordList title="Rollback hooks" items={record.rollbackHooks} ownerId={record.previewId} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function RecordList({
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
