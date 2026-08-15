import { Card, StatusPill } from "@living-textbook/ui";
import type {
  EvidencePacketAssemblyGate,
  EvidencePacketAssemblyLane,
  EvidencePacketAssemblyLaneStatus,
} from "@/data/sampleEvidencePacketAssemblyGate";

interface EvidencePacketAssemblyGatePanelProps {
  gate: EvidencePacketAssemblyGate;
}

const laneTone: Record<EvidencePacketAssemblyLaneStatus, "success" | "warning"> = {
  "preview-ready": "success",
  blocked: "warning",
};

export function EvidencePacketAssemblyGatePanel({ gate }: EvidencePacketAssemblyGatePanelProps) {
  const blockedLanes = gate.lanes.filter((lane) => lane.status === "blocked").length;
  const packetKeyCount = new Set(gate.lanes.flatMap((lane) => lane.packetKeys)).size;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence assembly readiness</p>
            <h2 className="mt-1 text-2xl font-bold">{gate.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label={gate.assemblyStatus} tone="warning" />
            <StatusPill label={gate.packetVersionStatus} tone="warning" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Release readiness lanes" value={String(gate.lanes.length)} />
          <Metric label="Blocked lanes" value={String(blockedLanes)} tone="warning" />
          <Metric label="Unique packet keys" value={String(packetKeyCount)} />
          <Metric label="Blocked actions" value={String(gate.blockedActions.length)} tone="warning" />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          <RouteLink label="Source review route" href={gate.sourceReviewRoute} />
          <RouteLink label="Handoff preview route" href={gate.handoffPreviewRoute} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill label={gate.exportReadinessStatus} tone="warning" />
          <StatusPill label={gate.storageAdapterStatus} tone="warning" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Release readiness lanes</p>
            <h3 className="mt-1 text-lg font-bold">Evidence that must assemble before release control can move</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Each lane shows the packet keys and missing proof that block approval, export, QR promotion, and student assignment.
            </p>
          </div>
          <StatusPill label="Review-only" tone="warning" />
        </div>

        <div className="mt-5 grid gap-4">
          {gate.lanes.map((lane) => (
            <LaneCard key={lane.laneId} lane={lane} />
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Release preconditions</p>
              <h3 className="mt-1 text-lg font-bold">Required before packet version freeze</h3>
            </div>
            <StatusPill label={String(gate.releasePreconditions.length)} tone="warning" />
          </div>
          <ListBlock items={gate.releasePreconditions} />
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">Assembly guardrails</p>
              <h3 className="mt-1 text-lg font-bold">Reviewer instructions and blocked actions</h3>
            </div>
            <StatusPill label="Hard gate" tone="warning" />
          </div>
          <ListBlock title="Reviewer instructions" items={gate.reviewerInstructions} />
          <ListBlock title="Blocked actions" items={gate.blockedActions} />
        </Card>
      </div>
    </div>
  );
}

function LaneCard({ lane }: { lane: EvidencePacketAssemblyLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.laneId}</p>
          <h4 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h4>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">Owner: {lane.ownerRole}</p>
          <a
            href={lane.sourceRoute}
            className="mt-2 block break-words text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
          >
            {lane.sourceRoute}
          </a>
        </div>
        <StatusPill label={lane.status} tone={laneTone[lane.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <ListBlock title="Packet keys" items={lane.packetKeys} />
        <ListBlock title="Required before release" items={lane.requiredBeforeRelease} />
      </div>
    </article>
  );
}

function RouteLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3 text-sm font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4"
    >
      {label}: {href}
    </a>
  );
}

function ListBlock({ title, items }: { title?: string; items: string[] }) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      {title ? <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4> : null}
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${title ?? "assembly-list"}-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
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
