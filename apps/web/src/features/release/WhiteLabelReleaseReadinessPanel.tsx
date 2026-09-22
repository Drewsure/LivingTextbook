import { Card, StatusPill } from "@living-textbook/ui";
import type { WhiteLabelReleaseReadiness } from "@living-textbook/content-model";

export function WhiteLabelReleaseReadinessPanel({
  readiness,
  errors,
}: {
  readiness: WhiteLabelReleaseReadiness;
  errors: string[];
}) {
  const qualityChecks = Object.entries(readiness.qualityChecks);
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">White-label release control</p>
            <h2 className="mt-1 text-2xl font-bold">One readiness view for every publisher tenant</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
              This dashboard reconciles the governed build phases and verification signals without creating a release action.
              A tenant can be demo-ready while production approval and student launch remain blocked.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label={readiness.status} tone="warning" />
            <StatusPill label="Production approval blocked" tone="warning" />
            <StatusPill label="Student launch blocked" tone="warning" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Tenant" value={readiness.tenantId} />
          <Fact label="Package" value={readiness.packageId} />
          <Fact label="Phases" value={String(readiness.phases.length)} />
          <Fact label="Next owner action" value={readiness.nextAction} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Required quality signals</p>
            <h2 className="mt-1 text-lg font-bold">Evidence checks are separate from approval</h2>
          </div>
          <StatusPill label={`${qualityChecks.filter(([, value]) => value).length}/${qualityChecks.length} verified`} tone="success" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {qualityChecks.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
              <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value ? "Verified" : "Missing"}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Governed build phases</p>
          <h2 className="mt-1 text-lg font-bold">Phase blockers remain visible to the adult operator</h2>
        </div>
        <div className="mt-5 grid gap-3">
          {readiness.phases.map((phase) => (
            <article key={phase.phaseId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{phase.phaseId}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{phase.label}</h3>
                </div>
                <StatusPill label={phase.status} tone={phase.status === "ready" ? "success" : "warning"} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">Next action: {phase.nextAction}</p>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <List title="Evidence" values={phase.evidenceRecords} />
                <List title="Blockers" values={phase.blockers.length > 0 ? phase.blockers : ["No phase blocker recorded."]} />
              </div>
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Release boundary</p>
            <h2 className="mt-1 text-lg font-bold">No release button exists in this foundation surface</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">{readiness.note}</p>
          </div>
          <StatusPill label="Review-only" tone="warning" />
        </div>
        <List title="Blocked actions" values={readiness.blockedActions} />
        {errors.length > 0 && <List title="Readiness contract errors" values={errors} />}
      </Card>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p></div>;
}

function List({ title, values }: { title: string; values: string[] }) {
  return <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
