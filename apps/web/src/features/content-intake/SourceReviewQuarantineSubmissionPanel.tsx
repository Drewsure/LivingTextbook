import { Card, StatusPill } from "@living-textbook/ui";

export function SourceReviewQuarantineSubmissionPanel({
  tenantId,
  quarantineId,
}: {
  tenantId: string;
  quarantineId: string;
}) {
  const encodedTenantId = encodeURIComponent(tenantId);
  const encodedQuarantineId = encodeURIComponent(quarantineId);
  const metadataReviewPath = `/api/teacher/uploads/review?tenantId=${encodedTenantId}&quarantineId=${encodedQuarantineId}`;
  const evidencePreviewPath = `/api/teacher/uploads/evidence-preview?tenantId=${encodedTenantId}&quarantineId=${encodedQuarantineId}`;
  const handoffPath = `/teacher/evidence/${encodedTenantId}/handoff?quarantineId=${encodedQuarantineId}`;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Current publisher submission</p>
          <h2 className="mt-1 text-lg font-bold">Quarantine review handoff</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This opaque submission identity came from the tenant intake flow. Use the authorized review contracts below to inspect bounded metadata and evidence status before any package or student route can be created.
          </p>
        </div>
        <StatusPill label="Review only" tone="warning" />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <Fact label="Tenant" value={tenantId} />
        <Fact label="Quarantine ID" value={quarantineId} />
      </dl>

      <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
        <a className="text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4" href={metadataReviewPath}>
          Open metadata review
        </a>
        <a className="text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4" href={evidencePreviewPath}>
          Open evidence preview
        </a>
        <a className="text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4" href={handoffPath}>
          Open package handoff
        </a>
      </div>

      <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
        Raw payloads, download URLs, extraction, package assembly, QR printing, hosted persistence, and student-facing use remain blocked until their separate evidence gates are satisfied.
      </p>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-all text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
