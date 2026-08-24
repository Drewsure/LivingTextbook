import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PackageAdoptionStorageGuard,
  PackageAdoptionStorageGuardStatus,
} from "@/data/samplePackageAdoptionStorageGuard";

interface PackageAdoptionStorageGuardPanelProps {
  guards: PackageAdoptionStorageGuard[];
}

const statusLabels: Record<PackageAdoptionStorageGuardStatus, string> = {
  "contracted-preview": "Contracted preview",
  "policy-required": "Policy required",
  blocked: "Blocked",
};

export function PackageAdoptionStorageGuardPanel({ guards }: PackageAdoptionStorageGuardPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package adoption storage guard</p>
          <h2 className="mt-1 text-lg font-bold">Storage contract before premium activation</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            These guards connect package adoption previews to backend-neutral storage contracts. They make paid package
            activation reviewable without creating billing, model calls, microphone scoring, report export, hosted
            storage, or local companion activation.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={`${guards.length} guard(s)`} tone="warning" />
          <StatusPill label="No activation writes" tone="warning" />
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
              <GuardList title="Required before activation" items={guard.requiredBeforeActivation} ownerId={guard.guardId} />
              <GuardList title="Blocked activations" items={guard.blockedActivations} ownerId={guard.guardId} tone="warning" />
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
