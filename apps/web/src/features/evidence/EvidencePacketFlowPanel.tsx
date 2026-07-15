import { Card, StatusPill } from "@living-textbook/ui";
import type { EvidencePacket, EvidencePacketFlow, EvidencePacketStatus } from "@/data/sampleEvidencePacketFlows";

interface EvidencePacketFlowPanelProps {
  flow: EvidencePacketFlow;
}

const statusTone: Record<EvidencePacketStatus, "success" | "warning"> = {
  "preview-ready": "success",
  "missing-evidence": "warning",
  blocked: "warning",
};

export function EvidencePacketFlowPanel({ flow }: EvidencePacketFlowPanelProps) {
  const readyCount = flow.packets.filter((packet) => packet.status === "preview-ready").length;
  const blockedCount = flow.packets.length - readyCount;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence packet flow</p>
          <h2 className="mt-1 text-xl font-bold">{flow.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{flow.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={`${readyCount} preview-ready`} tone="success" />
          <StatusPill label={`${blockedCount} blocked/missing`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Metric label="Scope" value={flow.scope} />
        <Metric label="Evidence packets" value={String(flow.packets.length)} />
        <Metric label="Blocked live actions" value={String(flow.blockedLiveActions.length)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Handoff rule</h3>
          <StatusPill label="evidence_packet" tone="warning" />
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{flow.handoffRule}</p>
      </section>

      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {flow.packets.map((packet) => (
          <EvidencePacketCard key={packet.packetId} packet={packet} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Blocked until evidence packets pass</h3>
          <StatusPill label={String(flow.blockedLiveActions.length)} tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] sm:grid-cols-2">
          {flow.blockedLiveActions.map((action) => (
            <li key={action} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              {action}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function EvidencePacketCard({ packet }: { packet: EvidencePacket }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="break-words text-xs font-semibold uppercase text-[var(--tenant-muted)]">{packet.packetKey}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{packet.label}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{packet.protects}</p>
        </div>
        <StatusPill label={packet.status} tone={statusTone[packet.status]} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <DataList title="Owner" items={[packet.ownerRole]} />
        <DataList title="Required evidence" items={packet.requiredEvidence} />
        <DataList title="Missing evidence" items={packet.missingEvidence} tone="warning" />
      </dl>
    </article>
  );
}

function DataList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <dt className="font-semibold text-[var(--tenant-text)]">{title}</dt>
      <dd className="mt-2">
        <ul className="grid gap-1 text-[var(--tenant-muted)]">
          {items.map((item) => (
            <li key={item} className={tone === "warning" ? "font-semibold text-[var(--tenant-text)]" : undefined}>
              {item}
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

function Metric({
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
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
