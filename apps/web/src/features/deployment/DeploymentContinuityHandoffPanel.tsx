import type { DeploymentContinuityHandoff } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

export function DeploymentContinuityHandoffPanel({
  handoff,
  errors,
}: {
  handoff: DeploymentContinuityHandoff;
  errors: string[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Commercial deployment handoff</p>
          <h2 className="mt-1 text-lg font-bold">Three product paths, one review packet</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            A publisher or school can review the hosted, local, and packaged deliverables from one tenant-bound packet.
            The packet is evidence for a future decision, not an export, installer, activation, or route-mutation control.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={handoff.status} tone="warning" />
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="No export" tone="success" />
          <StatusPill label="No activation" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={handoff.tenantId} />
        <Fact label="Package" value={handoff.packageId} />
        <Fact label="Recommendation" value={handoff.recommendedOptionId} />
        <Fact label="Evidence bindings" value={String(handoff.evidenceBindings.length)} />
        <Fact label="Storage preflight" value={handoff.storageSelectionPreflightId} />
        <Fact label="Storage gate" value={handoff.storageSelectionGateId} />
        <Fact label="Release evidence" value={handoff.releaseReadinessStatus} />
        <Fact label="Release tenant" value={handoff.releaseReadinessTenantId} />
        <Fact label="Release package" value={handoff.releaseReadinessPackageId} />
      </dl>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {handoff.artifacts.map((artifact) => (
          <article key={artifact.artifactId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Review artifact</p>
                <h3 className="mt-1 text-base font-bold">{artifact.label}</h3>
              </div>
              <StatusPill label="Blocked" tone="warning" />
            </div>
            <List title="Deliverables" values={artifact.deliverables} />
            <List title="Bound evidence" values={artifact.evidenceBindings} />
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Handoff blockers" values={handoff.blockers.slice(0, 8)} tone="warning" />
        <List title="Blocked actions" values={["No export", "No installation", "No activation", "No QR or route mutation"]} tone="warning" />
      </div>

      {errors.length > 0 && <List title="Handoff errors" values={errors} tone="warning" />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-2 break-words text-sm font-bold">{value}</p></section>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`mt-4 rounded-lg border border-[var(--tenant-border)] p-3 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h4 className="text-sm font-bold">{title}</h4><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
