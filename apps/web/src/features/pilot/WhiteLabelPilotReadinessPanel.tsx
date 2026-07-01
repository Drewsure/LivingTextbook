import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotReadinessItem,
  PilotReadinessStatus,
  WhiteLabelPilotReadiness,
} from "@/data/whiteLabelPilotReadiness";

interface WhiteLabelPilotReadinessPanelProps {
  readiness: WhiteLabelPilotReadiness;
}

const statusTone: Record<PilotReadinessStatus, "success" | "warning" | "neutral"> = {
  ready: "success",
  "in-progress": "warning",
  blocked: "neutral",
};

const statusLabel: Record<PilotReadinessStatus, string> = {
  ready: "Ready",
  "in-progress": "In progress",
  blocked: "Needs decision",
};

export function WhiteLabelPilotReadinessPanel({ readiness }: WhiteLabelPilotReadinessPanelProps) {
  const counts = readiness.items.reduce(
    (result, item) => {
      result[item.status] += 1;
      return result;
    },
    { ready: 0, "in-progress": 0, blocked: 0 } satisfies Record<PilotReadinessStatus, number>,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Partner package</p>
          <h2 className="mt-1 text-lg font-bold">{readiness.headline}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            {readiness.recommendedPromise}
          </p>
        </div>
        <StatusPill label={readiness.colleaguePilotWindow} tone="success" />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <PilotWindow label="Internal proof" value={readiness.internalPocWindow} />
        <PilotWindow label="Colleague pilot" value={readiness.colleaguePilotWindow} />
        <PilotWindow label="Commercial product" value={readiness.commercialWindow} />
      </dl>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <ReadinessCount label="Ready" value={counts.ready} />
        <ReadinessCount label="In progress" value={counts["in-progress"]} />
        <ReadinessCount label="Needs decision" value={counts.blocked} />
      </div>

      <div className="mt-5 grid gap-3">
        {readiness.items.map((item) => (
          <ReadinessItemRow key={item.id} item={item} />
        ))}
      </div>
    </Card>
  );
}

function PilotWindow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function ReadinessCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function ReadinessItemRow({ item }: { item: PilotReadinessItem }) {
  return (
    <article className="grid gap-3 rounded-lg border border-[var(--tenant-border)] p-4 lg:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-[var(--tenant-text)]">{item.label}</h3>
          <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{item.proof}</p>
        <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">{item.nextStep}</p>
      </div>
      <p className="text-sm font-bold text-[var(--tenant-muted)]">{item.timeframe}</p>
    </article>
  );
}
