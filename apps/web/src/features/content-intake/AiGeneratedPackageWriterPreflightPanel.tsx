import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratedPackageWriterPreflight,
  AiGeneratedPackageWriterPreflightStatus,
  AiGeneratedPackageWriterTarget,
  AiGeneratedPackageWriterTargetStatus,
} from "@/data/sampleAiGeneratedPackageWriterPreflight";

interface AiGeneratedPackageWriterPreflightPanelProps {
  preflights: AiGeneratedPackageWriterPreflight[];
}

const preflightStatusTone: Record<AiGeneratedPackageWriterPreflightStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

const targetStatusTone: Record<AiGeneratedPackageWriterTargetStatus, "neutral" | "warning"> = {
  "needs-review": "neutral",
  blocked: "warning",
};

export function AiGeneratedPackageWriterPreflightPanel({ preflights }: AiGeneratedPackageWriterPreflightPanelProps) {
  const targetCount = preflights.reduce((total, preflight) => total + preflight.writerTargets.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generated package writer preflight</p>
          <h2 className="mt-1 text-lg font-bold">Writer blocked until release-control implementation</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preflight names the future writer targets after a dry run: package JSON, route registry, media
            playlist, local companion, assignment shell, and rollback map. It is review-only and cannot execute a
            package writer or mutate student-facing release state.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Writer blocked" tone="warning" />
          <StatusPill label={`${targetCount} writer target(s)`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {preflights.map((preflight) => (
          <article key={preflight.preflightId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{preflight.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{preflight.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{preflight.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={preflight.status} tone={preflightStatusTone[preflight.status]} />
                <StatusPill label={preflight.preflightState} tone="warning" />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Package writer target map</h4>
                <StatusPill label={preflight.packageIdPreview} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {preflight.writerTargets.map((target) => (
                  <WriterTargetCard key={target.targetId} target={target} />
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <PreflightList title="Allowed review actions" items={preflight.allowedReviewActions} />
              <PreflightList title="Next required records" items={preflight.nextRequiredRecords} />
              <PreflightList title="Blocked writer actions" items={preflight.blockedWriterActions} tone="warning" />
              <PreflightList title="Support-language boundary" items={preflight.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function WriterTargetCard({ target }: { target: AiGeneratedPackageWriterTarget }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{target.writerType}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{target.label}</h5>
          <p className="mt-1 text-xs text-[var(--tenant-muted)]">Source: {target.sourceArtifact}</p>
        </div>
        <StatusPill label={target.status} tone={targetStatusTone[target.status]} />
      </div>
      <div className="mt-3 grid gap-3">
        <PreflightList title="Required evidence" items={target.requiredEvidence} />
        <PreflightList title="Blocked writes" items={target.blockedWrites} tone="warning" />
      </div>
    </article>
  );
}

function PreflightList({
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
