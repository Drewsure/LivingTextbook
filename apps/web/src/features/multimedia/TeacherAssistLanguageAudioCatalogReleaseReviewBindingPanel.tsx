import { Card, StatusPill } from "@living-textbook/ui";
import type { AssistLanguageAudioCatalogReleaseReviewBinding } from "@living-textbook/content-model";

interface TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanelProps {
  bindings: AssistLanguageAudioCatalogReleaseReviewBinding[];
}

export function TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanel({ bindings }: TeacherAssistLanguageAudioCatalogReleaseReviewBindingPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Composite release review binding</p>
          <h2 className="mt-1 text-xl font-bold">Assist audio cannot bypass release control</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Catalog evidence, reviewer identity, release control, and human review must refer to one tenant and package before a future approval design can proceed.
          </p>
        </div>
        <StatusPill label="Production approval blocked" tone="warning" />
      </div>

      {bindings.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {bindings.map((binding) => (
            <article key={binding.bindingId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{binding.tenantId}</p>
                  <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{binding.packageId}</h3>
                  <p className="mt-1 text-sm text-[var(--tenant-muted)]">Unit: {binding.unitKey}</p>
                </div>
                <StatusPill label={binding.status} tone="warning" />
              </div>

              <dl className="mt-4 grid gap-3 text-xs leading-5 sm:grid-cols-2 lg:grid-cols-5">
                <Fact label="Release control" value={binding.releaseControlStatus} />
                <Fact label="Human review" value={binding.humanReviewStatus} />
                <Fact label="Scope drift" value={String(binding.scopeDrift.length)} />
                <Fact label="Blocking reasons" value={String(binding.blockingReasons.length)} />
                <Fact label="Production approval" value="Blocked" />
              </dl>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <List title="Linked records" items={binding.linkedRecords} />
                <List title="Next gate" items={binding.nextGate} />
              </div>

              <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Open blockers</h4>
                <ul className="mt-2 grid gap-2 text-xs leading-5 text-[var(--tenant-muted)]">
                  {binding.blockingReasons.map((item, index) => <li key={`release-blocker-${index}-${item}`}>{item}</li>)}
                </ul>
              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
                Approval capture: no · Package promotion: no · Student production launch: no · Side effect: none
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
          No composite release review binding is configured for this tenant.
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
