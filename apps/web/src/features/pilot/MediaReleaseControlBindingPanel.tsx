import type { LocalBundleMediaReleaseControlBinding } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface MediaReleaseControlBindingPanelProps {
  binding: LocalBundleMediaReleaseControlBinding;
  errors: string[];
}

const decisionTone = { blocked: "warning", "needs-review": "warning", "evidence-ready": "success" } as const;

export function MediaReleaseControlBindingPanel({ binding, errors }: MediaReleaseControlBindingPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media release-control binding</p>
          <h2 className="mt-1 text-lg font-bold">Media evidence feeds the publish decision</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This binding connects the media reconciliation result to the existing package publish gate. It reports
            evidence readiness only; it never publishes, activates, copies, or promotes a package.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={binding.decision} tone={decisionTone[binding.decision]} />
          <StatusPill label={`Reconciliation: ${binding.reconciliationStatus}`} tone={binding.reconciliationStatus === "aligned" ? "success" : "warning"} />
          <StatusPill label={binding.storageSelectionMatches ? "Storage aligned" : "Storage mismatch"} tone={binding.storageSelectionMatches ? "success" : "warning"} />
          <StatusPill label={binding.unitScopeMatches ? "Unit scope aligned" : "Unit scope mismatch"} tone={binding.unitScopeMatches ? "success" : "warning"} />
          <StatusPill label="No promotion" tone="warning" />
          <StatusPill label="No side effect" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Fact label="Release gate" value={binding.releaseGateId} />
        <Fact label="Tenant" value={binding.tenantId} />
        <Fact label="Package" value={binding.packageId} />
        <Fact label="Media gate" value={binding.releaseGateMediaStatus} />
        <Fact label="Unit scope" value={binding.unitScopeMatches ? "Aligned" : "Mismatch"} />
      </dl>
      <p className="mt-4 text-xs font-semibold text-[var(--tenant-muted)]">
        Storage identity: {binding.storageSelectionPreflightId} · {binding.storageSelectionGateId}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <List title="Release-blocking reasons" values={binding.releaseBlockingReasons} />
        <List title="Required approvals" values={binding.requiredApprovals} />
      </div>

      {errors.length > 0 ? (
        <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <h3 className="text-sm font-bold">Binding validation</h3>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <h3 className="text-sm font-bold">Execution boundary</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          Promotion allowed: no · Student-facing use: no · Local activation: no
        </p>
        <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">
          Blocked actions: {binding.blockedActions.join(", ")}
        </p>
      </div>
    </Card>
  );
}

function List({ title, values }: { title: string; values: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <h3 className="text-sm font-bold">{title}</h3>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {values.map((value, index) => <li key={`${value}-${index}`}>{value}</li>)}
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
