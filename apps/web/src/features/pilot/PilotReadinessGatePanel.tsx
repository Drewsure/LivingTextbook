import { Card, StatusPill } from "@living-textbook/ui";
import type { PersistenceAdapterPlan } from "@living-textbook/content-model";
import type { PilotPolicyPlan } from "@living-textbook/content-model/src/pilotPolicy";
import type { PilotReadinessStatus, WhiteLabelPilotReadiness } from "@/data/whiteLabelPilotReadiness";

interface PilotReadinessGatePanelProps {
  readiness: WhiteLabelPilotReadiness;
  policyPlans: PilotPolicyPlan[];
  persistencePlans: PersistenceAdapterPlan[];
}

const statusTone: Record<PilotReadinessStatus, "success" | "warning" | "neutral"> = {
  ready: "success",
  "in-progress": "warning",
  blocked: "neutral",
};

const statusLabel: Record<PilotReadinessStatus, string> = {
  ready: "Ready",
  "in-progress": "In progress",
  blocked: "Needs decision",
};

export function PilotReadinessGatePanel({
  readiness,
  policyPlans,
  persistencePlans,
}: PilotReadinessGatePanelProps) {
  const counts = readiness.items.reduce(
    (result, item) => {
      result[item.status] += 1;
      return result;
    },
    { ready: 0, "in-progress": 0, blocked: 0 } satisfies Record<PilotReadinessStatus, number>,
  );

  const openPolicyRequirements = policyPlans.flatMap((plan) =>
    plan.requirements.filter((requirement) => requirement.requiredBeforePilot && requirement.status !== "accepted"),
  );
  const openAdapterWrites = persistencePlans.flatMap((plan) =>
    plan.writeIntents
      .filter((intent) => intent.requiredBeforePilot && intent.readiness !== "pilot-ready")
      .map((intent) => ({ ...intent, planLabel: plan.label })),
  );
  const recommendedAdapter = persistencePlans.find((plan) => plan.recommendedForFirstPilot);
  const hasHardBlockers = counts.blocked > 0 || openPolicyRequirements.length > 0 || openAdapterWrites.length > 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot readiness gate</p>
          <h2 className="mt-1 text-lg font-bold">Can this become a real partner pilot?</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This gate combines product readiness, policy readiness, and persistence readiness so a tenant pilot cannot be confused with a static demo.
          </p>
        </div>
        <StatusPill label={hasHardBlockers ? "Pilot blockers open" : "Pilot ready"} tone={hasHardBlockers ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <GateMetric label="Pilot promise" value={readiness.colleaguePilotWindow} tone="success" />
        <GateMetric label="Ready areas" value={String(counts.ready)} tone="success" />
        <GateMetric label="Open policy gates" value={String(openPolicyRequirements.length)} tone={openPolicyRequirements.length > 0 ? "warning" : "success"} />
        <GateMetric label="Open write gates" value={String(openAdapterWrites.length)} tone={openAdapterWrites.length > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Recommended first path</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">
                {recommendedAdapter?.label ?? "Choose first adapter"}
              </h3>
            </div>
            <StatusPill label="Controlled cost" tone="success" />
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
            Start with a hosted PWA pilot using reviewed content packages, stable entry codes, durable progress events, and report export policy. Keep local classroom packaging compatible, but do not make it the first cost burden unless the partner requires closed deployment immediately.
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            <li>Core pilot works without AI Tutor, raw audio storage, or transcript storage.</li>
            <li>Audio/video assets stay rights-managed and can later resolve from hosted or local bundles.</li>
            <li>Teacher reports become exportable only after persistence and policy gates are accepted.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Partner readiness snapshot</p>
          <div className="mt-3 grid gap-2">
            {readiness.items.map((item) => (
              <div key={item.id} className="grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm font-bold text-[var(--tenant-text)]">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{item.nextStep}</p>
                </div>
                <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <GateBlock
          title="Must close before live student data"
          emptyLabel="No open policy blockers"
          items={openPolicyRequirements.map((requirement) => `${requirement.label}: ${requirement.note}`)}
        />
        <GateBlock
          title="Must wire before durable pilot writes"
          emptyLabel="No open adapter blockers"
          items={openAdapterWrites.map((intent) => `${intent.planLabel}: ${intent.label} needs ${intent.readiness}`)}
        />
      </div>
    </Card>
  );
}

function GateMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function GateBlock({ title, emptyLabel, items }: { title: string; emptyLabel: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={items.length > 0 ? `${items.length} open` : "Clear"} tone={items.length > 0 ? "warning" : "success"} />
      </div>
      {items.length > 0 ? (
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{emptyLabel}</p>
      )}
    </section>
  );
}
