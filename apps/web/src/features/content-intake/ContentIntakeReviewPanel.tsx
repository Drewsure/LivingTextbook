import { Card, StatusPill } from "@living-textbook/ui";
import type { ContentIntakeRun, ContentIntakeStatus } from "@/data/sampleContentIntakePlan";
import { countIntakeGatesByStatus } from "@/data/sampleContentIntakePlan";

interface ContentIntakeReviewPanelProps {
  runs: ContentIntakeRun[];
}

const statusTone: Record<ContentIntakeStatus, "neutral" | "success" | "warning"> = {
  complete: "success",
  "in-review": "warning",
  blocked: "warning",
  "not-started": "neutral",
};

export function ContentIntakeReviewPanel({ runs }: ContentIntakeReviewPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Content intake</p>
          <h2 className="mt-1 text-lg font-bold">Reviewed package pipeline</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            PDF, DOCX, spreadsheet, and media-folder sources become assignable packages only after source metadata, human review, audio support, media rights, route registry, and teacher approval gates are clear.
          </p>
        </div>
        <StatusPill label={`${runs.length} sample intakes`} tone="success" />
      </div>

      <div className="mt-5 grid gap-4">
        {runs.map((run) => (
          <article key={run.intakeId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{run.tenantName}</p>
                <h3 className="mt-1 text-base font-bold">{run.sourceName}</h3>
                <p className="mt-1 text-sm text-[var(--tenant-muted)]">
                  {run.sourceKind} / {run.unitCount} unit / {run.mediaAssetCount} media assets / route {run.targetRoutePath}
                </p>
              </div>
              <StatusPill label={run.status} tone={statusTone[run.status]} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
              <Metric label="Reviewed units" value={`${run.reviewedUnitCount}/${run.unitCount}`} />
              <Metric label="Complete gates" value={String(countIntakeGatesByStatus(run, "complete"))} />
              <Metric label="In review" value={String(countIntakeGatesByStatus(run, "in-review"))} />
              <Metric label="Not started" value={String(countIntakeGatesByStatus(run, "not-started"))} />
            </dl>

            <div className="mt-4 grid gap-3">
              {run.gates.map((gate) => (
                <section key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold">{gate.label}</h4>
                      <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">{gate.note}</p>
                    </div>
                    <StatusPill label={`${gate.owner}: ${gate.status}`} tone={statusTone[gate.status]} />
                  </div>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
