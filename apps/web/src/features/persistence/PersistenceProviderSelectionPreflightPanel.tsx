import { Card, StatusPill } from "@living-textbook/ui";
import type { PersistenceProviderSelectionPreflight } from "@living-textbook/content-model";

interface PersistenceProviderSelectionPreflightPanelProps {
  preflight: PersistenceProviderSelectionPreflight;
  errors: string[];
}

export function PersistenceProviderSelectionPreflightPanel({ preflight, errors }: PersistenceProviderSelectionPreflightPanelProps) {
  const valid = errors.length === 0;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Provider selection preflight</p>
          <h2 className="mt-1 text-lg font-bold">Compare the deployment paths before selecting one</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This joins the backend matrix, evidence-storage gate, and implementation handoff. It is a cost and capability comparison only.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={valid ? "Preflight shape valid" : "Preflight review"} tone={valid ? "success" : "warning"} />
          <StatusPill label={preflight.status} tone="warning" />
          <StatusPill label="No provider selected" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={preflight.tenantId} />
        <Fact label="Package" value={preflight.packageId} />
        <Fact label="Candidates" value={String(preflight.candidates.length)} />
        <Fact label="Recommended" value={preflight.recommendedCandidateId} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Scope bindings</p>
        <div className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-3">
          <p><strong>Backend matrix:</strong> {preflight.backendMatrixId}</p>
          <p><strong>Evidence gate:</strong> {preflight.evidenceStorageGateId}</p>
          <p><strong>Implementation handoff:</strong> {preflight.implementationReadinessId}</p>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Selection evidence</p>
            <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">Cross-source provider recommendation reconciliation</p>
          </div>
          <StatusPill label={`${preflight.selectionEvidence.openCriterionCount} open criteria`} tone="warning" />
        </div>
        <div className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-3">
          <p><strong>Selection gate:</strong> {preflight.selectionEvidence.selectionGateId}</p>
          <p><strong>Fit:</strong> {preflight.selectionEvidence.deploymentFit} / {preflight.selectionEvidence.costPosture}</p>
          <p><strong>Source records:</strong> {preflight.selectionEvidence.sourceRecords.length}</p>
        </div>
        <List title="Selection evidence sources" values={preflight.selectionEvidence.sourceRecords} />
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {preflight.candidates.map((candidate) => (
          <article key={candidate.candidateId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{candidate.deploymentFit} / {candidate.costPosture}</p>
                <h3 className="mt-1 text-base font-bold">{candidate.label}</h3>
              </div>
              {candidate.candidateId === preflight.recommendedCandidateId && <StatusPill label="Current recommendation" tone="success" />}
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{candidate.whiteLabelFit}</p>
            <List title="Required evidence" values={candidate.requiredEvidence} />
            <List title="Unresolved risks" values={candidate.unresolvedRisks} tone="warning" />
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Required before selection" values={preflight.requiredEvidence} />
        <List title="Blocked actions" values={preflight.blockedActions} tone="warning" />
        <List title="Next steps" values={preflight.nextSteps} />
      </div>

      {errors.length > 0 && <List title="Preflight errors" values={errors} tone="warning" />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-2 break-words text-sm font-bold">{value}</p></section>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`mt-4 rounded-lg border border-[var(--tenant-border)] p-3 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h4 className="text-sm font-bold">{title}</h4><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
