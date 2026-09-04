import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PartnerPilotRequirement,
  PartnerPilotRequirementStatus,
  PartnerPilotRequirementsIntake,
} from "@/data/samplePartnerPilotRequirementsIntake";
import { countPartnerPilotRequirements } from "@/data/samplePartnerPilotRequirementsIntake";

interface PartnerPilotRequirementsIntakePanelProps {
  intake: PartnerPilotRequirementsIntake;
}

const statusTone: Record<PartnerPilotRequirementStatus, "neutral" | "success" | "warning"> = {
  blocked: "warning",
  "demo-supplied": "success",
  needed: "warning",
  "needs-decision": "neutral",
  "policy-required": "warning",
  "premium-optional": "neutral",
};

const statusLabel: Record<PartnerPilotRequirementStatus, string> = {
  blocked: "Blocked",
  "demo-supplied": "Demo supplied",
  needed: "Needed",
  "needs-decision": "Needs decision",
  "policy-required": "Policy required",
  "premium-optional": "Premium optional",
};

export function PartnerPilotRequirementsIntakePanel({ intake }: PartnerPilotRequirementsIntakePanelProps) {
  const suppliedCount = countPartnerPilotRequirements(intake, "demo-supplied");
  const neededCount =
    countPartnerPilotRequirements(intake, "needed") +
    countPartnerPilotRequirements(intake, "policy-required") +
    countPartnerPilotRequirements(intake, "needs-decision");
  const optionalOrBlockedCount =
    countPartnerPilotRequirements(intake, "premium-optional") + countPartnerPilotRequirements(intake, "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Partner pilot requirements intake</p>
          <h2 className="mt-1 text-lg font-bold">{intake.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{intake.summary}</p>
        </div>
        <StatusPill label={intake.statusStatement} tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Pilot position</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{intake.pilotPosition}</p>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Recommended first path</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{intake.recommendedFirstPilotPath}</p>
        </section>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <RequirementMetric label="Demo supplied" value={String(suppliedCount)} tone="success" />
        <RequirementMetric label="Needed or undecided" value={String(neededCount)} tone="warning" />
        <RequirementMetric label="Optional or blocked" value={String(optionalOrBlockedCount)} tone="neutral" />
      </dl>

      <div className="mt-5 grid gap-4">
        {intake.requirements.map((requirement) => (
          <RequirementCard key={requirement.requirementId} requirement={requirement} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">No live capture</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{intake.noLiveCaptureStatement}</p>
          </div>
          <StatusPill label="Review-only" tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-5 text-[var(--tenant-muted)] sm:grid-cols-2 lg:grid-cols-3">
          {intake.blockedActions.map((action, index) => (
            <li
              key={`${intake.intakeId}-blocked-action-${index}`}
              className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"
            >
              {action}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function RequirementMetric({
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
        <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
        <StatusPill label={tone === "success" ? "Show" : tone === "warning" ? "Ask" : "Hold"} tone={tone} />
      </div>
      <dd className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </section>
  );
}

function RequirementCard({ requirement }: { requirement: PartnerPilotRequirement }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {requirement.category} / Owner: {requirement.owner}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{requirement.label}</h3>
        </div>
        <StatusPill label={statusLabel[requirement.status]} tone={statusTone[requirement.status]} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <RequirementText title="Evidence needed" value={requirement.evidenceNeeded} />
        <RequirementText title="Current foundation evidence" value={requirement.currentFoundationEvidence} />
        <RequirementText title="Next action" value={requirement.nextAction} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          Required before classroom pilot: {requirement.requiredBeforeClassroomPilot ? "Yes" : "Not for core pilot"}
        </p>
        <a
          href={requirement.sourceRoute}
          className="break-words text-sm font-bold text-[var(--tenant-text)] underline decoration-[var(--tenant-border)] underline-offset-4"
        >
          {requirement.sourceRoute}
        </a>
      </div>
    </article>
  );
}

function RequirementText({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
