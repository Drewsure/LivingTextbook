import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotPolicyPlan,
  PilotPolicyReadiness,
  PilotPolicyRequirementStatus,
} from "@living-textbook/content-model/src/pilotPolicy";

interface PilotPolicyReadinessPanelProps {
  plans: PilotPolicyPlan[];
  errors: string[];
  warnings: string[];
}

const readinessTone: Record<PilotPolicyReadiness, "neutral" | "success" | "warning"> = {
  "demo-only": "neutral",
  "policy-required": "warning",
  "pilot-ready": "success",
};

const requirementTone: Record<PilotPolicyRequirementStatus, "neutral" | "success" | "warning"> = {
  accepted: "success",
  needed: "warning",
  "not-applicable": "neutral",
  "premium-only": "neutral",
};

export function PilotPolicyReadinessPanel({ plans, errors, warnings }: PilotPolicyReadinessPanelProps) {
  const policyMapValid = errors.length === 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot policy readiness</p>
          <h2 className="mt-1 text-lg font-bold">What blocks real classroom data</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This panel keeps policy separate from backend choice. Student progress storage, teacher report export, media rights, and local deployment must be accepted before real pilots use live data.
          </p>
        </div>
        <StatusPill label={policyMapValid ? "Policy map valid" : "Policy review"} tone={policyMapValid ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          <p className="font-semibold text-[var(--tenant-text)]">Policy safety</p>
          {policyMapValid ? (
            <p className="mt-2">Core policy does not accept raw learner audio or transcript storage by default.</p>
          ) : (
            <ul className="mt-2 grid gap-2">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          <p className="font-semibold text-[var(--tenant-text)]">Current blockers</p>
          <ul className="mt-2 grid gap-2">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <section key={plan.policyPlanId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.tenantId}</p>
                <h3 className="mt-1 text-base font-bold">{plan.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.note}</p>
              </div>
              <StatusPill label={plan.readiness} tone={readinessTone[plan.readiness]} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {plan.requirements.map((requirement) => (
                <article key={requirement.requirementId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-sm font-bold">{requirement.label}</h4>
                    <StatusPill label={requirement.status} tone={requirementTone[requirement.status]} />
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase text-[var(--tenant-muted)]">{requirement.category}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{requirement.note}</p>
                  <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)]">
                    <div>
                      <dt className="font-semibold text-[var(--tenant-text)]">Blocks</dt>
                      <dd className="mt-1">
                        {[
                          requirement.blocksStudentData ? "student data" : "",
                          requirement.blocksReportExport ? "report export" : "",
                          requirement.blocksLocalDeployment ? "local deployment" : "",
                        ].filter(Boolean).join(", ") || "No core blocker"}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Card>
  );
}
