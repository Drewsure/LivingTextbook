import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherDraftPersistenceImplementationReadiness } from "@living-textbook/content-model";

interface TeacherDraftPersistenceImplementationReadinessPanelProps {
  readiness: TeacherDraftPersistenceImplementationReadiness;
  errors: string[];
}

export function TeacherDraftPersistenceImplementationReadinessPanel({ readiness, errors }: TeacherDraftPersistenceImplementationReadinessPanelProps) {
  const valid = errors.length === 0;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Future adapter work order</p>
          <h2 className="mt-1 text-lg font-bold">Teacher draft persistence acceptance packet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This defines the implementation order and acceptance evidence for a future provider adapter. It does not select a provider, execute tests, write data, upload media, or change routes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={valid ? "Packet shape valid" : "Packet review"} tone={valid ? "success" : "warning"} />
          <StatusPill label={readiness.status} tone="warning" />
          <StatusPill label="Provider-neutral" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Fact label="Tenant" value={readiness.tenantId} />
        <Fact label="Draft" value={readiness.draftId} />
        <Fact label="Acceptance" value={readiness.acceptanceReadinessId} />
        <Fact label="Candidate plan" value={readiness.adapterPlanId} />
        <Fact label="Tests" value={`${readiness.acceptanceTests.length} defined / not run`} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Implementation boundary</p>
        <div className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-2 lg:grid-cols-4">
          <p><strong>Provider selection:</strong> blocked</p>
          <p><strong>Writes and uploads:</strong> blocked</p>
          <p><strong>Live test execution:</strong> blocked</p>
          <p><strong>Assignment and promotion:</strong> blocked</p>
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Required work-order records" values={readiness.requiredWorkOrderRecords} />
        <List title="Required evidence" values={readiness.requiredEvidence} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <h3 className="text-sm font-bold">Acceptance tests, review-only</h3>
        <div className="mt-3 grid gap-3">
          {readiness.acceptanceTests.map((test) => (
            <article key={test.testId} className="rounded-md border border-[var(--tenant-border)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{test.testId}</p>
                  <h4 className="mt-1 text-sm font-bold">{test.label}</h4>
                </div>
                <StatusPill label={test.status} tone="warning" />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{test.purpose}</p>
              <List title="Pass criteria" values={test.passCriteria} />
              <p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]"><strong>Evidence:</strong> {test.evidenceRequired}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Blocked actions" values={readiness.blockedActions} tone="warning" />
        <List title="Current blockers" values={readiness.blockers} tone="warning" />
        <List title="Next steps" values={readiness.nextSteps} />
      </div>

      {errors.length > 0 && <List title="Readiness errors" values={errors} tone="warning" />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-2 break-words text-sm font-bold">{value}</p></section>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`mt-4 rounded-lg border border-[var(--tenant-border)] p-3 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h4 className="text-sm font-bold">{title}</h4><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
