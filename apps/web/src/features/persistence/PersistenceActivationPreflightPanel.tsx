import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PersistenceActivationCheck,
  PersistenceActivationCheckStatus,
  PersistenceActivationPreflight,
} from "@/data/samplePersistenceActivationPreflight";

const statusTone: Record<PersistenceActivationCheckStatus, "neutral" | "success" | "warning"> = {
  passed: "success",
  open: "neutral",
  blocked: "warning",
};

export function PersistenceActivationPreflightPanel({
  preflight,
}: {
  preflight: PersistenceActivationPreflight;
}) {
  const blockedCount = preflight.checks.filter((check) => check.status === "blocked").length;
  const openCount = preflight.checks.filter((check) => check.status === "open").length;
  const passedCount = preflight.checks.filter((check) => check.status === "passed").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot activation gate</p>
          <h2 className="mt-1 text-lg font-bold">Durable-write activation preflight</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preflight.summary}</p>
        </div>
        <StatusPill label={preflight.status === "ready" ? "Ready for review" : "Activation blocked"} tone={preflight.status === "ready" ? "success" : "warning"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={preflight.tenantId} />
        <Fact label="Package" value={preflight.packageId} />
        <Fact label="Requested mode" value={preflight.requestedMode} />
        <Fact label="Evidence" value={`${passedCount} passed / ${openCount} open / ${blockedCount} blocked`} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {preflight.checks.map((check) => (
          <ActivationCheckCard key={check.checkId} check={check} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4" aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold">Decision boundary</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
              This preflight cannot activate a provider, write learner data, approve a school, or create a live assignment.
            </p>
          </div>
          <StatusPill label="No activation control" tone="success" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-[var(--tenant-text)]">
          {preflight.blockedReasons.map((reason, index) => (
            <li key={`${preflight.packetId}-blocked-${index}`} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function ActivationCheckCard({ check }: { check: PersistenceActivationCheck }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.owner} owner</p>
          <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{check.label}</h3>
        </div>
        <StatusPill label={check.status} tone={statusTone[check.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{check.evidence}</p>
      <div className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next action</p>
        <p className="mt-1 text-sm leading-6 text-[var(--tenant-text)]">{check.nextAction}</p>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
