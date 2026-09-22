import { Card, StatusPill } from "@living-textbook/ui";
import type { PhaserCandidateEvidenceReturnPacket } from "@living-textbook/content-model";

const statusLabel = {
  "awaiting-return": "Awaiting external evidence",
  "received-review-only": "Received, review-only",
  blocked: "Blocked",
} as const;

export function PhaserCandidateEvidenceReturnPacketPanel({
  packets,
  errors,
}: {
  packets: PhaserCandidateEvidenceReturnPacket[];
  errors: string[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Returned evidence preflight</p>
          <h2 className="mt-1 text-lg font-bold">Inspect the packet before any source is imported</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This receipt layer is deliberately separate from the returned package manifest. It proves which evidence lanes
            have arrived and keeps the canonical route, scoring, persistence, and student assignment disabled until Codex review.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={packets.length + " packet(s)"} tone="neutral" />
          <StatusPill label={errors.length + " contract error(s)"} tone={errors.length > 0 ? "warning" : "success"} />
          <StatusPill label="Import disabled" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {packets.map((packet) => {
          const missing = packet.receipts.filter((receipt) => receipt.status === "missing").length;
          const reviewed = packet.receipts.filter((receipt) => receipt.status === "reviewed").length;
          return (
            <article key={packet.packetId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.tenantId} / {packet.queueItemId}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.gameMode}</h3>
                  <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">
                    {packet.sourceRepository} / {packet.sourceSnapshotId} / {packet.parentEngine}
                  </p>
                </div>
                <StatusPill label={statusLabel[packet.status]} tone={packet.status === "received-review-only" ? "warning" : "neutral"} />
              </div>

              <div className="mt-4 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-3">
                <p>Evidence lanes: {packet.receipts.length}</p>
                <p>Missing: {missing}</p>
                <p>Reviewed: {reviewed}</p>
              </div>

              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {packet.receipts.map((receipt) => (
                  <li key={receipt.laneId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3 text-sm">
                    <p className="font-semibold text-[var(--tenant-text)]">{receipt.laneId}</p>
                    <p className="mt-1 text-xs text-[var(--tenant-muted)]">{receipt.status} · {receipt.artifactIds.length} artifact(s)</p>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">{packet.note}</p>
              <p className="mt-3 text-xs font-semibold text-[var(--tenant-muted)]">
                Codex review required: {packet.codexReviewRequired ? "yes" : "no"}. Route replacement: disabled. Student assignment: disabled.
              </p>
            </article>
          );
        })}
      </div>

      {errors.length > 0 && (
        <ul className="mt-4 grid gap-2 text-sm text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}
        </ul>
      )}
    </Card>
  );
}
