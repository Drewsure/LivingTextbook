import { Card, StatusPill } from "@living-textbook/ui";
import type { PhaserCandidateEvidenceAdjudication } from "@living-textbook/content-model";

const statusLabels = {
  "awaiting-external-return": "Awaiting external return",
  "returned-awaiting-codex-review": "Returned, awaiting Codex review",
  blocked: "Blocked by evidence errors",
} as const;

export function PhaserCandidateEvidenceAdjudicationPanel({
  adjudication,
  errors,
}: {
  adjudication: PhaserCandidateEvidenceAdjudication;
  errors: string[];
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Evidence adjudication state</p>
          <h2 className="mt-1 text-lg font-bold">Ownership and next action stay separate from approval</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This state machine tells the team who acts next without turning a returned packet into a wrapper approval or a live game.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={statusLabels[adjudication.status]} tone="warning" />
          <StatusPill label={`Owner: ${adjudication.owner}`} tone="neutral" />
          <StatusPill label="Approval disabled" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Mode" value={adjudication.gameMode} />
        <Fact label="Tenant" value={adjudication.tenantId} />
        <Fact label="Packet" value={adjudication.packetId} />
        <Fact label="Eligibility" value={adjudication.eligibilityId} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Next action</p>
        <p className="mt-2 text-sm font-bold text-[var(--tenant-text)]">{adjudication.nextAction}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{adjudication.note}</p>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <List title="Disabled capabilities" values={[
          "Wrapper proposal execution: disabled",
          "Integration approval: disabled",
          "Canonical route writes: disabled",
          "Student assignment: disabled",
        ]} />
        <List title="Blocked actions" values={adjudication.blockedActions} />
      </div>

      {errors.length > 0 && <List title="Adjudication errors" values={errors} />}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p><p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p></div>;
}

function List({ title, values }: { title: string; values: string[] }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
