import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherReportPersistenceRuntimeResult } from "@living-textbook/content-model";

interface TeacherReportPersistenceRehearsalPanelProps {
  result: TeacherReportPersistenceRuntimeResult;
}

export function TeacherReportPersistenceRehearsalPanel({
  result,
}: TeacherReportPersistenceRehearsalPanelProps) {
  const { decision } = result;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher report persistence rehearsal</p>
          <h3 className="mt-1 text-lg font-bold">Three-layer contract alignment</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review-only rehearsal compares the report request, the tenant-bound persistence intent, and the durable
            report record. It is evidence for future provider work, not a storage or export control.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="No side effect" tone="success" />
          <StatusPill label="Live export blocked" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RehearsalMetric label="Decision" value={decision.allowed ? "Allowed" : "Blocked"} note={decision.reasonCode} />
        <RehearsalMetric label="Report readiness" value={decision.reportReadiness} note="Teacher report request" />
        <RehearsalMetric label="Persistence intent" value={decision.persistenceReadiness} note="Provider-neutral plan" />
        <RehearsalMetric label="Durable record" value={decision.durableRecordReadiness} note="Tenant-bound record" />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <RehearsalList title="Required before a provider adapter" items={[
          "Event acceptance summary preserved",
          "Settings context summary preserved",
          "Matching tenant-boundary keys",
          "School or tenant policy accepted",
          "Pseudonymous learner slots only",
        ]} tone="success" />
        <RehearsalList title="Blocked in foundation mode" items={decision.reasons} tone="warning" />
      </div>
    </Card>
  );
}

function RehearsalMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
      <dd className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{note}</dd>
    </div>
  );
}

function RehearsalList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
