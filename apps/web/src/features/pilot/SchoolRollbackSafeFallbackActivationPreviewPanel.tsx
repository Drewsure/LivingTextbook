import { Card, StatusPill } from "@living-textbook/ui";
import type {
  SafeFallbackActivationField,
  SafeFallbackActivationPreviewStatus,
  SchoolRollbackSafeFallbackActivationPreview,
} from "@/data/sampleSchoolRollbackSafeFallbackActivationPreview";

interface SchoolRollbackSafeFallbackActivationPreviewPanelProps {
  preview: SchoolRollbackSafeFallbackActivationPreview;
}

const statusLabel: Record<SafeFallbackActivationPreviewStatus, string> = {
  blocked: "Blocked",
  "missing-policy": "Missing policy",
  "future-required": "Future required",
};

const statusTone: Record<SafeFallbackActivationPreviewStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "missing-policy": "warning",
  "future-required": "neutral",
};

export function SchoolRollbackSafeFallbackActivationPreviewPanel({
  preview,
}: SchoolRollbackSafeFallbackActivationPreviewPanelProps) {
  const blockedFieldCount = preview.minimumActivationRecordFields.filter((field) => field.status !== "future-required").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Future safe fallback activation record preview</p>
          <h2 className="mt-1 text-lg font-bold">{preview.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preview.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={preview.statusLabel} tone="warning" />
          <StatusPill label="Not activated" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ActivationPreviewMetric label="Minimum fields" value={String(preview.minimumActivationRecordFields.length)} tone="neutral" />
        <ActivationPreviewMetric label="Blocked or missing" value={String(blockedFieldCount)} tone="warning" />
        <ActivationPreviewMetric label="Not-activated markers" value={String(preview.nonActivatedMarkers.length)} tone="warning" />
        <ActivationPreviewMetric label="Blocked actions" value={String(preview.blockedActions.length)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
              Source preflight: {preview.sourcePreflightId}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Activation fields are visible for school review only. This preview cannot activate fallback behavior,
              mutate QR routes, send notifications, change media, export reports, or reassign students.
            </p>
          </div>
          <StatusPill label="No fallback activated" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {preview.minimumActivationRecordFields.map((field) => (
          <ActivationFieldCard key={field.fieldId} field={field} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <ActivationPreviewList title="Not-activated markers" items={preview.nonActivatedMarkers} badge="Not activated" />
        <ActivationPreviewList title="Blocked actions" items={preview.blockedActions} badge="Blocked" />
        <ActivationPreviewList title="Review rules" items={preview.reviewRules} badge="Rules" />
      </div>
    </Card>
  );
}

function ActivationFieldCard({ field }: { field: SafeFallbackActivationField }) {
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
        <ActivationDefinition label="Required value" value={field.requiredValue} tone="neutral" />
        <ActivationDefinition label="Blocked reason" value={field.blockedReason} tone="warning" />
      </dl>
    </article>
  );
}

function ActivationPreviewMetric({
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

function ActivationDefinition({
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

function ActivationPreviewList({ title, items, badge }: { title: string; items: string[]; badge: string }) {
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
