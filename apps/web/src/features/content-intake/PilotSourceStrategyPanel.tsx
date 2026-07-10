import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotSourceOption,
  PilotSourceOptionStatus,
  PilotSourceStrategy,
} from "@/data/samplePilotSourceStrategy";

interface PilotSourceStrategyPanelProps {
  strategy: PilotSourceStrategy;
}

const statusTone: Record<PilotSourceOptionStatus, "neutral" | "success" | "warning"> = {
  recommended: "success",
  later: "neutral",
  blocked: "warning",
};

const statusLabel: Record<PilotSourceOptionStatus, string> = {
  recommended: "Recommended",
  later: "Later",
  blocked: "Blocked",
};

export function PilotSourceStrategyPanel({ strategy }: PilotSourceStrategyPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot source strategy</p>
          <h2 className="mt-1 text-lg font-bold">{strategy.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{strategy.reason}</p>
        </div>
        <StatusPill label="Review-first" tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Current decision</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--tenant-text)]">{strategy.decision}</p>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {strategy.options.map((option) => (
          <SourceOptionCard key={option.optionId} option={option} />
        ))}
      </div>
    </Card>
  );
}

function SourceOptionCard({ option }: { option: PilotSourceOption }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{option.costPosture} cost</p>
          <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{option.label}</h3>
        </div>
        <StatusPill label={statusLabel[option.status]} tone={statusTone[option.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{option.summary}</p>
      <SourceList title="Benefits" items={option.benefits} tone="success" />
      <SourceList title="Risks" items={option.risks} tone="warning" />
      <SourceList title="Required before use" items={option.requiredBeforeUse} tone="neutral" />
    </article>
  );
}

function SourceList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
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
