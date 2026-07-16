import { Card, StatusPill } from "@living-textbook/ui";
import type {
  SchoolPolicyAcceptanceRecordField,
  SchoolPolicyAcceptanceRecordPreview,
  SchoolPolicyAcceptanceRecordPreviewStatus,
} from "@/data/sampleSchoolPolicyAcceptanceRecordPreview";

interface SchoolPolicyAcceptanceRecordPreviewPanelProps {
  preview: SchoolPolicyAcceptanceRecordPreview;
}

const statusLabel: Record<SchoolPolicyAcceptanceRecordPreviewStatus, string> = {
  blocked: "Blocked",
  "missing-policy": "Missing policy",
  "future-required": "Future required",
};

const statusTone: Record<SchoolPolicyAcceptanceRecordPreviewStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "missing-policy": "warning",
  "future-required": "neutral",
};

export function SchoolPolicyAcceptanceRecordPreviewPanel({
  preview,
}: SchoolPolicyAcceptanceRecordPreviewPanelProps) {
  const blockedFieldCount = preview.minimumAcceptedRecordFields.filter((field) => field.status !== "future-required").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Future school acceptance record preview</p>
          <h2 className="mt-1 text-lg font-bold">{preview.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preview.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={preview.statusLabel} tone="warning" />
          <StatusPill label="Not accepted" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AcceptanceRecordMetric label="Minimum fields" value={String(preview.minimumAcceptedRecordFields.length)} tone="neutral" />
        <AcceptanceRecordMetric label="Blocked or missing" value={String(blockedFieldCount)} tone="warning" />
        <AcceptanceRecordMetric label="Non-accepted markers" value={String(preview.nonAcceptedMarkers.length)} tone="warning" />
        <AcceptanceRecordMetric label="Blocked actions" value={String(preview.blockedActions.length)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{preview.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Minimum accepted-record fields are visible for school review only. This preview cannot store accepted
              terms, capture signatures, export evidence, activate storage, or launch a classroom.
            </p>
          </div>
          <StatusPill label="No accepted terms stored" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {preview.minimumAcceptedRecordFields.map((field) => (
          <AcceptanceRecordFieldCard key={field.fieldId} field={field} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <AcceptanceRecordList title="Non-accepted markers" items={preview.nonAcceptedMarkers} badge="Not accepted" />
        <AcceptanceRecordList title="Blocked actions" items={preview.blockedActions} badge="Blocked" />
        <AcceptanceRecordList title="Review rules" items={preview.reviewRules} badge="Rules" />
      </div>
    </Card>
  );
}

function AcceptanceRecordFieldCard({ field }: { field: SchoolPolicyAcceptanceRecordField }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{field.source}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{field.label}</h3>
        </div>
        <StatusPill label={statusLabel[field.status]} tone={statusTone[field.status]} />
      </div>
      <dl className="mt-3 grid gap-3 md:grid-cols-2">
        <AcceptanceRecordDefinition label="Required value" value={field.requiredValue} tone="neutral" />
        <AcceptanceRecordDefinition label="Blocked reason" value={field.blockedReason} tone="warning" />
      </dl>
    </article>
  );
}

function AcceptanceRecordMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function AcceptanceRecordDefinition({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</dd>
      <div className="mt-2">
        <StatusPill label={tone === "warning" ? "Still blocked" : "Preview"} tone={tone} />
      </div>
    </div>
  );
}

function AcceptanceRecordList({ title, items, badge }: { title: string; items: string[]; badge: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={badge} tone="warning" />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
