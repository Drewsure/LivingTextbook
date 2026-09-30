import { Card, StatusPill } from "@living-textbook/ui";
import type { PilotDeliveryReleasePreflight } from "@living-textbook/content-model";

export function PilotDeliveryReleasePreflightPanel({ preflight, errors }: { preflight: PilotDeliveryReleasePreflight; errors: string[] }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Release-control preflight</p>
          <h2 className="mt-1 text-lg font-bold">Manifest, receipt, and QR identity binding</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review-only record proves that the release records point to the same tenant, package, version, and source checksum before any future operator workflow is considered.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={preflight.status} tone={preflight.status === "blocked" ? "warning" : "success"} />
          <StatusPill label="No release write" tone="warning" />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={preflight.tenantId} />
        <Fact label="Package" value={preflight.packageId} />
        <Fact label="Version" value={preflight.version} />
        <Fact label="QR registry" value={preflight.qrRegistryPreviewId} />
      </dl>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ListBlock title="Open requirements" items={preflight.unresolvedRequirements} />
        <ListBlock title="Protected actions" items={preflight.blockedActions} />
      </div>
      {errors.length > 0 ? <ListBlock title="Preflight contract findings" items={errors} /> : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone={items.length > 0 ? "warning" : "success"} /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">{item}</li>)}</ul></section>;
}
