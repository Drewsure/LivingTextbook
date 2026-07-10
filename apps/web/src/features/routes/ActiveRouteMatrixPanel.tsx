import { Card, StatusPill } from "@living-textbook/ui";
import type { ActiveRouteGroup, ActiveRouteMatrixItem } from "@/data/sampleActiveRouteMatrix";

interface ActiveRouteMatrixPanelProps {
  routes: ActiveRouteMatrixItem[];
}

const groupLabels: Record<ActiveRouteGroup, string> = {
  core: "Core",
  ministar: "MiniStar",
  "sample-publisher": "Sample publisher",
  "stable-qr": "Stable QR",
};

export function ActiveRouteMatrixPanel({ routes }: ActiveRouteMatrixPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Active route matrix</p>
          <h2 className="mt-1 text-lg font-bold">Current local verification routes</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            These are scaffold routes that should stay healthy during foundation work. They are not production QR promises unless the QR and publish gates say so.
          </p>
        </div>
        <StatusPill label={`${routes.length} checked routes`} tone="success" />
      </div>

      <div className="mt-5 grid gap-3">
        {routes.map((route) => (
          <article key={route.routeId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{groupLabels[route.group]}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{route.label}</h3>
              </div>
              <StatusPill label={route.status} tone={route.status === "active-demo" ? "success" : "neutral"} />
            </div>
            <p className="mt-2 break-all font-mono text-xs text-[var(--tenant-muted)]">{route.path}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{route.note}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}

