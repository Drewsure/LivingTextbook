import { Card, StatusPill } from "@living-textbook/ui";
import type { AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding } from "@living-textbook/content-model";

interface TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanelProps {
  bindings: AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding[];
}

export function TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanel({ bindings }: TeacherAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Decision snapshot adjudication</p>
          <h2 className="mt-1 text-xl font-bold">Assist audio and release decision identity</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review-only bridge proves that assist-language audio evidence is being considered against the exact
            pilot decision snapshot and fingerprint. It does not write, restore, export, approve, promote, or launch.
          </p>
        </div>
        <StatusPill label="No live action" tone="warning" />
      </div>

      <div className="mt-5 grid gap-4">
        {bindings.map((binding) => (
          <article key={binding.bindingId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Binding identity</p>
                <h3 className="mt-1 break-words text-base font-bold text-[var(--tenant-text)]">{binding.bindingId}</h3>
              </div>
              <StatusPill label={binding.status === "linked-review-only" ? "Linked review" : "Blocked preview"} tone={binding.status === "linked-review-only" ? "success" : "warning"} />
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Fact label="Decision snapshot" value={binding.snapshotId} />
              <Fact label="Decision" value={binding.decisionId} />
              <Fact label="Persistence mode" value={binding.persistenceMode} />
              <Fact label="Fingerprint" value={binding.decisionFingerprint} />
            </dl>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <List title="Linked records" items={binding.linkedRecords} tone="neutral" />
              <List title="Blocked actions" items={binding.blockedActions} tone="warning" />
              <List title="Open blockers" items={binding.blockingReasons.length > 0 ? binding.blockingReasons : ["No additional scope blocker in this review binding."]} tone={binding.blockingReasons.length > 0 ? "warning" : "success"} />
            </div>
            <div className="mt-4 rounded-lg border border-[var(--tenant-border)] p-3">
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next gate</p>
              <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
                {binding.nextGate.map((gate, index) => <li key={`${binding.bindingId}-next-${index}`}>{gate}</li>)}
              </ul>
            </div>
          </article>
        ))}
        {bindings.length === 0 ? <p className="text-sm text-[var(--tenant-muted)]">No decision snapshot binding is configured for this tenant.</p> : null}
      </div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function List({ title, items, tone }: { title: string; items: string[]; tone: "success" | "warning" | "neutral" }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4><StatusPill label={String(items.length)} tone={tone} /></div><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)}</ul></section>;
}
