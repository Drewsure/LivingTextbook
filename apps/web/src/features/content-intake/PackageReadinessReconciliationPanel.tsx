import { Card, StatusPill } from "@living-textbook/ui";
import {
  validatePackageReadinessReconciliation,
  type PackageReadinessLane,
  type PackageReadinessLaneStatus,
  type PackageReadinessReconciliation,
} from "@living-textbook/content-model";

interface PackageReadinessReconciliationPanelProps {
  reconciliations: PackageReadinessReconciliation[];
  evidenceFindings?: string[];
}

const statusTone: Record<PackageReadinessLaneStatus, "neutral" | "success" | "warning"> = {
  "ready-preview": "success",
  "needs-review": "warning",
  blocked: "warning",
};

export function PackageReadinessReconciliationPanel({ reconciliations, evidenceFindings = [] }: PackageReadinessReconciliationPanelProps) {
  const findings = [
    ...evidenceFindings,
    ...reconciliations.flatMap((reconciliation) => validatePackageReadinessReconciliation(reconciliation).map((error) => `${reconciliation.reconciliationId}: ${error}`)),
  ];
  const blockedCount = reconciliations.filter((reconciliation) => reconciliation.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package readiness reconciliation</p>
          <h2 className="mt-1 text-lg font-bold">One evidence chain before promotion</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review-only record joins source assembly, approval, verifier, target-language audio, media rights, publish, and assignment evidence for each tenant package.
          </p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone="warning" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ReconciliationMetric label="Packages" value={String(reconciliations.length)} />
        <ReconciliationMetric label="Evidence lanes" value={String(reconciliations.reduce((total, item) => total + item.lanes.length, 0))} />
        <ReconciliationMetric label="Promotion" value="Blocked" tone="warning" />
      </div>

      {findings.length > 0 ? (
        <ul className="mt-5 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {findings.map((finding, index) => <li key={`package-readiness-finding-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">{finding}</li>)}
        </ul>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {reconciliations.map((reconciliation) => <ReconciliationCard key={reconciliation.reconciliationId} reconciliation={reconciliation} />)}
      </div>
    </Card>
  );
}

function ReconciliationCard({ reconciliation }: { reconciliation: PackageReadinessReconciliation }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{reconciliation.tenantId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{reconciliation.label}</h3>
          <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{reconciliation.packageId} -&gt; {reconciliation.releaseCandidate}</p>
        </div>
        <StatusPill label="Blocked" tone="warning" />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {reconciliation.lanes.map((lane) => <LaneCard key={lane.laneId} lane={lane} />)}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Boundary label="Source assembly packet" value={reconciliation.sourceAssemblyPacketId} />
        <Boundary label="Extraction preview" value={reconciliation.sourceExtractionPreviewId} />
        <Boundary label="Source checksum" value={reconciliation.sourceAssemblyChecksum} />
        <Boundary label="No package promotion from reconciliation" value="Blocked" />
        <Boundary label="No student-facing activation from reconciliation" value="Blocked" />
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]"><span className="font-semibold text-[var(--tenant-text)]">Progress rule:</span> {reconciliation.targetLanguageProgressionRule}</p>
    </article>
  );
}

function LaneCard({ lane }: { lane: PackageReadinessLane }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">{lane.label}</p>
        <StatusPill label={lane.status} tone={statusTone[lane.status]} />
      </div>
      <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{lane.sourceRecord}: {lane.referenceId}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--tenant-muted)]">{lane.evidence}</p>
    </div>
  );
}

function ReconciliationMetric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "success" | "warning" }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>{tone !== "neutral" ? <StatusPill label={tone === "warning" ? "Gate" : "OK"} tone={tone} /> : null}</div>;
}

function Boundary({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p></div>;
}
