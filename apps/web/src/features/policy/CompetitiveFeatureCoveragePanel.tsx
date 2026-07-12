import { Card, StatusPill } from "@living-textbook/ui";
import type {
  CompetitiveCoverageStatus,
  CompetitiveFeatureCoverageMatrix,
} from "@/data/sampleCompetitiveFeatureCoverage";

interface CompetitiveFeatureCoveragePanelProps {
  matrix: CompetitiveFeatureCoverageMatrix;
}

const statusTone: Record<CompetitiveCoverageStatus, "neutral" | "success" | "warning"> = {
  core: "success",
  "not-for-v1": "neutral",
  optional: "neutral",
  planned: "warning",
  "white-label-risk": "warning",
};

const statusLabel: Record<CompetitiveCoverageStatus, string> = {
  core: "Core",
  "not-for-v1": "Not v1",
  optional: "Optional",
  planned: "Planned",
  "white-label-risk": "Risk",
};

export function CompetitiveFeatureCoveragePanel({ matrix }: CompetitiveFeatureCoveragePanelProps) {
  const riskCount = matrix.items.filter((item) => item.status === "white-label-risk").length;
  const plannedCount = matrix.items.filter((item) => item.status === "planned").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Competitive feature coverage</p>
          <h3 className="mt-1 text-lg font-bold">{matrix.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{matrix.summary}</p>
        </div>
        <StatusPill label={`${plannedCount} planned / ${riskCount} risk`} tone={riskCount > 0 ? "warning" : "success"} />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Activity pathway principle</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{matrix.principle}</p>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {matrix.items.map((item) => (
          <section key={item.itemId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
              <StatusPill label={statusLabel[item.status]} tone={statusTone[item.status]} />
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Response:</span> {item.productResponse}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              <span className="font-semibold text-[var(--tenant-text)]">Foundation action:</span> {item.foundationAction}
            </p>
          </section>
        ))}
      </div>
    </Card>
  );
}
