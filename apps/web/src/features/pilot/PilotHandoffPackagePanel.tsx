import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PilotHandoffAsset,
  PilotHandoffDecision,
  PilotHandoffPackage,
  PilotHandoffStatus,
} from "@/data/samplePilotHandoffPackage";

interface PilotHandoffPackagePanelProps {
  handoffPackage: PilotHandoffPackage;
  validationErrors: string[];
}

const statusTone: Record<PilotHandoffStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-review": "warning",
  blocked: "neutral",
};

const statusLabel: Record<PilotHandoffStatus, string> = {
  ready: "Ready",
  "needs-review": "Review",
  blocked: "Blocked",
};

export function PilotHandoffPackagePanel({ handoffPackage, validationErrors }: PilotHandoffPackagePanelProps) {
  const readyAssets = handoffPackage.assets.filter((asset) => asset.status === "ready").length;
  const blockedDecisions = handoffPackage.decisions.filter((decision) => decision.status === "blocked").length;
  const routeCount = handoffPackage.routes.length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot handoff package</p>
          <h2 className="mt-1 text-lg font-bold">{handoffPackage.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{handoffPackage.summary}</p>
        </div>
        <StatusPill label={handoffPackage.recommendedPilotWindow} tone="success" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <HandoffMetric label="Deployment" value={handoffPackage.recommendedDeployment} tone="success" />
        <HandoffMetric label="Routes" value={String(routeCount)} tone="success" />
        <HandoffMetric label="Ready assets" value={`${readyAssets}/${handoffPackage.assets.length}`} tone={readyAssets === handoffPackage.assets.length ? "success" : "warning"} />
        <HandoffMetric label="Blocked decisions" value={String(blockedDecisions)} tone={blockedDecisions > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release-control evidence</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{handoffPackage.releaseControlEvidence.bindingId}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              Decision: {handoffPackage.releaseControlEvidence.decision}. Gate: {handoffPackage.releaseControlEvidence.releaseGateId}.
              The pilot handoff consumes this exact binding, but it cannot promote, launch, or activate anything.
            </p>
          </div>
          <StatusPill label="No side effect" tone="neutral" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {handoffPackage.releaseControlEvidence.releaseBlockingReasons.map((reason, index) => (
            <li key={`pilot-release-blocker-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{reason}</li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Approval ledger binding</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Human approvals carried into pilot handoff</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The handoff carries a scoped approval summary without capturing signatures or promoting the package. Open and blocked sign-offs remain release blockers.
            </p>
          </div>
          <StatusPill label={handoffPackage.approvalEvidence.status === "ready" ? "Approvals complete" : handoffPackage.approvalEvidence.status === "blocked" ? "Approval blocked" : "Approval review"} tone={handoffPackage.approvalEvidence.status === "ready" ? "success" : "warning"} />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HandoffFact label="Ledger" value={handoffPackage.approvalEvidence.ledgerId} />
          <HandoffFact label="Package" value={handoffPackage.approvalEvidence.packageId} />
          <HandoffFact label="Signed" value={`${handoffPackage.approvalEvidence.signedRequiredSignoffs}/${handoffPackage.approvalEvidence.totalRequiredSignoffs}`} />
          <HandoffFact label="Promotion" value={handoffPackage.approvalEvidence.packagePromotionAllowed ? "Allowed" : "Blocked"} />
        </dl>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Activation preflight binding</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Durable-write decision carried into pilot handoff</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The handoff package carries the same tenant and package-scoped activation evidence as the persistence workbench. It cannot activate storage or approve a classroom pilot.
            </p>
          </div>
          <StatusPill label={handoffPackage.activationPreflightEvidence.status === "ready" ? "Evidence complete" : "Activation blocked"} tone={handoffPackage.activationPreflightEvidence.status === "ready" ? "success" : "warning"} />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HandoffFact label="Tenant" value={handoffPackage.activationPreflightEvidence.tenantId} />
          <HandoffFact label="Package" value={handoffPackage.activationPreflightEvidence.packageId} />
          <HandoffFact label="Checks" value={`${handoffPackage.activationPreflightEvidence.passedChecks} passed / ${handoffPackage.activationPreflightEvidence.openChecks} open / ${handoffPackage.activationPreflightEvidence.blockedChecks} blocked`} />
          <HandoffFact label="Can activate" value={handoffPackage.activationPreflightEvidence.canActivate ? "Yes" : "No"} />
        </dl>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HandoffFact label="Deployment decision" value={handoffPackage.activationPreflightEvidence.deploymentDecisionId} />
          <HandoffFact label="Policy preflight" value={handoffPackage.activationPreflightEvidence.policyAcceptancePreflightId} />
          <HandoffFact label="Acceptance preview" value={handoffPackage.activationPreflightEvidence.acceptanceRecordPreviewId} />
          <HandoffFact label="Policy status" value={handoffPackage.activationPreflightEvidence.policyAcceptanceStatus} />
        </dl>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {handoffPackage.activationPreflightEvidence.blockedReasons.map((reason, index) => (
            <li key={`pilot-activation-preflight-blocker-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{reason}</li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Storage selection review</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Storage selection review carried into pilot handoff</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The pilot packet carries the exact provider-neutral storage review identities used by evidence and deployment continuity. No provider is selected, activated, or made student-facing by this handoff.
            </p>
          </div>
          <StatusPill label="Human policy review required" tone="warning" />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HandoffFact label="Preflight" value={handoffPackage.storageSelectionPreflightId} />
          <HandoffFact label="Selection gate" value={handoffPackage.storageSelectionGateId} />
          <HandoffFact label="Status" value={handoffPackage.storageSelectionStatus} />
          <HandoffFact label="Selection" value={handoffPackage.storageSelectionAllowed ? "Allowed" : "Blocked"} />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill label="No storage provider selected" tone="warning" />
          <StatusPill label="Hosted comparison retained" tone="neutral" />
          <StatusPill label="Local comparison retained" tone="neutral" />
          <StatusPill label="Hybrid comparison retained" tone="neutral" />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Persistence gate evidence</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Authoritative hosted readiness</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This safe summary is bound to the same tenant, package, and launch as the report evidence. It explains why hosted persistence is not yet pilot-ready without exposing configuration or learner data.
            </p>
          </div>
          <StatusPill label={handoffPackage.persistenceGateEvidence.status === "ready" ? "Gate ready" : handoffPackage.persistenceGateEvidence.status === "rehearsal" ? "Rehearsal" : "Blocked"} tone={handoffPackage.persistenceGateEvidence.status === "ready" ? "success" : "warning"} />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HandoffFact label="Mode" value={handoffPackage.persistenceGateEvidence.mode} />
          <HandoffFact label="Tenant" value={handoffPackage.persistenceGateEvidence.tenantId} />
          <HandoffFact label="Launch" value={handoffPackage.persistenceGateEvidence.launchCode} />
          <HandoffFact label="Writes" value={handoffPackage.persistenceGateEvidence.writesAllowed ? "Allowed" : "Blocked"} />
        </dl>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {handoffPackage.persistenceGateEvidence.blockedReasons.map((reason, index) => (
            <li key={`pilot-persistence-gate-blocker-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{reason}</li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Report evidence handoff</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Hosted/local snapshot parity</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The pilot packet carries only sanitized snapshot metadata and recovery validation. It proves evidence alignment without storing raw events, exporting reports, or activating a provider.
            </p>
          </div>
          <StatusPill label={handoffPackage.reportSnapshotEvidence.recoveryPacketsValid ? "Packets valid" : "Review needed"} tone={handoffPackage.reportSnapshotEvidence.recoveryPacketsValid ? "success" : "warning"} />
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HandoffFact label="Tenant" value={handoffPackage.reportSnapshotEvidence.tenantId} />
          <HandoffFact label="Launch" value={handoffPackage.reportSnapshotEvidence.launchCode} />
          <HandoffFact label="Modes" value={handoffPackage.reportSnapshotEvidence.deploymentModes.join(", ")} />
          <HandoffFact label="Fingerprint" value={handoffPackage.reportSnapshotEvidence.snapshotFingerprint} />
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill label="Export blocked" tone="warning" />
          <StatusPill label="No packet export" tone="warning" />
          <StatusPill label="Writes blocked" tone="warning" />
          <StatusPill label="Raw learner media excluded" tone="success" />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Shared handoff contract</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Review-only package validation</h3>
          </div>
          <StatusPill label={validationErrors.length === 0 ? "Contract valid" : `${validationErrors.length} finding(s)`} tone={validationErrors.length === 0 ? "success" : "warning"} />
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          This validator proves the handoff has the required tenant routes, human decisions, and safety blockers; it does not authorize classroom launch, storage, export, or live learner data.
        </p>
        {validationErrors.length > 0 ? (
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {validationErrors.map((error, index) => (
              <li key={`pilot-handoff-validation-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">{error}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Routes to show</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Partner-facing path map</h3>
            </div>
            <StatusPill label={`${routeCount} routes`} tone="success" />
          </div>
          <div className="mt-3 grid gap-2">
            {handoffPackage.routes.map((route) => (
              <div key={route.routeId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[var(--tenant-text)]">{route.label}</p>
                    <p className="mt-1 break-words text-xs font-semibold text-[var(--tenant-muted)]">{route.path}</p>
                  </div>
                  <StatusPill label={statusLabel[route.status]} tone={statusTone[route.status]} />
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{route.purpose}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Assets and work packages</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What exists versus what the partner must provide</h3>
            </div>
            <StatusPill label="Review first" tone="warning" />
          </div>
          <div className="mt-3 grid gap-2">
            {handoffPackage.assets.map((asset) => (
              <HandoffAssetRow key={asset.assetId} asset={asset} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Human decisions before pilot</p>
          <div className="mt-3 grid gap-2">
            {handoffPackage.decisions.map((decision) => (
              <HandoffDecisionRow key={decision.decisionId} decision={decision} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Handoff notes</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What to say and not overpromise</h3>
            </div>
            <StatusPill label="Partner-safe" tone="success" />
          </div>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {handoffPackage.handoffNotes.map((note) => (
              <li key={note} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                {note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}

function HandoffMetric({
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

function HandoffFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function HandoffAssetRow({ asset }: { asset: PilotHandoffAsset }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--tenant-text)]">{asset.label}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">Owner: {asset.owner}</p>
        </div>
        <StatusPill label={statusLabel[asset.status]} tone={statusTone[asset.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{asset.evidence}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]"><span className="font-semibold text-[var(--tenant-text)]">Next:</span> {asset.nextStep}</p>
    </article>
  );
}

function HandoffDecisionRow({ decision }: { decision: PilotHandoffDecision }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--tenant-text)]">{decision.label}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--tenant-muted)]">Owner: {decision.owner} / Cost: {decision.costImpact}</p>
        </div>
        <StatusPill label={statusLabel[decision.status]} tone={statusTone[decision.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{decision.note}</p>
    </article>
  );
}
