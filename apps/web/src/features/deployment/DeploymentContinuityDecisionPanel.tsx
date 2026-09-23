import type { DeploymentContinuityDecision } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface DeploymentContinuityDecisionPanelProps {
  decision: DeploymentContinuityDecision;
  errors: string[];
}

export function DeploymentContinuityDecisionPanel({ decision, errors }: DeploymentContinuityDecisionPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Deployment continuity decision</p>
          <h2 className="mt-1 text-lg font-bold">Deployment choice and recovery evidence must agree</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet joins the commercial deployment options to the persistence recovery rehearsal. It lets a publisher
            compare the product paths without turning a recommendation into an activation, installer, storage, or classroom launch.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={decision.status} tone="warning" />
          <StatusPill label="No option selected" tone="warning" />
          <StatusPill label="No side effect" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={decision.tenantId} />
        <Fact label="Package" value={decision.packageId} />
        <Fact label="Recommendation" value={decision.recommendedOptionId} />
        <Fact label="Evidence bindings" value={String(decision.evidenceBindings.length)} />
      </dl>

      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        {decision.paths.map((path) => (
          <article key={path.optionId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Product path</p>
                <h3 className="mt-1 text-base font-bold">{path.label}</h3>
              </div>
              <StatusPill label="Blocked" tone="warning" />
            </div>
            <p className="mt-3 text-sm text-[var(--tenant-muted)]">
              Recovery modes: {path.recoveryModes.join(", ")}
            </p>
            <p className="mt-2 text-sm font-semibold">Continuity evidence ready: false</p>
            <List title="Path blockers" values={path.blockers.slice(0, 5)} />
          </article>
        ))}
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <List title="Evidence bindings" values={decision.evidenceBindings} />
        <List title="Global blockers" values={decision.blockers.slice(0, 8)} tone="warning" />
        <List title="Blocked actions" values={["No provider selection", "No persistence activation", "No classroom launch", "No offline-ready claim", "No installer or route mutation"]} tone="warning" />
      </div>

      {errors.length > 0 && <List title="Decision errors" values={errors} tone="warning" />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-2 break-words text-sm font-bold">{value}</p></section>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`mt-4 rounded-lg border border-[var(--tenant-border)] p-3 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h4 className="text-sm font-bold">{title}</h4><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
