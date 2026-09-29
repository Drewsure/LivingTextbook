import { Card, StatusPill } from "@living-textbook/ui";

interface TenantEvidencePacketEmptyStatePanelProps {
  tenantId: string;
  tenantName: string;
}

export function TenantEvidencePacketEmptyStatePanel({
  tenantId,
  tenantName,
}: TenantEvidencePacketEmptyStatePanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher package intake</p>
          <h2 className="mt-1 text-2xl font-bold">No evidence packet exists yet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            {tenantName} has a white-label review shell, but no source, rights, scan, multimedia, game, or accessibility evidence has been admitted for review.
          </p>
        </div>
        <StatusPill label="Awaiting publisher source" tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <h3 className="text-base font-bold">Next controlled step</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            Start at the tenant upload workspace, then submit source and media through quarantine when the school or publisher policy enables that review lane.
          </p>
          <a
            href={`/teacher/uploads/${encodeURIComponent(tenantId)}`}
            className="mt-4 inline-flex rounded-lg border border-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
          >
            Open tenant upload workspace
          </a>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
          <h3 className="text-base font-bold">Evidence remains blocked</h3>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            <li>No sample-publisher records are shown to this tenant.</li>
            <li>No package, QR alias, playlist, assignment, or student route is created.</li>
            <li>No evidence file is stored or exported by this review shell.</li>
          </ul>
        </section>
      </div>
    </Card>
  );
}
