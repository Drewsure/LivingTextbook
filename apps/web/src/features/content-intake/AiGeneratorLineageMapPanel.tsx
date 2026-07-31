import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratorLineageMap,
  AiGeneratorLineageStep,
  AiGeneratorLineageStepStatus,
} from "@/data/sampleAiGeneratorLineageMap";

interface AiGeneratorLineageMapPanelProps {
  maps: AiGeneratorLineageMap[];
}

const stepTone: Record<AiGeneratorLineageStepStatus, "neutral" | "success" | "warning"> = {
  covered: "success",
  blocked: "warning",
  missing: "warning",
  "review-only": "neutral",
};

export function AiGeneratorLineageMapPanel({ maps }: AiGeneratorLineageMapPanelProps) {
  const blockedStepCount = maps.reduce(
    (total, map) => total + map.steps.filter((step) => step.status === "blocked" || step.status === "missing").length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generator lineage map</p>
          <h2 className="mt-1 text-lg font-bold">Request-to-review chain</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The lineage map gives reviewers one place to trace generated content from request evidence through draft,
            correction, verifier, manifest, publish readiness, and teacher review. It is inspection-only.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Lineage review only" tone="neutral" />
          <StatusPill label={`${blockedStepCount} blocked step(s)`} tone={blockedStepCount > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {maps.map((map) => (
          <article key={map.lineageId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{map.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{map.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{map.summary}</p>
              </div>
              <StatusPill label={map.currentState} tone="neutral" />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Lineage steps</h4>
                <StatusPill label={String(map.steps.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {map.steps.map((step) => (
                  <LineageStepCard key={step.stepId} step={step} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <LineageList title="Blocked lineage actions" items={map.blockedActions} tone="warning" />
              <LineageList title="Next lineage records" items={map.nextRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function LineageStepCard({ step }: { step: AiGeneratorLineageStep }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h5 className="text-sm font-bold text-[var(--tenant-text)]">{step.label}</h5>
          <p className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">{step.recordType}</p>
        </div>
        <StatusPill label={step.status} tone={stepTone[step.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Evidence</dt>
          <dd>{step.evidence}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Release boundary</dt>
          <dd>{step.releaseBoundary}</dd>
        </div>
      </dl>
    </article>
  );
}

function LineageList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
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
