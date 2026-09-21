import type { TeacherReportSnapshotRecoveryRehearsalPackage } from "@/data/sampleTeacherReportSnapshotRecoveryRehearsal";
import { Card, StatusPill } from "@living-textbook/ui";

interface TeacherReportSnapshotRecoveryRehearsalPanelProps {
  rehearsal: TeacherReportSnapshotRecoveryRehearsalPackage;
}

export function TeacherReportSnapshotRecoveryRehearsalPanel({ rehearsal }: TeacherReportSnapshotRecoveryRehearsalPanelProps) {
  const validCount = rehearsal.rehearsals.filter((item) => item.result.snapshotValid && item.result.recoveryPacketValid).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Report snapshot recovery rehearsal</p>
          <h2 className="mt-1 text-lg font-bold">Hosted and closed-local evidence use one shape</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This rehearsal validates the same sanitized teacher report snapshot against both deployment modes. It does not create a backup, restore records, export an archive, or write to a provider.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label={`${validCount}/${rehearsal.rehearsals.length} packets valid`} tone={validCount === rehearsal.rehearsals.length ? "success" : "warning"} />
          <StatusPill label="No provider activation" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={rehearsal.snapshot.tenantId} />
        <Fact label="Package" value={rehearsal.snapshot.packageId} />
        <Fact label="Launch" value={rehearsal.snapshot.launchCode} />
        <Fact label="Fingerprint" value={rehearsal.rehearsals[0]?.packet.snapshotFingerprint ?? "Unavailable"} />
      </dl>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {rehearsal.rehearsals.map((item) => (
          <section key={item.deploymentMode} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold">{item.deploymentMode === "hosted-managed" ? "Hosted-managed" : "Closed local"}</h3>
              <StatusPill label={item.result.decision.allowed ? "Allowed" : "Blocked"} tone="warning" />
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">Packet: {item.packet.packetId}</p>
            <ul className="mt-3 grid gap-1 text-sm leading-6 text-[var(--tenant-muted)]">
              <li>Snapshot validation: {item.result.snapshotValid ? "passed" : "blocked"}</li>
              <li>Recovery packet: {item.result.recoveryPacketValid ? "passed" : "blocked"}</li>
              <li>Restore side effect: {item.result.sideEffect}</li>
              <li>Writes: blocked</li>
              <li>Export: blocked</li>
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <h3 className="text-sm font-bold">Required before live recovery</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          Provider selection, retention, encryption, school or tenant policy, release approval, and human recovery authorization remain separate gates. A valid rehearsal is evidence, not permission.
        </p>
      </div>
    </Card>
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
