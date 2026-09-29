import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotQrAliasRegistryPreview } from "@living-textbook/content-model";

export function PilotQrAliasRegistryPreviewPanel({
  registry,
  validationErrors,
}: {
  registry: PilotQrAliasRegistryPreview;
  validationErrors: string[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">QR alias registry preview</p>
          <h2 className="mt-1 text-lg font-bold">Stable textbook aliases, bound before printing</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet binds each printed QR identity to the exact tenant, package, version, target, fallback, and release evidence. It is a review artifact only: it does not write a registry, mutate a route, print a production code, or activate students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review only" tone="warning" />
          <StatusPill label="Production print blocked" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Registry preview" value={registry.previewId} />
        <Fact label="Entries" value={String(registry.entries.length)} />
        <Fact label="Manifest" value={registry.manifestId} />
        <Fact label="Release receipt" value={registry.receiptId} />
      </dl>

      <div className="mt-5 grid gap-4">
        {registry.entries.map((entry) => (
          <article key={entry.aliasId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{entry.printedQrId}</p>
                <h3 className="mt-1 text-base font-bold">{entry.targetLabel}</h3>
              </div>
              <StatusPill label={entry.status} tone="warning" />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Fact label="Tenant" value={entry.tenantId} />
              <Fact label="Package" value={entry.packageId} />
              <Fact label="Alias" value={entry.aliasPath} />
              <Fact label="Fallback" value={entry.fallbackPath} />
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.deploymentTargets.map((target) => <StatusPill key={`${entry.aliasId}-${target}`} label={target} tone="neutral" />)}
              <StatusPill label="Rollback evidence pending" tone="warning" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Unresolved requirements" items={registry.unresolvedRequirements} />
        <ListBlock title="Blocked actions" items={registry.blockedActions} />
      </div>

      {validationErrors.length > 0 ? <ListBlock title="Registry contract findings" items={validationErrors} /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-all text-sm font-bold">{value}</dd></div>;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold">{title}</h3><StatusPill label={String(items.length)} tone="warning" /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>;
}
