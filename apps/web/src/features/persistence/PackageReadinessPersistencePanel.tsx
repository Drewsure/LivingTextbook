import { Card, StatusPill } from "@living-textbook/ui";
import type { PackageReadinessPersistenceIntent } from "@living-textbook/content-model";

interface PackageReadinessPersistencePanelProps {
  intents: PackageReadinessPersistenceIntent[];
  errors: string[];
}

export function PackageReadinessPersistencePanel({ intents, errors }: PackageReadinessPersistencePanelProps) {
  const tenantCount = new Set(intents.map((intent) => intent.tenantId)).size;
  const stores = new Set(intents.map((intent) => intent.store));

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package evidence persistence</p>
          <h2 className="mt-1 text-lg font-bold">Tenant-scoped reconciliation record shape</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Package readiness persistence intent is the future hosted or local adapter shape for one metadata join across the seven readiness lanes. This preview keeps the chain durable by design without enabling a storage write, provider selection, package promotion, or student activation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Metadata preview" tone="warning" />
          <StatusPill label="Provider unselected" tone="success" />
          <StatusPill label="Writes blocked" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Summary label="Tenant samples" value={`${tenantCount}`} />
        <Summary label="Store tiers" value={`${stores.size}`} />
        <Summary label="Intents validated" value={`${errors.length === 0 ? intents.length : "Review"}`} />
      </div>

      {errors.length > 0 && (
        <section className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <h3 className="font-bold">Persistence intent findings</h3>
          <ul className="mt-2 grid gap-1">
            {errors.map((error, index) => <li key={`package-readiness-persistence-error-${index}-${error}`}>{error}</li>)}
          </ul>
        </section>
      )}

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {intents.map((intent) => (
          <article key={intent.intentId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold">{intent.label}</h3>
                <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{intent.store}</p>
              </div>
              <StatusPill label="Blocked by design" tone="warning" />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{intent.summary}</p>
            <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-2">
              <Field label="Tenant" value={intent.tenantId} />
              <Field label="Package" value={intent.packageId} />
              <Field label="Release candidate" value={intent.releaseCandidate} />
              <Field label="Evidence refs" value={`${Object.keys(intent.evidenceLaneRefs).length} lanes`} />
              <Field label="Provider" value="Unselected" />
              <Field label="Student activation" value="Blocked" />
            </dl>
            <div className="mt-3 rounded-md bg-[var(--tenant-primary-soft)] p-3 text-xs leading-5 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Blocked actions:</span> {intent.blockedActions.join("; ")}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}
