import { Card, StatusPill } from "@living-textbook/ui";

interface TenantEvidencePacketHandoffEmptyStatePanelProps {
  tenantId: string;
  tenantName: string;
}

export function TenantEvidencePacketHandoffEmptyStatePanel({
  tenantId,
  tenantName,
}: TenantEvidencePacketHandoffEmptyStatePanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher handoff preview</p>
          <h2 className="mt-1 text-2xl font-bold">No handoff packet exists yet</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            {tenantName} has a tenant-safe handoff shell, but no reviewed source, game, media, rights, accessibility, or release packet exists for this tenant.
          </p>
        </div>
        <StatusPill label="Handoff blocked" tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <h3 className="text-base font-bold">Required before handoff</h3>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            <li>Admit the publisher source through tenant quarantine review.</li>
            <li>Bind content, game, audio, video, image, rights, and accessibility evidence.</li>
            <li>Record package, delivery-mode, and release-control identities.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
          <h3 className="text-base font-bold">Nothing is promoted here</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
            No sample package is shown for this tenant. Export, signing, package assembly, QR printing, playlist creation, assignment, and student use remain blocked.
          </p>
          <a
            href={`/teacher/evidence/${encodeURIComponent(tenantId)}`}
            className="mt-4 inline-flex rounded-lg border border-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
          >
            Open tenant evidence review
          </a>
        </section>
      </div>
    </Card>
  );
}
