import { Card, StatusPill } from "@living-textbook/ui";
import type { PhaserCandidateIntegrationEligibility } from "@living-textbook/content-model";

interface PhaserCandidateIntegrationEligibilityPanelProps {
  records: PhaserCandidateIntegrationEligibility[];
  errors: string[];
}

export function PhaserCandidateIntegrationEligibilityPanel({ records, errors }: PhaserCandidateIntegrationEligibilityPanelProps) {
  const valid = errors.length === 0;
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Frozen candidate integration eligibility</p>
          <h2 className="mt-1 text-lg font-bold">Z.ai and Phaser source remains isolated until every lane passes</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">Each candidate is bound to its canonical route, parent engine, scoring profile, source snapshot, and missing evidence. This is a gate, not an import action.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={valid ? "Eligibility shape valid" : "Eligibility review"} tone={valid ? "success" : "warning"} />
          <StatusPill label="Source isolation required" tone="warning" />
          <StatusPill label="Import blocked" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {records.map((record) => (
          <article key={record.eligibilityId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.tenantId} / {record.parentEngine} / {record.scoringProfile}</p>
                <h3 className="mt-1 text-base font-bold">{record.gameMode}</h3>
                <p className="mt-1 break-words text-xs text-[var(--tenant-muted)]">Canonical route: {record.canonicalRoute}</p>
                <p className="mt-1 break-words text-xs text-[var(--tenant-muted)]">Canonical component: {record.canonicalComponent}</p>
              </div>
              <div className="flex flex-wrap gap-2"><StatusPill label={record.status} tone="warning" /><StatusPill label="No wrapper approval" tone="warning" /></div>
            </div>
            <p className="mt-3 break-all text-xs text-[var(--tenant-muted)]">Frozen snapshot: {record.sourceSnapshotId} / {record.sourceCommitSha}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {record.evidenceLanes.map((lane) => (
                <section key={`${record.eligibilityId}-${lane.laneId}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-bold">{lane.label}</h4><StatusPill label={lane.status} tone={lane.status === "reviewed" ? "success" : "warning"} /></div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.requirement}</p>
                  <p className="mt-2 break-words text-xs text-[var(--tenant-muted)]">Evidence: {lane.sourceRecord}</p>
                </section>
              ))}
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2"><List title="Next required evidence" items={record.nextRequiredEvidence} /><List title="Blocked actions" items={record.blockedActions} /></div>
          </article>
        ))}
      </div>
      {errors.length > 0 && <List title="Eligibility errors" items={errors} />}
    </Card>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3"><div className="flex items-center justify-between gap-2"><h4 className="text-sm font-bold">{title}</h4><StatusPill label={String(items.length)} tone="warning" /></div><ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">{items.map((item, index) => <li key={`${title}-${index}-${item}`}>{item}</li>)}</ul></section>;
}
