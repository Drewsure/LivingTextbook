import { Card, StatusPill } from "@living-textbook/ui";
import type { SampleFrontDoorRouteRegistryEntry } from "@/data/sampleTenantRouteRegistry";

interface TenantRouteRegistryPanelProps {
  routes: SampleFrontDoorRouteRegistryEntry[];
}

export function TenantRouteRegistryPanel({ routes }: TenantRouteRegistryPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Route registry</p>
          <h2 className="mt-1 text-lg font-bold">Front-door package routes</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            These sample routes model the future registry that will keep printed textbook QR codes stable while package versions, launch sessions, and local/hosted deployments change underneath.
          </p>
        </div>
        <StatusPill label={`${routes.length} routes`} tone="success" />
      </div>

      <div className="mt-5 grid gap-3">
        {routes.map((route) => (
          <article key={route.routeId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{route.tenant.displayName}</p>
                <h3 className="mt-1 text-base font-bold">{route.path}</h3>
                <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">Permanent QR: {route.permanentQrPath}</p>
              </div>
              <StatusPill label={route.status} tone={route.status === "active-demo" ? "success" : "neutral"} />
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <RegistryFact label="Package" value={route.contentPackage.meta.packageId} />
              <RegistryFact label="Entry code" value={route.expectedEntryCode} />
              <RegistryFact label="User code" value={route.expectedUserCode} />
            </dl>
          </article>
        ))}
      </div>
    </Card>
  );
}

function RegistryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
