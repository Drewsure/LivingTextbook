import { Card, StatusPill } from "@living-textbook/ui";
import type { AssistLanguageAudioCatalogReviewerGateBinding } from "@living-textbook/content-model";

interface TeacherAssistLanguageAudioCatalogReviewerGateBindingPanelProps {
  bindings: AssistLanguageAudioCatalogReviewerGateBinding[];
}

export function TeacherAssistLanguageAudioCatalogReviewerGateBindingPanel({ bindings }: TeacherAssistLanguageAudioCatalogReviewerGateBindingPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Reviewer gate binding</p>
          <h2 className="mt-1 text-xl font-bold">Identity and signature gate remains closed</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Reconciled audio evidence must bind to the same tenant before a future approval workflow can inspect reviewer identity or signature policy.
          </p>
        </div>
        <StatusPill label="Approval disabled" tone="warning" />
      </div>

      {bindings.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {bindings.map((binding) => (
            <article key={binding.bindingId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{binding.tenantId}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{binding.packageId}</h3>
                  <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">Gate: {binding.reviewerGateId}</p>
                </div>
                <StatusPill label={binding.status} tone="warning" />
              </div>

              <dl className="mt-4 grid gap-3 text-xs leading-5 sm:grid-cols-2 lg:grid-cols-4">
                <Fact label="Identity" value={binding.gateIdentityStatus} />
                <Fact label="Signature" value={binding.gateSignatureStatus} />
                <Fact label="Approval" value={binding.gateApprovalCaptureStatus} />
                <Fact label="Scope drift" value={String(binding.scopeDrift.length)} />
              </dl>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <List title="Required reviewer lanes" items={binding.requiredReviewerLanes} />
                <List title="Unresolved requirements" items={binding.unresolvedRequirements} />
              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
                Binding complete: no · Approval capture: no · Release mutation: no · Signature upload: no
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
          No reviewer gate binding is configured for this tenant.
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
