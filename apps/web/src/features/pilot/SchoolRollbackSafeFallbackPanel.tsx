import { Card, StatusPill } from "@living-textbook/ui";
import type {
  RollbackFallbackStatus,
  SchoolRollbackSafeFallbackPlan,
  RollbackFallbackMessage,
  RollbackRouteFallback,
} from "@/data/sampleSchoolRollbackSafeFallbackPlan";

interface SchoolRollbackSafeFallbackPanelProps {
  plan: SchoolRollbackSafeFallbackPlan;
}

const statusLabel: Record<RollbackFallbackStatus, string> = {
  blocked: "Blocked",
  "needs-policy": "Needs policy",
  "future-required": "Future required",
};

const statusTone: Record<RollbackFallbackStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "needs-policy": "warning",
  "future-required": "neutral",
};

export function SchoolRollbackSafeFallbackPanel({ plan }: SchoolRollbackSafeFallbackPanelProps) {
  const blockedActionCount = countUnique([
    ...plan.messages.flatMap((message) => message.blockedActions),
    ...plan.routeFallbacks.flatMap((fallback) => fallback.blockedActions),
  ]);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">School rollback safe fallback plan</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={plan.statusLabel} tone="warning" />
          <StatusPill label="Review only" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FallbackMetric label="Message drafts" value={String(plan.messages.length)} tone="neutral" />
        <FallbackMetric label="Route fallbacks" value={String(plan.routeFallbacks.length)} tone="neutral" />
        <FallbackMetric label="Blocked actions" value={String(blockedActionCount)} tone="warning" />
        <FallbackMetric label="Source matrix" value={plan.sourceMatrixId} tone="neutral" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Fallback boundary</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              Safe fallback copy is not a redirect, notification, approval, or shutdown system. No production QR
              redirect mutation, no live notification, no classroom shutdown workflow, and no local bundle
              deactivation can start from this plan.
            </p>
          </div>
          <StatusPill label="No live notification" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {plan.messages.map((message) => (
          <MessageCard key={message.messageId} message={message} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {plan.routeFallbacks.map((fallback) => (
          <RouteFallbackCard key={fallback.fallbackId} fallback={fallback} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-base font-bold text-[var(--tenant-text)]">Fallback rules</h3>
          <StatusPill label="Rules" tone="warning" />
        </div>
        <FallbackBullets items={plan.rules} />
      </section>
    </Card>
  );
}

function MessageCard({ message }: { message: RollbackFallbackMessage }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{`${message.audience} / ${message.owner}`}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{message.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{message.copyPurpose}</p>
        </div>
        <StatusPill label={statusLabel[message.status]} tone={statusTone[message.status]} />
      </div>
      <p className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm font-semibold leading-6 text-[var(--tenant-text)]">
        {message.sampleCopy}
      </p>
      <FallbackMiniList title="Blocked actions" items={message.blockedActions} tone="warning" />
    </article>
  );
}

function RouteFallbackCard({ fallback }: { fallback: RollbackRouteFallback }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{fallback.routeSurface}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{fallback.label}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{fallback.safeDestination}</p>
        </div>
        <StatusPill label={statusLabel[fallback.status]} tone={statusTone[fallback.status]} />
      </div>
      <div className="mt-3 grid gap-3">
        <FallbackMiniList title="Required policy" items={fallback.requiredPolicy} tone="neutral" />
        <FallbackMiniList title="Blocked actions" items={fallback.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function FallbackMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function FallbackMiniList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <FallbackBullets items={items} />
    </section>
  );
}

function FallbackBullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
      {items.map((item) => (
        <li key={item} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-2">
          {item}
        </li>
      ))}
    </ul>
  );
}

function countUnique(items: string[]) {
  return new Set(items).size;
}
