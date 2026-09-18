import type { LocalBundleRecoveryPacket } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundleRecoveryPacketPanelProps {
  packet: LocalBundleRecoveryPacket;
  errors: string[];
}

const laneTone = { passed: "success", open: "warning", blocked: "warning" } as const;

export function LocalBundleRecoveryPacketPanel({ packet, errors }: LocalBundleRecoveryPacketPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local recovery packet</p>
          <h2 className="mt-1 text-lg font-bold">Backup, restore, export, and retention stay governed</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet defines what a future local companion may prove before handoff. It does not create backups,
            restore data, export learner records, or mutate package routes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="Provider unselected" tone="warning" />
          <StatusPill label="Execution blocked" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={packet.tenantId} />
        <Fact label="Bundle" value={packet.bundleId} />
        <Fact label="Package" value={packet.packageId} />
        <Fact label="Retention" value={packet.retention.retentionDays ? `${packet.retention.retentionDays} days` : "Policy required"} />
      </dl>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Lane title="Backup" status={packet.backup.status} detail={`Manifest: ${packet.backup.manifestRef}`} />
        <Lane title="Restore" status={packet.restore.status} detail={`Rehearsal: ${packet.restore.rehearsalRef}`} />
        <Lane title="Export" status={packet.export.status} detail={`Policy: ${packet.export.policyRef}`} />
        <Lane title="Retention" status={packet.retention.status} detail={`Scope: ${packet.retention.deletionScope}`} />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <h3 className="text-sm font-bold">Protected content rules</h3>
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          <li>SHA-256 manifest evidence is required before a backup can be treated as valid.</li>
          <li>Restore must be rehearsed, rollback-aware, and blocked across tenant boundaries.</li>
          <li>Export excludes learner data, raw media, and credentials.</li>
          <li>Retention deletion remains policy-gated and scoped to tenant, package, and session.</li>
        </ul>
      </div>

      {errors.length > 0 && (
        <ul className="mt-5 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`recovery-packet-error-${index}-${error}`}>{error}</li>)}
        </ul>
      )}
    </Card>
  );
}

function Lane({ title, status, detail }: { title: string; status: "passed" | "open" | "blocked"; detail: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold">{title}</h3>
        <StatusPill label={status} tone={laneTone[status]} />
      </div>
      <p className="mt-2 break-words text-xs leading-5 text-[var(--tenant-muted)]">{detail}</p>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
