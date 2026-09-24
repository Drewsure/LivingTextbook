import { Card, StatusPill } from "@living-textbook/ui";
import type { AssistLanguageAudioCatalogApprovalReconciliation } from "@living-textbook/content-model";

interface TeacherAssistLanguageAudioCatalogApprovalReconciliationPanelProps {
  reconciliations: AssistLanguageAudioCatalogApprovalReconciliation[];
}

export function TeacherAssistLanguageAudioCatalogApprovalReconciliationPanel({ reconciliations }: TeacherAssistLanguageAudioCatalogApprovalReconciliationPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence reconciliation</p>
          <h2 className="mt-1 text-xl font-bold">Approval packet and catalog identity check</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview reconciles tenant, package, unit, catalog-record, and future storage identities before a human approval workflow exists.
          </p>
        </div>
        <StatusPill label="No release mutation" tone="warning" />
      </div>

      {reconciliations.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {reconciliations.map((reconciliation) => (
            <article key={reconciliation.reconciliationId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{reconciliation.tenantId}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{reconciliation.packageId}</h3>
                  <p className="mt-1 text-sm text-[var(--tenant-muted)]">Unit: {reconciliation.unitKey}</p>
                </div>
                <StatusPill label={reconciliation.status} tone="warning" />
              </div>

              <dl className="mt-4 grid gap-3 text-xs leading-5 sm:grid-cols-2 lg:grid-cols-4">
                <Fact label="Catalog records" value={String(reconciliation.catalogRecordIds.length)} />
                <Fact label="Identity drift" value={String(reconciliation.identityDrift.length)} />
                <Fact label="Open evidence" value={String(reconciliation.unresolvedEvidence.length)} />
                <Fact label="Decision" value={reconciliation.approvalDecision} />
              </dl>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <List title="Identity checks" items={reconciliation.identityChecks} />
                <List title="Linked storage records" items={reconciliation.linkedStorageRecords} />
              </div>

              <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Unresolved evidence</h4>
                <ul className="mt-2 grid gap-2 text-xs leading-5 text-[var(--tenant-muted)]">
                  {reconciliation.unresolvedEvidence.map((item, index) => <li key={`unresolved-${index}-${item}`}>{item}</li>)}
                </ul>
              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
                Reconciliation complete: no · Approval capture: no · Catalog admission: no · Promotion: no · Student-facing use: no
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
          No assist-language approval reconciliation is configured for this tenant.
        </p>
      )}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><dt className="font-semibold text-[var(--tenant-text)]">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
      <ul className="mt-2 grid gap-2 text-xs leading-5 text-[var(--tenant-muted)]">
        {items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)}
      </ul>
    </section>
  );
}
