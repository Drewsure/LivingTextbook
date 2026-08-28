import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AssignmentRolloutGateStatus,
  AssignmentRolloutPlan,
  AssignmentRolloutStatus,
} from "@/data/sampleAssignmentRolloutPlan";
import {
  countAssignmentRolloutEvidencePackets,
  countAssignmentRolloutGates,
} from "@/data/sampleAssignmentRolloutPlan";

interface TeacherAssignmentRolloutPanelProps {
  plans: AssignmentRolloutPlan[];
}

const rolloutTone: Record<AssignmentRolloutStatus, "neutral" | "success" | "warning"> = {
  "demo-preview": "neutral",
  blocked: "warning",
  "ready-to-schedule": "success",
  "pilot-ready": "success",
};

const gateTone: Record<AssignmentRolloutGateStatus, "neutral" | "success" | "warning"> = {
  pass: "success",
  warning: "warning",
  blocked: "warning",
};

export function TeacherAssignmentRolloutPanel({ plans }: TeacherAssignmentRolloutPanelProps) {
  const blockedPlans = plans.filter((plan) => plan.status === "blocked").length;
  const demoPlans = plans.filter((plan) => plan.status === "demo-preview").length;
  const generatedEvidencePackets = countAssignmentRolloutEvidencePackets(plans);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Assignment rollout</p>
          <h2 className="mt-1 text-lg font-bold">From reviewed assignment to scheduled pilot</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Rollout gates separate safe demos from real classroom pilots. A package can exist, and an assignment can be drafted, while scheduling remains blocked by media rights, persistence, QR permanence, or report policy.
          </p>
        </div>
        <StatusPill label={`${blockedPlans} blocked`} tone={blockedPlans > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <RolloutMetric label="Rollouts" value={String(plans.length)} tone="neutral" />
        <RolloutMetric label="Demo preview" value={String(demoPlans)} tone="neutral" />
        <RolloutMetric label="Blocked" value={String(blockedPlans)} tone={blockedPlans > 0 ? "warning" : "success"} />
        <RolloutMetric label="Generated evidence" value={`${generatedEvidencePackets} packets`} tone="warning" />
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <article key={plan.rolloutId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.tenantId} / {plan.launchCode}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.targetAudience}</p>
              </div>
              <StatusPill label={plan.status} tone={rolloutTone[plan.status]} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <RolloutMetric label="Passing gates" value={String(countAssignmentRolloutGates(plan, "pass"))} tone="success" />
              <RolloutMetric label="Warnings" value={String(countAssignmentRolloutGates(plan, "warning"))} tone="warning" />
              <RolloutMetric label="Blocked" value={String(countAssignmentRolloutGates(plan, "blocked"))} tone={countAssignmentRolloutGates(plan, "blocked") > 0 ? "warning" : "success"} />
            </div>

            <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-text)]">
              {plan.schedulingNote}
            </p>

            <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Generated package handoff evidence</h4>
                <StatusPill label={`${plan.sourceEvidencePacketIds.length} packet(s)`} tone="warning" />
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{plan.generatedPackagePolicyNote}</p>
              <ul className="mt-2 grid gap-2 text-xs font-semibold text-[var(--tenant-muted)]">
                {plan.sourceEvidencePacketIds.map((packetId, index) => (
                  <li key={`${plan.rolloutId}-generated-evidence-${index}-${packetId}`}>{packetId}</li>
                ))}
              </ul>
            </section>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {plan.gates.map((gate) => (
                <section key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.owner}</p>
                      <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h4>
                    </div>
                    <StatusPill label={gate.status} tone={gateTone[gate.status]} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{gate.note}</p>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function RolloutMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
