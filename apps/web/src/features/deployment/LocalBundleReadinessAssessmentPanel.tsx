import type { LocalBundleReadinessAssessment } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundleReadinessAssessmentPanelProps {
  assessment: LocalBundleReadinessAssessment;
}

const decisionTone = {
  blocked: "warning",
  "review-ready": "neutral",
  "offline-ready-candidate": "success",
} as const;

export function LocalBundleReadinessAssessmentPanel({ assessment }: LocalBundleReadinessAssessmentPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Composite local package assessment</p>
          <h3 className="mt-1 text-lg font-bold">One admission decision for the closed companion path</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This reconciles the manifest, tenant scope, QR resolver, asset evidence, persistence admission, deployment checks, and release checks. It is still review-only: passing evidence does not export, activate, or promote a package.
          </p>
        </div>
        <StatusPill label={assessment.decision} tone={decisionTone[assessment.decision]} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AssessmentFact label="Assessment" value={assessment.assessmentId} />
        <AssessmentFact label="Tenant" value={assessment.tenantId} />
        <AssessmentFact label="Routes" value={assessment.routeResolutionReady ? "Resolved" : "Blocked"} />
        <AssessmentFact label="Assets" value={assessment.assetEvidenceReady ? "Evidence ready" : "Blocked"} />
      </dl>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {assessment.checks.map((check) => (
          <section key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">{check.checkId}</h4>
              <StatusPill label={check.status} tone={check.status === "pass" ? "success" : check.status === "warning" ? "neutral" : "warning"} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.detail}</p>
          </section>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <AssessmentFact label="Export" value={assessment.exportAllowed ? "Allowed" : "Blocked"} />
        <AssessmentFact label="Offline activation" value={assessment.offlineActivationAllowed ? "Allowed" : "Blocked"} />
        <AssessmentFact label="Student-facing" value={assessment.studentFacingAllowed ? "Allowed" : "Blocked"} />
      </div>

      {assessment.blockers.length > 0 ? (
        <Findings title="Blocking findings" items={assessment.blockers} />
      ) : (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          No composite blockers remain in the reviewed sample. Export, activation, and student promotion are still intentionally blocked by policy.
        </p>
      )}
      {assessment.warnings.length > 0 && <Findings title="Warnings" items={assessment.warnings} />}
    </Card>
  );
}

function AssessmentFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function Findings({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <p className="text-sm font-bold text-[var(--tenant-text)]">{title}</p>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)}
      </ul>
    </div>
  );
}
