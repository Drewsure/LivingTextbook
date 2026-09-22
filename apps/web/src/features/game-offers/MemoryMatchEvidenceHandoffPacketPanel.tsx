import { Card, StatusPill } from "@living-textbook/ui";
import type { MemoryMatchEvidenceHandoffPacket } from "@/data/sampleMemoryMatchEvidenceHandoffPacket";

export function MemoryMatchEvidenceHandoffPacketPanel({
  packet,
}: {
  packet: MemoryMatchEvidenceHandoffPacket;
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">External evidence handoff packet</p>
          <h2 className="mt-1 text-lg font-bold">Memory Match: ready for human Z.ai request</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is the first concrete handoff point for Z.ai. It requests evidence only and does not authorize source
            import, route replacement, package activation, or student use.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Ready for human handoff" tone="success" />
          <StatusPill label="Integration blocked" tone="warning" />
          <StatusPill label="No live dispatch" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Fact label="Builder" value={packet.targetBuilder} />
        <Fact label="Request" value={packet.requestId} />
        <Fact label="Mode / engine" value={`${packet.targetMode} / ${packet.parentEngine}`} />
        <Fact label="Scoring" value={packet.canonicalReference.scoringProfile} />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Frozen source binding</p>
        <p className="mt-2 text-sm font-bold text-[var(--tenant-text)]">{packet.sourceRepository}</p>
        <p className="mt-1 break-words text-xs leading-5 text-[var(--tenant-muted)]">Snapshot: {packet.sourceSnapshotId}</p>
        <p className="mt-1 break-all text-xs leading-5 text-[var(--tenant-muted)]">Commit: {packet.sourceCommitSha}</p>
        <p className="mt-1 break-words text-xs leading-5 text-[var(--tenant-muted)]">Eligibility: {packet.eligibilityId}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">Required evidence lanes: {packet.requiredEvidenceLaneIds.length}</p>
        <p className="mt-3 text-sm leading-6 text-[var(--tenant-text)]">{packet.humanAction}</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <PacketList title="Permitted evidence contents" items={packet.permittedContents} />
        <PacketList title="Required return artifacts" items={packet.requiredReturnArtifacts} />
        <PacketList title="Acceptance checks" items={packet.acceptanceChecks} />
        <PacketList title="Blocked actions" items={packet.blockedActions} warning />
      </div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function PacketList({ title, items, warning = false }: { title: string; items: string[]; warning?: boolean }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={String(items.length)} tone={warning ? "warning" : "neutral"} />
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
