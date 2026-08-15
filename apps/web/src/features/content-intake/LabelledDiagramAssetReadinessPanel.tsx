import { Card, StatusPill } from "@living-textbook/ui";
import type {
  LabelledDiagramAnchorRequirement,
  LabelledDiagramAssetGate,
  LabelledDiagramAssetReadinessPlan,
  LabelledDiagramAssetStatus,
} from "@/data/sampleLabelledDiagramAssetReadiness";

interface LabelledDiagramAssetReadinessPanelProps {
  plan: LabelledDiagramAssetReadinessPlan;
}

const statusTone: Record<LabelledDiagramAssetStatus, "neutral" | "warning"> = {
  "blocked-preview": "warning",
  planned: "neutral",
};

export function LabelledDiagramAssetReadinessPanel({ plan }: LabelledDiagramAssetReadinessPanelProps) {
  const blockedCount = plan.gates.filter((gate) => gate.status === "blocked-preview").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Game asset landing zone</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone="warning" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tenant-text)]">game_asset_manifest</h3>
            <StatusPill label={String(plan.manifestShape.length)} tone="warning" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {plan.manifestShape.map((item, index) => (
              <li key={`${plan.planId}-manifest-shape-${index}-${item}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tenant-text)]">label_anchor_record</h3>
            <StatusPill label={String(plan.anchorShape.length)} tone="warning" />
          </div>
          <div className="mt-3 grid gap-3">
            {plan.anchorShape.map((requirement) => (
              <AnchorRequirementCard key={requirement.requirementId} requirement={requirement} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {plan.gates.map((gate) => (
          <AssetGateCard key={gate.gateId} gate={gate} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.8fr]">
        <AssetList title="Blocked shortcuts" items={plan.blockedShortcuts} tone="warning" />
        <AssetList title="Storage names" items={plan.storageNames} tone="neutral" />
      </div>
    </Card>
  );
}

function AnchorRequirementCard({ requirement }: { requirement: LabelledDiagramAnchorRequirement }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{requirement.label}</h4>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{requirement.detail}</p>
    </article>
  );
}

function AssetGateCard({ gate }: { gate: LabelledDiagramAssetGate }) {
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

function AssetList({
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
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
