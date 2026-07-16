import { Card, StatusPill } from "@living-textbook/ui";
import type {
  SchoolLaunchPolicyGate,
  SchoolLaunchPolicyGateLane,
  SchoolLaunchPolicyGateStatus,
} from "@/data/sampleSchoolLaunchPolicyGate";

interface SchoolLaunchPolicyGatePanelProps {
  gate: SchoolLaunchPolicyGate;
}

const statusLabel: Record<SchoolLaunchPolicyGateStatus, string> = {
  "ready-for-review": "Ready for review",
  "policy-needed": "Policy needed",
  blocked: "Blocked",
};

const statusTone: Record<SchoolLaunchPolicyGateStatus, "neutral" | "success" | "warning"> = {
  "ready-for-review": "success",
  "policy-needed": "warning",
  blocked: "warning",
};

export function SchoolLaunchPolicyGatePanel({ gate }: SchoolLaunchPolicyGatePanelProps) {
  const readyCount = gate.lanes.filter((lane) => lane.status === "ready-for-review").length;
  const policyNeededCount = gate.lanes.filter((lane) => lane.status === "policy-needed").length;
  const blockedCount = gate.lanes.filter((lane) => lane.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">School launch policy gate</p>
          <h2 className="mt-1 text-lg font-bold">{gate.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={gate.launchDecisionStatus} tone="warning" />
          <StatusPill label="Review packet only" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PolicyGateMetric label="Release candidate" value={gate.releaseCandidate} tone="neutral" />
        <PolicyGateMetric label="Ready lanes" value={String(readyCount)} tone={readyCount > 0 ? "success" : "neutral"} />
        <PolicyGateMetric label="Policy needed" value={String(policyNeededCount)} tone={policyNeededCount > 0 ? "warning" : "success"} />
        <PolicyGateMetric label="Blocked lanes" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.sourceOfTruth}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">
              No school policy acceptance, no live student session, no real learner data, no report export, no local
              deployment activation, and no launch-ready status can be created from this preview.
            </p>
          </div>
          <StatusPill label="No approval workflow" tone="warning" />
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {gate.lanes.map((lane) => (
          <SchoolLaunchPolicyLaneCard key={lane.laneId} lane={lane} />
        ))}
      </div>

      <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Operating rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Ownership before a real classroom launch</h3>
          </div>
          <StatusPill label="Launch still blocked" tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)] md:grid-cols-2">
          {gate.operatingRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function SchoolLaunchPolicyLaneCard({ lane }: { lane: SchoolLaunchPolicyGateLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {lane.owner} / {lane.evidenceSource}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{lane.label}</h3>
        </div>
        <StatusPill label={statusLabel[lane.status]} tone={statusTone[lane.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{lane.currentEvidence}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <PolicyGateMiniList title="Required before live launch" items={lane.requiredBeforeLiveLaunch} tone="neutral" />
        <PolicyGateMiniList title="Blocked actions" items={lane.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function PolicyGateMetric({
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
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function PolicyGateMiniList({
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
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
