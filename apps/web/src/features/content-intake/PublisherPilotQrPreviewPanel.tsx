import { Card, StatusPill } from "@living-textbook/ui";
import type { PublisherPilotIntakeQrPreview } from "@living-textbook/content-model";

export function PublisherPilotQrPreviewPanel({ preview, errors }: { preview: PublisherPilotIntakeQrPreview; errors: string[] }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher QR alias preview</p>
          <h2 className="mt-1 text-lg font-bold">Stable page-linked routes before print authorization</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            Each declared textbook reference has a tenant, edition, activity, and local fallback identity. This preview
            does not write a registry, mutate a route, authorize printing, or activate students.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="Print blocked" tone="warning" />
          <StatusPill label="Fallback mapped" tone="success" />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {preview.entries.map((entry) => (
          <article key={entry.referenceId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{entry.pageReference}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{entry.printedQrId}</h3>
              </div>
              <StatusPill label="Draft alias" tone="neutral" />
            </div>
            <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <RouteFact label="Stable alias" value={entry.aliasPath} />
              <RouteFact label="Local fallback" value={entry.fallbackPath} />
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <RouteFact label="Preview id" value={preview.previewId} />
        <RouteFact label="Blocked actions" value={preview.blockedActions.join("; ")} />
      </div>
      {errors.length > 0 ? <p className="mt-4 text-sm font-semibold text-[var(--tenant-text)]">Preview validation: {errors.join(" ")}</p> : null}
    </Card>
  );
}

function RouteFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
