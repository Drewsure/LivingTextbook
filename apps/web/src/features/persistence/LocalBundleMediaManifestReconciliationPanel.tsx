import type { LocalBundleMediaManifestReconciliation } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundleMediaManifestReconciliationPanelProps {
  reconciliation: LocalBundleMediaManifestReconciliation;
}

const statusTone = { aligned: "success", "needs-evidence": "warning", mismatch: "warning" } as const;

export function LocalBundleMediaManifestReconciliationPanel({
  reconciliation,
}: LocalBundleMediaManifestReconciliationPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Media manifest reconciliation</p>
          <h2 className="mt-1 text-lg font-bold">Package paths and media evidence must agree</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This provider-neutral comparison catches identity, version, and path drift before any future local
            package writer can be considered. It is diagnostic only and cannot copy or activate media.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={reconciliation.status} tone={statusTone[reconciliation.status]} />
          <StatusPill label={reconciliation.identityMatches ? "Identity aligned" : "Identity mismatch"} tone={reconciliation.identityMatches ? "success" : "warning"} />
          <StatusPill label={reconciliation.storageSelectionMatches ? "Storage aligned" : "Storage mismatch"} tone={reconciliation.storageSelectionMatches ? "success" : "warning"} />
          <StatusPill label={reconciliation.pathMatches ? "Paths aligned" : "Path mismatch"} tone={reconciliation.pathMatches ? "success" : "warning"} />
          <StatusPill label="No side effect" tone="success" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Tenant" value={reconciliation.tenantId} />
        <Fact label="Bundle" value={reconciliation.bundleId} />
        <Fact label="Package version" value={reconciliation.packageVersion} />
        <Fact label="Open checks" value={`${reconciliation.openEvidenceChecks.length + reconciliation.mismatchChecks.length}`} />
      </dl>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <EvidenceList title="Open media evidence" values={reconciliation.openEvidenceChecks} empty="All media evidence checks passed." />
        <EvidenceList title="Manifest mismatches" values={reconciliation.mismatchChecks} empty="No identity, version, or path mismatches." />
      </div>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <h3 className="text-sm font-bold">Execution boundary</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {reconciliation.reasons[reconciliation.reasons.length - 1]}
        </p>
        <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">
          Media artifact: {reconciliation.mediaArtifactPath ?? "missing"} · Version aligned: {reconciliation.versionMatches ? "yes" : "no"}
        </p>
        <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">
          Blocked actions: {reconciliation.blockedActions.join(", ")}
        </p>
        <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">
          Storage identity: {reconciliation.storageSelectionPreflightId} · {reconciliation.storageSelectionGateId}
        </p>
      </div>
    </Card>
  );
}

function EvidenceList({ title, values, empty }: { title: string; values: string[]; empty: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-4">
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {values.length > 0 ? values.join(", ") : empty}
      </p>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
