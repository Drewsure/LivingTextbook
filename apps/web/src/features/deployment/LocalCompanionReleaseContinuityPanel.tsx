import type { LocalCompanionReleaseContinuityPacket } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

export function LocalCompanionReleaseContinuityPanel({
  packet,
  errors,
}: {
  packet: LocalCompanionReleaseContinuityPacket;
  errors: string[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Closed-local continuity packet</p>
          <h2 className="mt-1 text-lg font-bold">Installer, updates, and recovery evidence</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet makes the packaged companion handoff explicit for a publisher. It records what must be proven for installation, yearly updates, rollback, and operator recovery without executing any of those actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={packet.status} tone="warning" />
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="No installation" tone="success" />
          <StatusPill label="No package writes" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={packet.tenantId} />
        <Fact label="Package" value={packet.packageId} />
        <Fact label="Bundle" value={packet.bundleId} />
        <Fact label="Version" value={packet.version} />
        <Fact label="Installer" value={packet.installer.status} />
        <Fact label="Updates" value={packet.updates.status} />
        <Fact label="Recovery" value={packet.recovery.status} />
        <Fact label="Evidence bindings" value={String(packet.evidenceBindings.length)} />
      </dl>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Lane title="Installer evidence" status={packet.installer.status} values={[
          `Artifact: ${packet.installer.artifactRef}`,
          `Checksum: ${packet.installer.checksumRef}`,
          `Platforms: ${packet.installer.supportedPlatforms.join(", ")}`,
          `Device test: ${packet.installer.deviceTestRef}`,
        ]} />
        <Lane title="Update evidence" status={packet.updates.status} values={[
          `${packet.updates.currentVersion} -> ${packet.updates.targetVersion}`,
          `Strategy: ${packet.updates.updateStrategy}`,
          `Migration: ${packet.updates.migrationPlanRef}`,
          `Rollback: ${packet.updates.rollbackCheckpointRef}`,
        ]} />
        <Lane title="Recovery evidence" status={packet.recovery.status} values={[
          `Backup: ${packet.recovery.backupPacketRef}`,
          `Restore: ${packet.recovery.restoreRehearsalRef}`,
          `Retention: ${packet.recovery.retentionPolicyRef}`,
          `Operator: ${packet.recovery.operatorHandoffRef}`,
        ]} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Missing evidence" values={packet.missingEvidence} tone="warning" />
        <List title="Blocked actions" values={[
          "No installer execution",
          "No update execution",
          "No recovery execution",
          "No package or route mutation",
          "No student promotion",
          "No export",
        ]} tone="warning" />
      </div>

      {errors.length > 0 && <List title="Packet errors" values={errors} tone="warning" />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold">{value}</dd></div>;
}

function Lane({ title, status, values }: { title: string; status: string; values: string[] }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-4"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-bold">{title}</h3><StatusPill label={status} tone="warning" /></div><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value) => <li key={`${title}-${value}`}>{value}</li>)}</ul></section>;
}

function List({ title, values, tone = "neutral" }: { title: string; values: string[]; tone?: "neutral" | "warning" }) {
  return <section className={`rounded-lg border border-[var(--tenant-border)] p-4 ${tone === "warning" ? "bg-[var(--tenant-primary-soft)]" : ""}`}><h3 className="text-sm font-bold">{title}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
