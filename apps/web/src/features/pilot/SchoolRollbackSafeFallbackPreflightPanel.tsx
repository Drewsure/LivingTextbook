import { Card, StatusPill } from "@living-textbook/ui";
import type {
  SafeFallbackPreflightLane,
  SafeFallbackPreflightStatus,
  SchoolRollbackSafeFallbackPreflight,
} from "@/data/sampleSchoolRollbackSafeFallbackPreflight";

interface SchoolRollbackSafeFallbackPreflightPanelProps {
  preflight: SchoolRollbackSafeFallbackPreflight;
}

const statusLabel: Record<SafeFallbackPreflightStatus, string> = {
  blocked: "Blocked",
  "needs-policy": "Needs policy",
  "future-required": "Future required",
};

const statusTone: Record<SafeFallbackPreflightStatus, "neutral" | "warning"> = {
  blocked: "warning",
  "needs-policy": "warning",
  "future-required": "neutral",
};

export function SchoolRollbackSafeFallbackPreflightPanel({ preflight }: SchoolRollbackSafeFallbackPreflightPanelProps) {
  const blockedLaneCount = preflight.lanes.filter((lane) => lane.status !== "future-required").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">School rollback safe fallback preflight</p>
          <h2 className="mt-1 text-lg font-bold">{preflight.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preflight.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={preflight.statusLabel} tone="warning" />
          <StatusPill label="Review only" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PreflightMetric label="Preflight lanes" value={String(preflight.lanes.length)} tone="neutral" />
        <PreflightMetric label="Blocked lanes" value={String(blockedLaneCount)} tone="warning" />
        <PreflightMetric label="Activation fields" value={String(preflight.minimumActivationFields.length)} tone="neutral" />
        <PreflightMetric label="Blocked actions" value={String(preflight.blockedActions.length)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Source safe fallback plan</p>
            <p className="mt-2 break-words font-mono text-xs font-semibold text-[var(--tenant-text)]">{preflight.sourcePlanId}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              This preflight cannot activate fallback copy, mutate QR routes, notify live users, shut down classrooms,
              deactivate local bundles, replace media, reassign students, or export reports.
            </p>
          </div>
          <StatusPill label="No fallback activation" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {preflight.lanes.map((lane) => (
          <PreflightLaneCard key={lane.laneId} lane={lane} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <PreflightList title="Minimum activation fields" items={preflight.minimumActivationFields} badge={String(preflight.minimumActivationFields.length)} />
        <PreflightList title="Blocked actions" items={preflight.blockedActions} badge="Blocked" />
        <PreflightList title="Preflight rules" items={preflight.rules} badge="Rules" />
      </div>
    </Card>
  );
}

function PreflightLaneCard({ lane }: { lane: SafeFallbackPreflightLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.owner}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h3>
        </div>
        <StatusPill label={statusLabel[lane.status]} tone={statusTone[lane.status]} />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <PreflightMiniList title="Required before use" items={lane.requiredBeforeUse} tone="neutral" />
        <PreflightMiniList title="Blocked until resolved" items={lane.blockedUntilResolved} tone="warning" />
      </div>
    </article>
  );
}

function PreflightMetric({
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

function PreflightMiniList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <PreflightBullets items={items} />
    </section>
  );
}

function PreflightList({ title, items, badge }: { title: string; items: string[]; badge: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={badge} tone="warning" />
      </div>
      <PreflightBullets items={items} />
    </section>
  );
}

function PreflightBullets({ items }: { items: string[] }) {
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
