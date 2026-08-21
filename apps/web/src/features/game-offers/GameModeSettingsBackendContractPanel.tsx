import { Card, StatusPill } from "@living-textbook/ui";
import type {
  GameModeSettingsBackendContractPlan,
  GameModeSettingsBackendContractRecord,
} from "@/data/sampleGameModeSettingsBackendContract";

interface GameModeSettingsBackendContractPanelProps {
  plan: GameModeSettingsBackendContractPlan;
}

export function GameModeSettingsBackendContractPanel({ plan }: GameModeSettingsBackendContractPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Backend contract map</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review only" tone="neutral" />
          <StatusPill label="No live writes" tone="warning" />
        </div>
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.decisionRule}</p>
      </section>

      <div className="mt-5 grid gap-4">
        {plan.records.map((record) => (
          <BackendContractRecordCard key={record.recordId} record={record} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <BackendContractList title="Implementation gates" items={plan.implementationGates} tone="neutral" />
        <BackendContractList title="Blocked actions" items={plan.blockedActions} tone="warning" />
      </div>
    </Card>
  );
}

function BackendContractRecordCard({ record }: { record: GameModeSettingsBackendContractRecord }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.schemaEntity}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{record.purpose}</p>
        </div>
        <StatusPill label="Blocked" tone="warning" />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <BackendContractFact label="Migration candidate" value={record.migrationCandidate} />
        <BackendContractFact label="Migration spec" value={record.migrationSpec} />
        <BackendContractFact label="Persistence category" value={record.persistenceCategory} />
        <BackendContractFact label="Hosted write intent" value={record.hostedWriteIntent} />
        <BackendContractFact label="Local write intent" value={record.localWriteIntent} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <BackendContractList title="Required guarantees" items={record.requiredGuarantees} tone="neutral" />
        <BackendContractList title="Blocked mutations" items={record.blockedMutations} tone="warning" />
      </div>
    </article>
  );
}

function BackendContractFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function BackendContractList({
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
