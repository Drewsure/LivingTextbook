import { Card, StatusPill } from "@living-textbook/ui";
import type { ControlledPilotApprovalReadiness } from "@living-textbook/content-model";

export function ControlledPilotApprovalReadinessPanel({
  readiness,
  errors,
}: {
  readiness: ControlledPilotApprovalReadiness;
  errors: string[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Controlled-pilot approval readiness</p>
          <h2 className="mt-1 text-lg font-bold">Human review eligibility is separate from approval</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This provider-neutral record joins composite evidence, release control, and reviewer prerequisites. It
            describes what must be true before a future authorized approval workflow can be designed; it is not an
            approval record and cannot change release state.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={readiness.status} tone={readiness.status === "ready-for-human-review" ? "success" : "warning"} />
          <StatusPill label="Approval capture blocked" tone="warning" />
          <StatusPill label="Release mutation blocked" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Fact label="Tenant" value={readiness.tenantId} />
        <Fact label="Package" value={readiness.packageId} />
        <Fact label="Release binding" value={readiness.releaseBindingId} />
        <Fact label="Pilot decision" value={readiness.pilotDecisionId} />
        <Fact label="Reviewer gate" value={readiness.reviewerGateId} />
        <Fact label="Storage review" value={readiness.storageSelectionStatus} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Storage policy boundary</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Storage review is required before human approval design</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">The approval-readiness record carries the same provider-neutral storage identities used by evidence, deployment, and pilot review. It does not choose or activate a provider.</p>
          </div>
          <StatusPill label="Storage selection blocked" tone="warning" />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Fact label="Storage preflight" value={readiness.storageSelectionPreflightId} />
          <Fact label="Storage gate" value={readiness.storageSelectionGateId} />
          <Fact label="Selection allowed" value={readiness.storageSelectionAllowed ? "Yes" : "No"} />
        </dl>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Blocking reasons" values={readiness.blockingReasons} />
        <List title="Required human records" values={readiness.requiredHumanRecords} />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next gate</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{readiness.nextGate}</p>
        {errors.length > 0 ? <List title="Contract findings" values={errors} /> : null}
      </div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function List({ title, values }: { title: string; values: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}
      </ul>
    </section>
  );
}
