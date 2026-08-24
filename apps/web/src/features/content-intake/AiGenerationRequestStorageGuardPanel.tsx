import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGenerationRequestStorageGuard,
  AiGenerationRequestStorageGuardStatus,
} from "@/data/sampleAiGenerationRequestStorageGuard";

interface AiGenerationRequestStorageGuardPanelProps {
  guards: AiGenerationRequestStorageGuard[];
}

const statusLabel: Record<AiGenerationRequestStorageGuardStatus, string> = {
  "review-only": "Review only",
  "storage-required": "Storage required",
  blocked: "Blocked",
};

export function AiGenerationRequestStorageGuardPanel({ guards }: AiGenerationRequestStorageGuardPanelProps) {
  const blockedActionCount = guards.reduce((total, guard) => total + guard.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generation request storage guard</p>
          <h2 className="mt-1 text-lg font-bold">Durable records before live generation</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Request setup remains a review-only preview until request packets, cost gates, audio coverage, compatibility,
            media rights, draft storage, and verifier submission records are durable. This guard does not call a model,
            generate a draft, submit to a verifier, write routes, create playlists, or assign students.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusPill label={`${guards.length} guard(s)`} tone="warning" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {guards.map((guard) => (
          <article key={guard.guardId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
                  {guard.tenantId} / {guard.requestId}
                </p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{guard.label}</h3>
              </div>
              <StatusPill label={statusLabel[guard.status]} tone="warning" />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{guard.summary}</p>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <GuardList title="Required records" items={guard.requiredRecordIds} ownerId={guard.guardId} />
              <GuardList title="Visible fields" items={guard.visibleFields} ownerId={guard.guardId} />
              <GuardList title="Required before live request" items={guard.requiredBeforeLiveRequest} ownerId={guard.guardId} />
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
