import { Card, StatusPill } from "@living-textbook/ui";

import type {
  AiPrototypePatchAuthorizationReleaseLock,
  AiPrototypePatchAuthorizationReleaseLockStatus,
} from "@/data/sampleAiPrototypePatchAuthorizationReleaseLock";

interface AiPrototypePatchAuthorizationReleaseLockPanelProps {
  locks: AiPrototypePatchAuthorizationReleaseLock[];
}

const statusTone: Record<AiPrototypePatchAuthorizationReleaseLockStatus, "neutral" | "warning" | "success"> = {
  locked: "warning",
  "review-only": "neutral",
  "ready-for-release-control-review": "success",
};

const statusLabel: Record<AiPrototypePatchAuthorizationReleaseLockStatus, string> = {
  locked: "Authorization locked",
  "review-only": "Review only",
  "ready-for-release-control-review": "Ready for release-control review",
};

export function AiPrototypePatchAuthorizationReleaseLockPanel({
  locks,
}: AiPrototypePatchAuthorizationReleaseLockPanelProps) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI prototype patch authorization release lock
          </p>
          <h2 className="mt-1 text-lg font-bold">Release-control lock before file work</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This lock shows the final release-control boundary before any generated patch could become real app file
            work. It authorizes nothing, writes nothing, and keeps student-facing routes closed.
          </p>
        </div>
        <StatusPill label="No patch authorization" tone="warning" />
      </div>

      <div className="space-y-3">
        {locks.map((lock) => (
          <article key={lock.lockId} className="rounded-lg border border-[var(--tenant-border)] bg-white p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lock.preflightId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lock.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{lock.summary}</p>
              </div>
              <StatusPill label={statusLabel[lock.status]} tone={statusTone[lock.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ListPanel title="Required release locks" items={lock.requiredReleaseLocks} />
              <ListPanel title="Authorization scope" items={lock.authorizationScope} />
              <ListPanel title="Forbidden until unlocked" items={lock.forbiddenUntilUnlocked} tone="warning" />
              <ListPanel title="Release evidence" items={lock.releaseEvidence} />
              <ListPanel title="Blocked actions" items={lock.blockedActions} tone="warning" />
              <ListPanel title="Next required records" items={lock.nextRequiredRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ListPanel({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
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
