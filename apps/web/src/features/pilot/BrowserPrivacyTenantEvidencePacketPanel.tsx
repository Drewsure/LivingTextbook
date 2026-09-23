import { StatusPill } from "@living-textbook/ui";
import type {
  BrowserPrivacyTenantEvidencePacket,
  BrowserRehearsalEvidenceLane,
} from "@living-textbook/content-model";

export function BrowserPrivacyTenantEvidencePacketPanel({
  packet,
  validationErrors,
  embedded = false,
}: {
  packet: BrowserPrivacyTenantEvidencePacket;
  validationErrors: string[];
  embedded?: boolean;
}) {
  return (
    <section className={embedded ? "border-t border-[var(--tenant-border)] pt-4" : "rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-5 shadow-sm"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Browser rehearsal evidence packet</p>
          <h2 className="mt-1 text-xl font-bold">Three proof lanes, one exact scope</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet keeps browser continuity, privacy-negative checks, and tenant-isolation checks together for the same tenant, package, unit, and session. Pending means not captured; it is never treated as a green release signal.
          </p>
        </div>
        <StatusPill label="Review-only" tone="warning" />
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Packet" value={packet.packetId} />
        <Fact label="Tenant" value={packet.tenantId} />
        <Fact label="Package" value={packet.packageId} />
        <Fact label="Session" value={packet.studentSessionId} />
      </dl>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {packet.lanes.map((lane) => <LaneCard key={lane.laneId} lane={lane} />)}
      </div>
      {validationErrors.length > 0 ? (
        <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-bold">Packet validation warnings</p>
          <ul className="mt-2 grid gap-1">{validationErrors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul>
        </div>
      ) : null}
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <BoundaryList title="Blocked side effects" values={packet.blockedActions} />
        <BoundaryList title="Next gate" values={packet.nextGate} />
      </div>
    </section>
  );
}

function LaneCard({ lane }: { lane: BrowserRehearsalEvidenceLane }) {
  const label = lane.laneId === "tenant-isolation" ? "Tenant isolation" : lane.laneId === "browser" ? "Browser continuity" : "Privacy boundary";
  const tone = lane.status === "passed" ? "success" : "warning";
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{label}</h3>
        <StatusPill label={lane.status} tone={tone} />
      </div>
      <p className="mt-3 break-words text-xs font-semibold text-[var(--tenant-muted)]">{lane.sourceRecord}</p>
      <ul className="mt-3 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">
        {lane.checkIds.map((checkId) => <li key={`${lane.laneId}-${checkId}`}>{checkId}</li>)}
      </ul>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function BoundaryList({ title, values }: { title: string; values: string[] }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-2 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}`}>{value}</li>)}</ul></section>;
}
