import { Card, StatusPill } from "@living-textbook/ui";
import type {
  UploadPromotionLane,
  UploadPromotionReadinessPlan,
  UploadPromotionStatus,
} from "@/data/sampleUploadPromotionReadiness";

interface UploadPromotionReadinessPanelProps {
  plan: UploadPromotionReadinessPlan;
}

const statusTone: Record<UploadPromotionStatus, "neutral" | "warning"> = {
  "blocked-preview": "warning",
  planned: "neutral",
};

export function UploadPromotionReadinessPanel({ plan }: UploadPromotionReadinessPanelProps) {
  const blockedCount = plan.lanes.filter((lane) => lane.status === "blocked-preview").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Target-specific promotion preview</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Hard rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Reviewed uploads still need target review</h3>
          </div>
          <StatusPill label={String(plan.hardRules.length)} tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {plan.hardRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5 grid gap-4">
        {plan.lanes.map((lane) => (
          <UploadPromotionLaneCard key={lane.laneId} lane={lane} />
        ))}
      </div>
    </Card>
  );
}

function UploadPromotionLaneCard({ lane }: { lane: UploadPromotionLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {lane.sourceChannelId} / {lane.targetKind}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.summary}</p>
        </div>
        <StatusPill label={lane.status} tone={statusTone[lane.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <PromotionList title="Required gates" items={lane.requiredGates} tone="neutral" />
        <PromotionList title="Blocked by" items={lane.blockedBy} tone="warning" />
        <PromotionList title="Allowed preview actions" items={lane.allowedPreviewActions} tone="neutral" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <PromotionList title="Not allowed yet" items={lane.notAllowedYet} tone="warning" />
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[var(--tenant-text)]">Storage before live</h4>
            <StatusPill label={String(lane.storageRequiredBeforeLive.length)} tone="warning" />
          </div>
          <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {lane.storageRequiredBeforeLive.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-text)]">{lane.nextStorageContract}</p>
        </section>
      </div>
    </article>
  );
}

function PromotionList({
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
