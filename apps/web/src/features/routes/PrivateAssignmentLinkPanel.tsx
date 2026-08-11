import { Card, StatusPill } from "@living-textbook/ui";
import type { TeacherAssignmentControlStatus, TeacherAssignmentReadiness } from "@living-textbook/content-model/src/teacherAssignment";
import type { PrivateAssignmentLinkContext } from "@/data/samplePrivateAssignmentLinks";
import { formatMode } from "@/lib/formatLabels";

interface PrivateAssignmentLinkPanelProps {
  assignment: PrivateAssignmentLinkContext;
}

const readinessTone: Record<TeacherAssignmentReadiness, "neutral" | "success" | "warning"> = {
  "demo-ready": "success",
  "requires-policy": "warning",
  "requires-persistence": "warning",
  "ready-for-pilot": "success",
};

const controlTone: Record<TeacherAssignmentControlStatus, "neutral" | "success" | "warning"> = {
  enabled: "success",
  disabled: "neutral",
  "teacher-optional": "neutral",
  "policy-blocked": "warning",
  "premium-disabled": "warning",
};

export function PrivateAssignmentLinkPanel({ assignment }: PrivateAssignmentLinkPanelProps) {
  const audioCoveredModes = new Set(assignment.assignmentPlan.audioCoveredGameModes);

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Private assignment link</p>
            <h2 className="mt-1 text-2xl font-bold">{assignment.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Student-facing assignment preview. This is the safe sharing lane: focused access to one reviewed package, not public sharing, public community discovery, or an iframe embed.
            </p>
          </div>
          <StatusPill label={assignment.assignmentPlan.readiness} tone={readinessTone[assignment.assignmentPlan.readiness]} />
        </div>

        <div className="mt-5 grid gap-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold text-[var(--tenant-text)]">Open assignment</p>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{assignment.accessSummary}</p>
            <p className="mt-2 break-all font-mono text-xs font-semibold text-[var(--tenant-text)]">{assignment.studentTargetPath}</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <a
              href={assignment.studentTargetPath}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-[var(--tenant-primary-text)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              Start assignment
            </a>
            <a
              href={assignment.activityHubPath}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-bold text-[var(--tenant-text)] transition hover:bg-[var(--tenant-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              Open activity hub
            </a>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Assignment scope</p>
            <h3 className="mt-1 text-lg font-bold">Access, games, and reporting boundary</h3>
          </div>
          <StatusPill label={assignment.assignmentPlan.access.accessMode} tone="neutral" />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AssignmentMetric label="Tenant" value={assignment.tenant.displayName} />
          <AssignmentMetric label="Package" value={assignment.contentPackage.meta.packageId} />
          <AssignmentMetric label="Launch code" value={assignment.launchSession.launchCode} />
          <AssignmentMetric label="Teacher report" value={assignment.teacherReportPath} />
          <AssignmentMetric label="Entry code" value={assignment.assignmentPlan.access.entryCodeRequired ? "Required" : "Not required"} />
          <AssignmentMetric label="Learner code" value={assignment.assignmentPlan.access.userCodeRequired ? "Required" : "Optional"} />
          <AssignmentMetric label="Stable QR" value={assignment.assignmentPlan.access.stableQrReady ? "Ready" : "Review"} />
          <AssignmentMetric label="Local fallback" value={assignment.assignmentPlan.access.localFallbackReady ? "Ready" : "Review"} />
        </dl>

        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-sm font-bold text-[var(--tenant-text)]">Curated activity pathway</p>
          <p className="mt-2 break-all text-xs font-semibold text-[var(--tenant-muted)]">{assignment.activityHubPath}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {assignment.assignmentPlan.targetGameModes.map((mode) => (
              <span
                key={mode}
                className="rounded-full border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-1 text-xs font-semibold text-[var(--tenant-text)]"
              >
                {formatMode(mode)} {audioCoveredModes.has(mode) ? "(audio)" : "(audio review)"}
              </span>
            ))}
          </div>
        </section>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Safety boundaries</p>
            <h3 className="mt-1 text-lg font-bold">Private-first sharing rules</h3>
          </div>
          <StatusPill label="Not public" tone="warning" />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-[var(--tenant-border)] p-4">
            <p className="text-sm font-bold text-[var(--tenant-text)]">Boundaries</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {assignment.safetyBoundaries.map((boundary) => (
                <li key={boundary}>{boundary}</li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg bg-[var(--tenant-primary-soft)] p-3 text-sm font-semibold leading-6 text-[var(--tenant-text)]">
              Teacher reports remain policy-blocked until persistence and retention rules are accepted.
            </p>
          </section>

          <section className="rounded-lg border border-[var(--tenant-border)] p-4">
            <p className="text-sm font-bold text-[var(--tenant-text)]">Teacher controls</p>
            <div className="mt-3 grid gap-3">
              {assignment.assignmentPlan.controls.map((control) => (
                <div key={control.controlId} className="rounded-lg bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-bold text-[var(--tenant-text)]">{control.label}</p>
                    <StatusPill label={control.status} tone={controlTone[control.status]} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{control.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
}

function AssignmentMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
