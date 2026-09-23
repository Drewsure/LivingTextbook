import { Card, StatusPill } from "@living-textbook/ui";

const reviewLanes = [
  "Intake identity, channel, filename, MIME type, size, and checksum",
  "Pending scan, unknown rights, and unreviewed source state",
  "Payload presence without raw payload bytes or a download URL",
  "Explicit blockers for mapping, release, playlist, game, assignment, QR, and student use",
];

export function QuarantineMetadataReviewPanel({ tenantId }: { tenantId: string }) {
  const reviewEndpoint = `/api/teacher/uploads/review?tenantId=${encodeURIComponent(tenantId)}`;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Quarantine metadata review</p>
          <h2 className="mt-1 text-lg font-bold">Review state without opening the file</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The backend review path is tenant-scoped and metadata-only. It helps an authorized teacher see what is waiting for scan, rights, and source review while keeping the raw payload and every promotion path closed.
          </p>
        </div>
        <StatusPill label="Read-only" tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ReviewMetric label="Tenant boundary" value={tenantId} />
        <ReviewMetric label="Review state" value="Awaiting scan / rights / source review" tone="warning" />
        <ReviewMetric label="Raw payload response" value="Never returned" tone="warning" />
        <ReviewMetric label="Promotion and student use" value="Blocked" tone="warning" />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Authorized review contract</p>
        <p className="mt-2 break-all font-mono text-sm text-[var(--tenant-text)]">{reviewEndpoint}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          Authorization is required. The endpoint returns validated metadata and bounded generic errors only; it does not create a file viewer, download link, or approval action.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {reviewLanes.map((lane) => (
          <section key={lane} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <p className="text-sm leading-6 text-[var(--tenant-text)]">{lane}</p>
          </section>
        ))}
      </div>
    </Card>
  );
}

function ReviewMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Bound"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
