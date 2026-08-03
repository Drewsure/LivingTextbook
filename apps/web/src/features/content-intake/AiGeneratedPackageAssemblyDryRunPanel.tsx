import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratedPackageAssemblyArtifact,
  AiGeneratedPackageAssemblyArtifactStatus,
  AiGeneratedPackageAssemblyDryRun,
  AiGeneratedPackageAssemblyDryRunStatus,
} from "@/data/sampleAiGeneratedPackageAssemblyDryRun";

interface AiGeneratedPackageAssemblyDryRunPanelProps {
  dryRuns: AiGeneratedPackageAssemblyDryRun[];
}

const dryRunStatusTone: Record<AiGeneratedPackageAssemblyDryRunStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

const artifactStatusTone: Record<AiGeneratedPackageAssemblyArtifactStatus, "neutral" | "warning"> = {
  "draft-preview": "neutral",
  blocked: "warning",
};

export function AiGeneratedPackageAssemblyDryRunPanel({ dryRuns }: AiGeneratedPackageAssemblyDryRunPanelProps) {
  const artifactCount = dryRuns.reduce((total, dryRun) => total + dryRun.artifacts.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generated package assembly dry run</p>
          <h2 className="mt-1 text-lg font-bold">Artifact map before writes</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This dry run previews the package, route, playlist, local companion, assignment, and report-adjacent
            artifacts that would be needed after assembly readiness clears. It is review-only and cannot write files,
            routes, playlists, bundles, assignments, or student-ready state.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Dry run only" tone="warning" />
          <StatusPill label={`${artifactCount} artifact preview(s)`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {dryRuns.map((dryRun) => (
          <article key={dryRun.dryRunId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{dryRun.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{dryRun.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{dryRun.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={dryRun.status} tone={dryRunStatusTone[dryRun.status]} />
                <StatusPill label={dryRun.dryRunState} tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <DryRunFact label="Package id preview" value={dryRun.packageIdPreview} />
              <DryRunFact label="Version preview" value={dryRun.versionPreview} />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Dry-run artifact map</h4>
                <StatusPill label={String(dryRun.artifacts.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {dryRun.artifacts.map((artifact) => (
                  <ArtifactCard key={artifact.artifactId} artifact={artifact} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <DryRunList title="Allowed review actions" items={dryRun.allowedReviewActions} />
              <DryRunList title="Next required records" items={dryRun.nextRequiredRecords} />
              <DryRunList title="Blocked dry-run actions" items={dryRun.blockedDryRunActions} tone="warning" />
              <DryRunList title="Support-language boundary" items={dryRun.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function DryRunFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function ArtifactCard({ artifact }: { artifact: AiGeneratedPackageAssemblyArtifact }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{artifact.artifactType}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{artifact.label}</h5>
          <p className="mt-1 break-words text-xs text-[var(--tenant-muted)]">{artifact.proposedPath}</p>
        </div>
        <StatusPill label={artifact.status} tone={artifactStatusTone[artifact.status]} />
      </div>

      <div className="mt-3 grid gap-3">
        <DryRunList title="Source records" items={artifact.sourceRecords} />
        <DryRunList title="Preview contents" items={artifact.previewContents} />
        <DryRunList title="Blocked writes" items={artifact.blockedWrites} tone="warning" />
      </div>
    </article>
  );
}

function DryRunList({
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
