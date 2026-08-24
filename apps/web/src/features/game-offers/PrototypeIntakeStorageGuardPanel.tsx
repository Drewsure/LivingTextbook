import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PrototypeIntakeStorageGuard,
  PrototypeIntakeStorageGuardStatus,
} from "@/data/samplePrototypeIntakeStorageGuard";

interface PrototypeIntakeStorageGuardPanelProps {
  guards: PrototypeIntakeStorageGuard[];
}

const statusLabels: Record<PrototypeIntakeStorageGuardStatus, string> = {
  "contracted-preview": "Contracted preview",
  "evidence-required": "Evidence required",
  blocked: "Blocked",
};

export function PrototypeIntakeStorageGuardPanel({ guards }: PrototypeIntakeStorageGuardPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Prototype intake and return storage guard</p>
          <h2 className="mt-1 text-lg font-bold">Storage contracts before outside game intake or returned package review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            These guards connect Z.ai/outside prototype inventory and returned package evidence to backend-neutral records.
            They make useful external game work reviewable without importing code, replacing routes, changing scoring,
            writing rewards, creating playlists, promoting packages, or assigning students.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={`${guards.length} guard(s)`} tone="warning" />
          <StatusPill label="No storage writes" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {guards.map((guard) => (
          <article key={guard.guardId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{guard.guardId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{guard.label}</h3>
              </div>
              <StatusPill label={statusLabels[guard.status]} tone="warning" />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{guard.summary}</p>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <GuardList title="Storage contracts" items={guard.storageContractIds} ownerId={guard.guardId} />
              <GuardList title="Visible storage fields" items={guard.visibleStorageFields} ownerId={guard.guardId} />
              <GuardList title="Required before review" items={guard.requiredBeforeReview} ownerId={guard.guardId} />
              <GuardList title="Blocked actions" items={guard.blockedActions} ownerId={guard.guardId} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function GuardList({
  title,
  items,
  ownerId,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  ownerId: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${ownerId}-${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
