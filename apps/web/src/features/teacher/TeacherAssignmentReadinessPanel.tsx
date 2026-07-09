import { Card, StatusPill } from "@living-textbook/ui";
import type {
  TeacherAssignmentControlStatus,
  TeacherAssignmentPlan,
  TeacherAssignmentReadiness,
} from "@living-textbook/content-model/src/teacherAssignment";
import { formatMode } from "@/lib/formatLabels";

interface TeacherAssignmentReadinessPanelProps {
  plans: TeacherAssignmentPlan[];
  errors: string[];
  warnings: string[];
}

const readinessTone: Record<TeacherAssignmentReadiness, "neutral" | "success" | "warning"> = {
  "demo-ready": "success",
  "requires-persistence": "warning",
  "requires-policy": "warning",
  "ready-for-pilot": "success",
};

const controlTone: Record<TeacherAssignmentControlStatus, "neutral" | "success" | "warning"> = {
  enabled: "success",
  disabled: "neutral",
  "teacher-optional": "neutral",
  "policy-blocked": "warning",
  "premium-disabled": "neutral",
};

export function TeacherAssignmentReadinessPanel({ plans, errors, warnings }: TeacherAssignmentReadinessPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher assignment readiness</p>
          <h2 className="mt-1 text-lg font-bold">From package review to class launch</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Assignment plans connect reviewed unit packages to teacher QR launches, front-door entry codes, optional microphone practice, report export, local fallback, and premium feature controls.
          </p>
        </div>
        <StatusPill label={errors.length > 0 ? "Assignment review" : `${plans.length} assignment plans`} tone={errors.length > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <AssignmentNotice title="Validation" items={errors} emptyLabel="Assignment contracts are structurally valid." />
        <AssignmentNotice title="Open warnings" items={warnings} emptyLabel="No assignment warnings are open." />
      </div>

      <div className="mt-5 grid gap-4">
        {plans.map((plan) => (
          <article key={plan.assignmentId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{plan.tenantId} / {plan.audience}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{plan.label}</h3>
                <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">
                  {plan.packageId} / {plan.access.routePath}
                </p>
              </div>
              <StatusPill label={plan.readiness} tone={readinessTone[plan.readiness]} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <AssignmentMetric label="Launch code" value={plan.launchCode} />
              <AssignmentMetric label="Access mode" value={plan.access.accessMode} />
              <AssignmentMetric label="Target modes" value={String(plan.targetGameModes.length)} />
              <AssignmentMetric label="Stable QR" value={plan.access.stableQrReady ? "Ready" : "Not ready"} />
              <AssignmentMetric label="Entry code" value={plan.access.entryCodeRequired ? "Required" : "No"} />
              <AssignmentMetric label="User code" value={plan.access.userCodeRequired ? "Required" : "No"} />
              <AssignmentMetric label="Anonymous" value={plan.access.anonymousPracticeAllowed ? "Allowed" : "No"} />
              <AssignmentMetric label="Local fallback" value={plan.access.localFallbackReady ? "Ready" : "Not ready"} />
            </dl>

            <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">{plan.note}</p>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[var(--tenant-text)]">Assigned game path</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
                    These are the reviewed modes this assignment can expose after the target-language entry gate.
                  </p>
                </div>
                <StatusPill label={`${plan.targetGameModes.length} modes`} tone="neutral" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {plan.targetGameModes.map((mode) => (
                  <span
                    key={mode}
                    className="rounded-full border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-1 text-xs font-semibold text-[var(--tenant-text)]"
                  >
                    {formatMode(mode)}
                  </span>
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {plan.controls.map((control) => (
                <section key={control.controlId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[var(--tenant-text)]">{control.label}</h4>
                    <StatusPill label={control.status} tone={controlTone[control.status]} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{control.note}</p>
                  <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-3">
                    <AssignmentFlag label="Teacher" value={control.requiresTeacherApproval ? "Approval" : "No approval"} />
                    <AssignmentFlag label="Policy" value={control.requiresSchoolPolicy ? "Required" : "No"} />
                    <AssignmentFlag label="Cost" value={control.costBearing ? "Premium" : "Core"} />
                  </dl>
                </section>
              ))}
            </div>

            {plan.requiredBeforePilot.length > 0 ? (
              <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                <p className="text-sm font-bold text-[var(--tenant-text)]">Required before pilot</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                  {plan.requiredBeforePilot.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </Card>
  );
}

function AssignmentNotice({ title, items, emptyLabel }: { title: string; items: string[]; emptyLabel: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-[var(--tenant-text)]">{title}</p>
        <StatusPill label={items.length > 0 ? `${items.length} open` : "Clear"} tone={items.length > 0 ? "warning" : "success"} />
      </div>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{emptyLabel}</p>
      )}
    </section>
  );
}

function AssignmentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function AssignmentFlag({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
