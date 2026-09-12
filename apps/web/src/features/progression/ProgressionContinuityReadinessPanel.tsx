import {
  createReviewOnlyProgressionContinuityAdapter,
  validateProgressionContinuityRuntimeRequest,
} from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";
import type { ProgressionContinuityEnvelope } from "@living-textbook/content-model";

interface ProgressionContinuityReadinessPanelProps {
  envelope: ProgressionContinuityEnvelope;
  expectedTenantId: string;
  expectedPackageId: string;
  expectedLaunchCode: string;
  expectedStudentSessionId: string;
}

export function ProgressionContinuityReadinessPanel({
  envelope,
  expectedTenantId,
  expectedPackageId,
  expectedLaunchCode,
  expectedStudentSessionId,
}: ProgressionContinuityReadinessPanelProps) {
  const request = {
    expectedTenantId,
    expectedPackageId,
    expectedLaunchCode,
    expectedStudentSessionId,
    envelope,
  };
  const errors = validateProgressionContinuityRuntimeRequest(request);
  const decision = createReviewOnlyProgressionContinuityAdapter().execute(request).decision;
  const snapshot = envelope.snapshot;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Progression continuity</p>
          <h2 className="mt-1 text-lg font-bold">Entry practice to curated game handoff</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The handoff shape is ready for review, while live persistence remains blocked until the platform selects and approves a storage and identity adapter.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={errors.length === 0 ? "Envelope valid" : "Envelope review"} tone={errors.length === 0 ? "success" : "warning"} />
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label="No side effect" tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ContinuityMetric label="Source" value={envelope.sourceRoute} />
        <ContinuityMetric label="Destination" value={envelope.destinationRoute} />
        <ContinuityMetric label="Event cursor" value={String(envelope.eventCursor)} />
        <ContinuityMetric label="Star Dust" value={String(snapshot.earnedStarDust)} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <h3 className="text-sm font-bold">Progression snapshot</h3>
          <dl className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-2">
            <div><dt className="font-semibold text-[var(--tenant-text)]">Current step</dt><dd className="mt-1">{snapshot.currentStep}</dd></div>
            <div><dt className="font-semibold text-[var(--tenant-text)]">Mastery</dt><dd className="mt-1">{snapshot.masteryStatus}</dd></div>
            <div><dt className="font-semibold text-[var(--tenant-text)]">Unlocked modes</dt><dd className="mt-1">{snapshot.unlockedGameModes.join(", ")}</dd></div>
            <div><dt className="font-semibold text-[var(--tenant-text)]">Completed modes</dt><dd className="mt-1">{snapshot.completedGameModes.join(", ")}</dd></div>
          </dl>
        </section>
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <h3 className="text-sm font-bold">Runtime decision</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{decision.reasons[decision.reasons.length - 1]}</p>
          <ul className="mt-3 grid gap-2 text-sm text-[var(--tenant-muted)]">
            {[
              ["Tenant and package bound", envelope.tenantId === expectedTenantId && envelope.packageId === expectedPackageId],
              ["Launch and learner session bound", envelope.launchCode === expectedLaunchCode && envelope.studentSessionId === expectedStudentSessionId],
              ["Support evidence excluded", !envelope.supportLanguageEvidenceIncluded && !envelope.mediaOnlyEvidenceIncluded],
              ["Raw audio and transcripts excluded", !envelope.rawLearnerAudioIncluded && !envelope.learnerTranscriptIncluded],
            ].map(([label, passed], index) => (
              <li key={`continuity-check-${index}`} className="flex items-center justify-between gap-3">
                <span>{label}</span>
                <StatusPill label={passed ? "Pass" : "Review"} tone={passed ? "success" : "warning"} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {errors.length > 0 ? (
        <ul className="mt-4 grid gap-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          {errors.map((error, index) => <li key={`continuity-error-${index}-${error}`}>{error}</li>)}
        </ul>
      ) : null}
    </Card>
  );
}

function ContinuityMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}
