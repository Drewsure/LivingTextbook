import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratedPackageReleaseCandidate,
  AiGeneratedPackageReleaseCandidateSignal,
  AiGeneratedPackageReleaseCandidateSignalStatus,
  AiGeneratedPackageReleaseCandidateStatus,
} from "@/data/sampleAiGeneratedPackageReleaseCandidate";

interface AiGeneratedPackageReleaseCandidatePanelProps {
  candidates: AiGeneratedPackageReleaseCandidate[];
}

const candidateStatusTone: Record<AiGeneratedPackageReleaseCandidateStatus, "success" | "warning"> = {
  blocked: "warning",
  "ready-for-review": "success",
};

const signalStatusTone: Record<AiGeneratedPackageReleaseCandidateSignalStatus, "success" | "warning"> = {
  "ready-preview": "success",
  blocked: "warning",
  missing: "warning",
};

export function AiGeneratedPackageReleaseCandidatePanel({
  candidates,
}: AiGeneratedPackageReleaseCandidatePanelProps) {
  const blockerCount = candidates.reduce(
    (total, candidate) => total + candidate.signals.filter((signal) => signal.status !== "ready-preview").length,
    0,
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generated package release candidate</p>
          <h2 className="mt-1 text-lg font-bold">Private-library handoff preview</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This preview shows how a generated package would later move toward a private tenant library item and normal
            release-control review. It does not write a library item, release candidate, route, assignment, local bundle,
            or student-ready marker.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only candidate" tone="neutral" />
          <StatusPill label={`${blockerCount} release blocker(s)`} tone={blockerCount > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {candidates.map((candidate) => (
          <article key={candidate.candidateId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{candidate.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{candidate.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{candidate.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={candidate.status} tone={candidateStatusTone[candidate.status]} />
                <StatusPill label={candidate.candidateState} tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <CandidateFact label="Package target" value={candidate.packageTarget} />
              <CandidateFact label="Private library target" value={candidate.privateLibraryTarget} />
              <CandidateFact label="Route preview" value={candidate.routePreview} />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Release candidate signals</h4>
                <StatusPill label={String(candidate.signals.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {candidate.signals.map((signal) => (
                  <ReleaseCandidateSignalCard key={signal.signalId} signal={signal} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-4">
              <CandidateList title="Candidate records" items={candidate.candidateRecords} />
              <CandidateList title="Allowed review work" items={candidate.allowedNow} />
              <CandidateList title="Blocked release actions" items={candidate.blockedActions} tone="warning" />
              <CandidateList title="Next required records" items={candidate.nextRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function CandidateFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function ReleaseCandidateSignalCard({ signal }: { signal: AiGeneratedPackageReleaseCandidateSignal }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h5 className="text-sm font-bold text-[var(--tenant-text)]">{signal.label}</h5>
          <p className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">{signal.sourceRecord}</p>
        </div>
        <StatusPill label={signal.status} tone={signalStatusTone[signal.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <CandidateSignalFact label="Evidence" value={signal.evidence} />
        <CandidateSignalFact label="Release effect" value={signal.releaseEffect} />
      </dl>
    </article>
  );
}

function CandidateSignalFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function CandidateList({
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
