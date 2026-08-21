import { Card, StatusPill } from "@living-textbook/ui";
import type {
  GameModeSettingsStorageReadinessPlan,
  GameModeSettingsStorageRecord,
  GameModeSettingsStorageStatus,
} from "@/data/sampleGameModeSettingsStorageReadiness";

interface GameModeSettingsStorageReadinessPanelProps {
  plan: GameModeSettingsStorageReadinessPlan;
}

const statusTone: Record<GameModeSettingsStorageStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "review-only": "neutral",
};

export function GameModeSettingsStorageReadinessPanel({ plan }: GameModeSettingsStorageReadinessPanelProps) {
  const blockedCount = plan.records.filter((record) => record.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Settings storage contract</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="No live writes" tone="warning" />
          <StatusPill label={`${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "neutral"} />
        </div>
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.decisionRule}</p>
      </section>

      <div className="mt-5 grid gap-4">
        {plan.records.map((record) => (
          <SettingsStorageRecordCard key={record.recordId} record={record} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <SettingsStorageList title="Adapter rules" items={plan.adapterRules} />
        <SettingsStorageList title="Global blocked actions" items={plan.globalBlockedActions} tone="warning" />
      </div>
    </Card>
  );
}

function SettingsStorageRecordCard({ record }: { record: GameModeSettingsStorageRecord }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.recordType}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{record.purpose}</p>
        </div>
        <StatusPill label={record.status} tone={statusTone[record.status]} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SettingsStorageFact label="Entity" value={record.backendEntityId} />
        <SettingsStorageFact label="Durable record" value={record.durableRecordId} />
        <SettingsStorageFact label="Primary key" value={record.primaryKey} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <SettingsStorageFact label="Hosted write intent" value={record.hostedWriteIntent} />
        <SettingsStorageFact label="Local write intent" value={record.localWriteIntent} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SettingsStorageList title="Required fields" items={record.requiredFields} />
        <SettingsStorageList title="Source profiles" items={record.sourceProfiles} />
        <SettingsStorageList title="Acceptance rules" items={record.acceptanceRules} />
        <SettingsStorageList title="Blocked writes" items={record.blockedWrites} tone="warning" />
      </div>
    </article>
  );
}

function SettingsStorageFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function SettingsStorageList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
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
