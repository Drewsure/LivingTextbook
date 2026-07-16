import { Card, StatusPill } from "@living-textbook/ui";
import type {
  SchoolPolicyAcceptancePreflight,
  SchoolPolicyAcceptancePreflightLane,
  SchoolPolicyAcceptancePreflightStatus,
} from "@/data/sampleSchoolPolicyAcceptancePreflight";

interface SchoolPolicyAcceptancePreflightPanelProps {
  preflight: SchoolPolicyAcceptancePreflight;
}

const statusLabel: Record<SchoolPolicyAcceptancePreflightStatus, string> = {
  blocked: "Blocked",
  "needs-policy": "Needs policy",
  "ready-for-review": "Ready for review",
};

const statusTone: Record<SchoolPolicyAcceptancePreflightStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "needs-policy": "warning",
  "ready-for-review": "success",
};

export function SchoolPolicyAcceptancePreflightPanel({ preflight }: SchoolPolicyAcceptancePreflightPanelProps) {
  const blockedLaneCount = preflight.lanes.filter((lane) => lane.status === "blocked").length;
  const missingItemCount = preflight.lanes.reduce((count, lane) => count + lane.missingBeforeAcceptance.length, 0);
  const blockedActionCount = preflight.lanes.reduce((count, lane) => count + lane.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">School policy acceptance preflight</p>
          <h2 className="mt-1 text-lg font-bold">{preflight.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preflight.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={preflight.acceptanceStatus} tone="warning" />
          <StatusPill label="No accept button" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PreflightMetric label="Preflight lanes" value={String(preflight.lanes.length)} tone="neutral" />
        <PreflightMetric label="Blocked lanes" value={String(blockedLaneCount)} tone="warning" />
        <PreflightMetric label="Missing items" value={String(missingItemCount)} tone="warning" />
        <PreflightMetric label="Blocked actions" value={String(blockedActionCount)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{preflight.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              This is the hard gate before a future school acceptance workflow. It cannot accept policy, collect a
              signature, export evidence, activate storage, create launch-ready status, or invite students.
            </p>
          </div>
          <StatusPill label="Acceptance preflight only" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {preflight.lanes.map((lane) => (
          <SchoolPolicyAcceptanceLaneCard key={lane.laneId} lane={lane} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Minimum acceptance record</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Fields required before persistence</h3>
            </div>
            <StatusPill label={String(preflight.minimumAcceptanceRecord.length)} tone="warning" />
          </div>
          <PreflightList items={preflight.minimumAcceptanceRecord} />
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Operating rules</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Acceptance cannot bypass evidence</h3>
            </div>
            <StatusPill label="Hard gate" tone="warning" />
          </div>
          <PreflightList items={preflight.operatingRules} />
        </section>
      </div>
    </Card>
  );
}

function SchoolPolicyAcceptanceLaneCard({ lane }: { lane: SchoolPolicyAcceptancePreflightLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {lane.owner} / {lane.source}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h3>
        </div>
        <StatusPill label={statusLabel[lane.status]} tone={statusTone[lane.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{lane.purpose}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <PreflightMiniList title="Missing before acceptance" items={lane.missingBeforeAcceptance} tone="neutral" />
        <PreflightMiniList title="Blocked actions" items={lane.blockedActions} tone="warning" />
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
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Gate" : "Info"} tone={tone} />
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
      <PreflightList items={items} />
    </section>
  );
}

function PreflightList({ items }: { items: string[] }) {
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
