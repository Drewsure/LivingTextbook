import { Card, StatusPill } from "@living-textbook/ui";
import type {
  MultimediaAssetGate,
  MultimediaAssetLane,
  MultimediaAssetReadinessPlan,
  MultimediaAssetStatus,
} from "@/data/sampleMultimediaAssetReadiness";

interface MultimediaAssetReadinessPanelProps {
  plan: MultimediaAssetReadinessPlan;
}

const statusTone: Record<MultimediaAssetStatus, "neutral" | "warning"> = {
  "blocked-preview": "warning",
  planned: "neutral",
};

export function MultimediaAssetReadinessPanel({ plan }: MultimediaAssetReadinessPanelProps) {
  const blockedCount = plan.gates.filter((gate) => gate.status === "blocked-preview").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media asset landing zone</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone="warning" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tenant-text)]">Manifest and binding records</h3>
            <StatusPill label={String(plan.manifestShape.length)} tone="warning" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {plan.manifestShape.map((item) => (
              <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tenant-text)]">Media lanes</h3>
            <StatusPill label={String(plan.lanes.length)} tone="neutral" />
          </div>
          <div className="mt-3 grid gap-3">
            {plan.lanes.map((lane) => (
              <MediaLaneCard key={lane.laneId} lane={lane} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {plan.gates.map((gate) => (
          <MediaGateCard key={gate.gateId} gate={gate} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.8fr]">
        <MediaList title="Blocked shortcuts" items={plan.blockedShortcuts} tone="warning" />
        <MediaList title="Storage names" items={plan.storageNames} tone="neutral" />
      </div>
    </Card>
  );
}

function MediaLaneCard({ lane }: { lane: MultimediaAssetLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h4>
        <StatusPill label={lane.targetRecord} tone="neutral" />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.detail}</p>
    </article>
  );
}

function MediaGateCard({ gate }: { gate: MultimediaAssetGate }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h3>
        <StatusPill label={gate.status} tone={statusTone[gate.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{gate.detail}</p>
    </article>
  );
}

function MediaList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
