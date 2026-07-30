import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratorCostEntitlementGate,
  AiGeneratorCostGateStatus,
} from "@/data/sampleAiGeneratorCostEntitlementGate";

interface AiGeneratorCostEntitlementGatePanelProps {
  gates: AiGeneratorCostEntitlementGate[];
}

const statusTone: Record<AiGeneratorCostGateStatus, "neutral" | "warning"> = {
  "ready-preview": "neutral",
  "premium-disabled": "warning",
  blocked: "warning",
};

export function AiGeneratorCostEntitlementGatePanel({ gates }: AiGeneratorCostEntitlementGatePanelProps) {
  const blockedActionCount = gates.reduce((total, gate) => total + gate.blockedActions.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generator cost and entitlement gate</p>
          <h2 className="mt-1 text-lg font-bold">Premium package required</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Live AI generation, voice generation, speech scoring, and AI Tutor support stay disabled until tenant package
            approval, school policy, usage budgets, and rate-card review exist.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="No live model billing" tone="warning" />
          <StatusPill label={`${blockedActionCount} blocked action(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {gates.map((gate) => (
          <article key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="grid gap-3 lg:grid-cols-3">
              <CostMetric label="Package state" value={gate.packageState} tone="warning" />
              <CostMetric label="Estimate state" value={gate.estimateState} tone="warning" />
              <CostMetric label="Approval state" value={gate.approvalState} tone="warning" />
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.requestId}</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{gate.label}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{gate.summary}</p>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <CostList title="Required cost records" items={gate.requiredRecords} tone="warning" />
              <CostList title="Adoption requirements" items={gate.adoptionRequirements} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Entitlement checks</h4>
                <StatusPill label={String(gate.checks.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {gate.checks.map((check) => (
                  <article key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[var(--tenant-text)]">{check.label}</p>
                      <StatusPill label={check.status} tone={statusTone[check.status]} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{check.evidence}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.blocker}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <CostList
                title="Cost estimate preview"
                items={gate.estimateInputs.map((input) => `${input.label}: ${input.value}`)}
              />
              <CostList
                title="Hard cost ceilings"
                items={gate.costCeilings.map((ceiling) => `${ceiling.label}: ${ceiling.value}. ${ceiling.policy}`)}
                tone="warning"
              />
              <CostList title="Blocked cost actions" items={gate.blockedActions} tone="warning" />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-muted)] opacity-70"
              >
                Enable AI generation blocked
              </button>
              <button
                type="button"
                disabled
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-muted)] opacity-70"
              >
                Estimate API cost blocked
              </button>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function CostMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function CostList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
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
