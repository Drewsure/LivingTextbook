import type { LocalBundleExportRetentionDryRun } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundleExportRetentionDryRunPanelProps {
  dryRun: LocalBundleExportRetentionDryRun;
  errors: string[];
}

export function LocalBundleExportRetentionDryRunPanel({ dryRun, errors }: LocalBundleExportRetentionDryRunPanelProps) {
  const included = dryRun.items.filter((item) => item.disposition === "include");
  const excluded = dryRun.items.filter((item) => item.disposition === "exclude");
  const policyRequired = dryRun.items.filter((item) => item.disposition === "requires-policy");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Export and retention dry-run</p>
          <h2 className="mt-1 text-lg font-bold">Preview package boundaries before any copy or deletion</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This classification shows what a future package could describe, what requires school or tenant policy,
            and what is never eligible for the core export. It performs no file copy, export, retention deletion, or route mutation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="Export blocked" tone="warning" />
          <StatusPill label="Deletion blocked" tone="warning" />
          <StatusPill label="No side effect" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={dryRun.tenantId} />
        <Fact label="Package" value={dryRun.packageId} />
        <Fact label="Format" value={dryRun.format} />
        <Fact label="Retention" value={dryRun.retention.retentionDays ? `${dryRun.retention.retentionDays} days` : "Policy required"} />
      </dl>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Classification title="Included in future manifest" values={included.map((item) => item.label)} tone="success" />
        <Classification title="Requires policy" values={policyRequired.map((item) => item.label)} tone="warning" />
        <Classification title="Excluded from core export" values={excluded.map((item) => item.label)} tone="warning" />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <h3 className="text-sm font-bold">Retention boundary</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          Scope: {dryRun.retention.deletionScope}. A positive retention period and accepted policy are still required;
          deletion remains blocked in this dry-run.
        </p>
      </div>

      {errors.length > 0 && (
        <ul className="mt-5 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`export-retention-error-${index}-${error}`}>{error}</li>)}
        </ul>
      )}
    </Card>
  );
}

function Classification({ title, values, tone }: { title: string; values: string[]; tone: "success" | "warning" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold">{title}</h3>
        <StatusPill label={`${values.length}`} tone={tone} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {values.map((value) => <li key={value}>{value}</li>)}
      </ul>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
