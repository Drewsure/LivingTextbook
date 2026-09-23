import type { PersistenceRecoveryRehearsal } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface PersistenceRecoveryRehearsalPanelProps {
  rehearsal: PersistenceRecoveryRehearsal;
  errors: string[];
}

const statusTone = { blocked: "warning", "needs-evidence": "warning", "rehearsal-ready": "success" } as const;

export function PersistenceRecoveryRehearsalPanel({ rehearsal, errors }: PersistenceRecoveryRehearsalPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Cross-deployment recovery rehearsal</p>
          <h2 className="mt-1 text-lg font-bold">One continuity contract for hosted, local, and hybrid deployments</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review packet compares the three white-label deployment paths against the same tenant, package, backup,
            restore, export, retention, and rollback expectations. It is rehearsal evidence, not a storage or recovery action.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={rehearsal.status} tone={statusTone[rehearsal.status]} />
          <StatusPill label="Provider unselected" tone="warning" />
          <StatusPill label="No side effect" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={rehearsal.tenantId} />
        <Fact label="Package" value={rehearsal.packageId} />
        <Fact label="Modes" value={String(rehearsal.modes.length)} />
        <Fact label="Sources" value={String(rehearsal.sourceRecords.length)} />
      </dl>

      <section className="mt-5 grid gap-4 xl:grid-cols-3">
        {rehearsal.modes.map((mode) => (
          <article key={mode.mode} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Deployment path</p>
                <h3 className="mt-1 text-base font-bold">{mode.mode}</h3>
              </div>
              <StatusPill label="Review only" tone="warning" />
            </div>
            <p className="mt-3 break-words text-xs font-semibold text-[var(--tenant-muted)]">Candidate: {mode.candidateId}</p>
            <div className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)]">
              <p>Provider selection committed: false</p>
              <p>Backup / restore / export rehearsal: required</p>
              <p>Tenant isolation: required</p>
              <p>Raw learner audio and transcripts: excluded</p>
            </div>
            <List title="Open checks" values={mode.openChecks.slice(0, 6)} />
          </article>
        ))}
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Source records" values={rehearsal.sourceRecords} />
        <List title="Required evidence" values={rehearsal.requiredEvidence} />
        <List title="Blocked actions" values={rehearsal.blockedActions} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <h3 className="text-sm font-bold">Rehearsal boundary</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          No provider selection, persistence write, backup, restore, export, package promotion, or route mutation can be
          inferred from this preview.
        </p>
        <List title="Reasons" values={rehearsal.reasons.slice(0, 8)} />
      </section>

      {errors.length > 0 && <List title="Rehearsal errors" values={errors} tone="warning" />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-2 break-words text-sm font-bold">{value}</p></section>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`mt-4 rounded-lg border border-[var(--tenant-border)] p-3 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h4 className="text-sm font-bold">{title}</h4><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
