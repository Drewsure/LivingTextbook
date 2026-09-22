import { Card, StatusPill } from "@living-textbook/ui";
import type { WhiteLabelReleaseQualityCheckId, WhiteLabelReleaseReadiness } from "@living-textbook/content-model";

export type WhiteLabelReleaseReviewLink = {
  href: string;
  label: string;
  detail: string;
};

export function WhiteLabelReleaseReadinessPanel({
  readiness,
  errors,
  reviewLinks,
}: {
  readiness: WhiteLabelReleaseReadiness;
  errors: string[];
  reviewLinks: WhiteLabelReleaseReviewLink[];
}) {
  const qualityChecks = Object.entries(readiness.qualityChecks) as Array<[WhiteLabelReleaseQualityCheckId, boolean]>;
  const qualityEvidence = new Map(readiness.qualityEvidence.map((evidence) => [evidence.checkId, evidence]));
  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">White-label release control</p>
            <h2 className="mt-1 text-2xl font-bold">One readiness view for every publisher tenant</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
              This dashboard reconciles the governed build phases and verification signals without creating a release action.
              A tenant can be demo-ready while production approval and student launch remain blocked.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label={readiness.status} tone="warning" />
            <StatusPill label="Production approval blocked" tone="warning" />
            <StatusPill label="Student launch blocked" tone="warning" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Tenant" value={readiness.tenantId} />
          <Fact label="Package" value={readiness.packageId} />
          <Fact label="Phases" value={String(readiness.phases.length)} />
          <Fact label="Next owner action" value={readiness.nextAction} />
        </div>
      </Card>

      <Card>
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence workbench map</p>
          <h2 className="mt-1 text-lg font-bold">Follow the next governed review surface</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            These links move the adult operator to the evidence owner for the next decision. They are review routes only and do not activate storage, import external games, publish packages, or launch students.
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {reviewLinks.map((link) => <ReviewLink key={link.href} {...link} />)}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Controlled pilot decision</p>
            <h2 className="mt-1 text-lg font-bold">Pilot evidence is bound to the same tenant package</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
              The pilot decision, handoff routes, blocker count, and permissions are read from the governed review contract. This view cannot turn a demo into a live pilot.
            </p>
          </div>
          <StatusPill label={readiness.pilotEvidence.status} tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Decision" value={readiness.pilotEvidence.decisionId} />
          <Fact label="Blockers" value={String(readiness.pilotEvidence.blockingReasonCount)} />
          <Fact label="Pilot launch" value={readiness.pilotEvidence.pilotLaunchAllowed ? "Allowed" : "Blocked"} />
          <Fact label="Learner data" value={readiness.pilotEvidence.studentDataCollectionAllowed ? "Allowed" : "Blocked"} />
        </div>
        <List title="Pilot blockers" values={readiness.pilotEvidence.blockingReasons} />
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package evidence reconciliation</p>
            <h2 className="mt-1 text-lg font-bold">Lane-level evidence controls this release view</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
              The selected tenant package is bound to its source checksum and package-readiness reconciliation. Summary phases cannot override unresolved lanes.
            </p>
          </div>
          <StatusPill label={`${readiness.packageEvidence.unresolvedLaneCount} unresolved lanes`} tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Reconciliation" value={readiness.packageEvidence.reconciliationId} />
          <Fact label="Lane coverage" value={`${readiness.packageEvidence.readyPreviewLaneCount}/${readiness.packageEvidence.totalLaneCount} ready-preview`} />
          <Fact label="Promotion" value={readiness.packageEvidence.promotionAllowed ? "Allowed" : "Blocked"} />
          <Fact label="Student activation" value={readiness.packageEvidence.studentFacingActivationAllowed ? "Allowed" : "Blocked"} />
        </div>
        <List title="Unresolved package lanes" values={readiness.packageEvidence.unresolvedLaneIds} />
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Release-control evidence</p>
            <h2 className="mt-1 text-lg font-bold">Publish gates and approvals are joined before promotion</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
              This record binds the package publish gate and approval ledger to the same release candidate. Counts are evidence only and cannot activate promotion or student access.
            </p>
          </div>
          <StatusPill label={readiness.releaseControlEvidence.status} tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Fact label="Release gate" value={readiness.releaseControlEvidence.releaseGateId} />
          <Fact label="Open gates" value={String(readiness.releaseControlEvidence.blockingGateCount)} />
          <Fact label="Approvals" value={`${readiness.releaseControlEvidence.requiredApprovalCount - readiness.releaseControlEvidence.openApprovalCount}/${readiness.releaseControlEvidence.requiredApprovalCount} signed`} />
          <Fact label="Promotion" value={readiness.releaseControlEvidence.promotionAllowed ? "Allowed" : "Blocked"} />
          <Fact label="Student activation" value={readiness.releaseControlEvidence.studentFacingActivationAllowed ? "Allowed" : "Blocked"} />
        </div>
        <List title="Control source records" values={readiness.releaseControlEvidence.sourceRecords} />
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Route and deployment evidence</p>
            <h2 className="mt-1 text-lg font-bold">Active routes reconcile before deployment decisions</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
              Route health is joined to the authoritative matrix, active-route verifier, and deployment guide. It remains review evidence and never grants launch, storage, offline, or package-promotion permission.
            </p>
          </div>
          <StatusPill label={readiness.routeEvidence.deploymentStatus} tone="warning" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Fact label="Tenant scope" value={readiness.routeEvidence.tenantId} />
          <Fact label="Package scope" value={readiness.routeEvidence.packageId} />
          <Fact label="Active routes" value={String(readiness.routeEvidence.activeRouteCount)} />
          <Fact label="Expected routes" value={String(readiness.routeEvidence.expectedActiveRouteCount)} />
          <Fact label="Route matrix" value={readiness.routeEvidence.routeMatrixSource} />
          <Fact label="Deployment guide" value={readiness.routeEvidence.deploymentGuideId} />
        </div>
        <List title="Route and deployment sources" values={readiness.routeEvidence.sourceRecords} />
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Required quality signals</p>
            <h2 className="mt-1 text-lg font-bold">Evidence checks are separate from approval</h2>
          </div>
          <StatusPill label={`${qualityChecks.filter(([, value]) => value).length}/${qualityChecks.length} verified`} tone="success" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {qualityChecks.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
              <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value ? "Verified" : "Missing"}</p>
              <p className="mt-2 break-words text-xs text-[var(--tenant-muted)]">Evidence: {qualityEvidence.get(label)?.sourceRecord ?? "No source record"}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Governed build phases</p>
          <h2 className="mt-1 text-lg font-bold">Phase blockers remain visible to the adult operator</h2>
        </div>
        <div className="mt-5 grid gap-3">
          {readiness.phases.map((phase) => (
            <article key={phase.phaseId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{phase.phaseId}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{phase.label}</h3>
                </div>
                <StatusPill label={phase.status} tone={phase.status === "ready" ? "success" : "warning"} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">Next action: {phase.nextAction}</p>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <List title="Evidence" values={phase.evidenceRecords} />
                <List title="Blockers" values={phase.blockers.length > 0 ? phase.blockers : ["No phase blocker recorded."]} />
              </div>
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Release boundary</p>
            <h2 className="mt-1 text-lg font-bold">No release button exists in this foundation surface</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">{readiness.note}</p>
          </div>
          <StatusPill label="Review-only" tone="warning" />
        </div>
        <List title="Blocked actions" values={readiness.blockedActions} />
        {errors.length > 0 && <List title="Readiness contract errors" values={errors} />}
      </Card>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p></div>;
}

function ReviewLink({ href, label, detail }: { href: string; label: string; detail: string }) {
  return (
    <a href={href} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 transition-colors hover:border-[var(--tenant-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]">
      <span className="block text-sm font-bold text-[var(--tenant-text)]">{label}</span>
      <span className="mt-2 block text-xs leading-5 text-[var(--tenant-muted)]">{detail}</span>
      <span className="mt-3 block text-xs font-semibold text-[var(--tenant-primary)]">Open review surface</span>
    </a>
  );
}

function List({ title, values }: { title: string; values: string[] }) {
  return <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
