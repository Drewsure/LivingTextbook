import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherPilotPackageReadinessBinding, PublisherPilotPackageReadinessCheck } from "@living-textbook/content-model";

export function PublisherPilotPackageReadinessBindingPanel({
  binding,
  validationErrors,
}: {
  binding: PublisherPilotPackageReadinessBinding;
  validationErrors: string[];
}) {
  const passed = binding.checks.filter((check) => check.status === "passed").length;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher package readiness binding</p>
          <h2 className="mt-1 text-lg font-bold">One auditable status for the complete pilot handoff</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This metadata-only binding joins source quarantine, review, assembly preflight, package preview, delivery, release, and hosted opt-in identities. It gives the publisher one next-action view without creating files or enabling learners.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={binding.status} tone={binding.status === "blocked" ? "warning" : "success"} />
          <StatusPill label={`${passed}/${binding.checks.length} checks passed`} tone={passed === binding.checks.length ? "success" : "warning"} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={binding.tenantId} />
        <Fact label="Package" value={binding.packageId} />
        <Fact label="Binding" value={binding.bindingId} />
        <Fact label="Source checksum" value={binding.sourceChecksumSha256} />
        <Fact label="Quarantine" value={binding.quarantineId} />
        <Fact label="Review packet" value={binding.reviewPacketId} />
        <Fact label="Assembly preflight" value={binding.assemblyPreflightId} />
        <Fact label="Hosted opt-in" value={binding.hostedPersistenceDecisionPacketId ?? "Not selected"} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Review gate composition</p>
            <h3 className="mt-1 text-base font-bold">Every identity must remain aligned</h3>
          </div>
          <StatusPill label="No side effects" tone="neutral" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {binding.checks.map((check) => <CheckCard key={check.checkId} check={check} />)}
        </div>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Fact label="Package assembly" value="Blocked" />
        <Fact label="Promotion" value="Blocked" />
        <Fact label="Student use" value="Blocked" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Blocked reasons" items={binding.blockedReasons} tone="warning" />
        <ListBlock title="Next gates" items={binding.nextGates} />
      </div>

      {validationErrors.length > 0 ? <ListBlock title="Binding contract findings" items={validationErrors} tone="warning" /> : null}
    </Card>
  );
}

function CheckCard({ check }: { check: PublisherPilotPackageReadinessCheck }) {
  const tone = check.status === "passed" ? "success" : "warning";
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.checkId}</p>
          <h4 className="mt-1 text-sm font-bold">{check.label}</h4>
        </div>
        <StatusPill label={check.status} tone={tone} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{check.evidence}</p>
      <p className="mt-3 border-t border-[var(--tenant-border)] pt-3 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {check.nextAction}</p>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}

function ListBlock({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "neutral" | "warning" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>;
}
