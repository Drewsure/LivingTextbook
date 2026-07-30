import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratorTenantCoverage,
  AiGeneratorTenantCoverageLane,
  AiGeneratorTenantCoverageStatus,
} from "@/data/sampleAiGeneratorTenantCoverage";

interface AiGeneratorTenantCoveragePanelProps {
  coverages: AiGeneratorTenantCoverage[];
}

const coverageTone: Record<AiGeneratorTenantCoverageStatus, "success" | "warning" | "neutral"> = {
  covered: "success",
  partial: "warning",
  missing: "warning",
};

export function AiGeneratorTenantCoveragePanel({ coverages }: AiGeneratorTenantCoveragePanelProps) {
  const missingCount = coverages.reduce((total, coverage) => total + coverage.missingCount, 0);
  const partialCount = coverages.reduce((total, coverage) => total + coverage.partialCount, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generator tenant coverage</p>
          <h2 className="mt-1 text-lg font-bold">White-label generator records by tenant</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            A tenant route is not considered generator-ready just because the generic route loads. Each request needs
            its own prompt, cost, audio, engine, reward, verifier, manifest, publish, draft, and correction preview
            records before live generation, publishing, or assignment can be considered.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Tenant-specific records required" tone="warning" />
          <StatusPill label={`${missingCount} missing`} tone={missingCount > 0 ? "warning" : "success"} />
          <StatusPill label={`${partialCount} partial`} tone={partialCount > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {coverages.map((coverage) => (
          <article key={coverage.coverageId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{coverage.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{coverage.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{coverage.summary}</p>
              </div>
              <StatusPill label={coverage.status} tone={coverageTone[coverage.status]} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <CoverageMetric label="Covered records" value={String(coverage.coveredCount)} tone="success" />
              <CoverageMetric label="Partial bindings" value={String(coverage.partialCount)} tone="warning" />
              <CoverageMetric label="Missing records" value={String(coverage.missingCount)} tone="warning" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Tenant record lanes</h4>
                <StatusPill label={String(coverage.lanes.length)} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {coverage.lanes.map((lane) => (
                  <CoverageLaneCard key={lane.laneId} lane={lane} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <CoverageList title="Blocked generator actions" items={coverage.blockedActions} tone="warning" />
              <CoverageList title="Next tenant requirements" items={coverage.nextRequirements} tone="neutral" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function CoverageLaneCard({ lane }: { lane: AiGeneratorTenantCoverageLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h5 className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h5>
          <p className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">{lane.recordType}</p>
        </div>
        <StatusPill label={lane.status} tone={coverageTone[lane.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <CoverageFact label="Evidence" value={lane.evidence} />
        <CoverageFact label="Next step" value={lane.nextStep} />
      </dl>
    </article>
  );
}

function CoverageMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label="Gate" tone={tone} />
      </div>
      <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function CoverageFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function CoverageList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
