import { Card, StatusPill } from "@living-textbook/ui";
import type {
  UploadTargetMappingLane,
  UploadTargetMappingPlan,
  UploadTargetMappingStatus,
} from "@/data/sampleUploadTargetMapping";

interface UploadTargetMappingPanelProps {
  plan: UploadTargetMappingPlan;
}

const statusTone: Record<UploadTargetMappingStatus, "neutral" | "warning"> = {
  planned: "neutral",
  "blocked-preview": "warning",
};

export function UploadTargetMappingPanel({ plan }: UploadTargetMappingPanelProps) {
  const blockedCount = plan.lanes.filter((lane) => lane.status === "blocked-preview").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Source-to-target mapping</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Hard rules</h3>
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
          <TargetMappingLaneCard key={lane.mappingId} lane={lane} />
        ))}
      </div>
    </Card>
  );
}

function TargetMappingLaneCard({ lane }: { lane: UploadTargetMappingLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {lane.sourceChannelId} / {lane.targetKind}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h3>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--tenant-muted)]">{lane.routePreview}</p>
        </div>
        <StatusPill label={lane.status} tone={statusTone[lane.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <TargetMappingList title="Target record" items={[lane.targetRecord]} tone="neutral" />
        <TargetMappingList title="Required evidence" items={lane.requiredEvidence} tone="warning" />
        <TargetMappingList title="Allowed preview actions" items={lane.allowedPreviewActions} tone="neutral" />
        <TargetMappingList title="Blocked shortcuts" items={lane.blockedShortcuts} tone="warning" />
      </div>

      <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next gate</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{lane.nextGate}</p>
      </section>
    </article>
  );
}

function TargetMappingList({
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
