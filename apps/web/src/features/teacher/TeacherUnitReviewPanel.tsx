import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId } from "@living-textbook/content-model";
import type { TeacherAssignmentControlStatus } from "@living-textbook/content-model/src/teacherAssignment";
import type { TeacherUnitReviewContext, TeacherUnitReviewRoute } from "@/data/sampleTeacherUnitReview";

interface TeacherUnitReviewPanelProps {
  review: TeacherUnitReviewContext;
}

const routeTone: Record<TeacherUnitReviewRoute["status"], "neutral" | "success" | "warning"> = {
  ready: "success",
  review: "neutral",
  blocked: "warning",
};

const controlTone: Record<TeacherAssignmentControlStatus, "neutral" | "success" | "warning"> = {
  enabled: "success",
  "teacher-optional": "neutral",
  "policy-blocked": "warning",
  "premium-disabled": "warning",
  disabled: "neutral",
};

const modeLabels: Record<GameModeId, string> = {
  flashcards: "Entry Flashcards",
  "memory-match": "Memory Match",
  quiz: "Quiz",
  "sentence-builder": "Sentence Builder",
  "speak-it": "Speak It",
  "balloon-pop": "Balloon Pop",
};

export function TeacherUnitReviewPanel({ review }: TeacherUnitReviewPanelProps) {
  const vocabularyCount = review.unit.pedagogicalPayload.vocabularyTerms.length;
  const sentenceCount = review.unit.pedagogicalPayload.targetSentences.length;
  const audioCueCount = review.contentPackage.audioCues?.length ?? 0;
  const mediaAssetCount = review.contentPackage.mediaAssets?.length ?? 0;
  const packageBlockers =
    review.packageReadiness?.gates.filter((gate) => gate.blocksPilot && gate.status !== "ready") ?? [];
  const assignmentBlockers = review.assignmentPlan?.requiredBeforePilot ?? [];
  const targetModes = review.assignmentPlan?.targetGameModes ?? [review.unit.unitMeta.gameMode];
  const audioCoveredModes = new Set(review.assignmentPlan?.audioCoveredGameModes ?? []);

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher unit review</p>
            <h2 className="mt-1 text-2xl font-bold">{review.unit.unitMeta.theme}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Review before assignment: content, audio coverage, route readiness, media, roster-safe reporting, and pilot blockers in one teacher-facing surface.
            </p>
          </div>
          <StatusPill label={review.packageReadiness?.reviewStatus ?? review.contentPackage.meta.reviewStatus} tone="success" />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ReviewMetric label="Tenant" value={review.tenant.displayName} />
          <ReviewMetric label="Package" value={review.contentPackage.meta.packageId} />
          <ReviewMetric label="Launch code" value={review.launchSession.launchCode} />
          <ReviewMetric label="Unit key" value={review.unitKey} />
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Launch safety</p>
            <h3 className="mt-1 text-lg font-bold">Assignment stays review-only</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This teacher unit surface helps review routes and assignment options, but it cannot start a live classroom launch. Target-language activity remains the progression trigger; support media, support language, and teacher review links cannot replace learner English work.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label="No live classroom launch" tone="warning" />
            <StatusPill label="Review only" tone="neutral" />
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <LaunchSafetyFact label="Student accounts" value="No production student accounts" />
          <LaunchSafetyFact label="Learner data" value="Real learner data blocked" />
          <LaunchSafetyFact label="Reports" value="Report export still blocked" />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Package evidence</p>
            <h3 className="mt-1 text-lg font-bold">Audio and media coverage</h3>
          </div>
          <StatusPill label="Audio-first" tone="success" />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <ReviewMetric label="Vocabulary" value={String(vocabularyCount)} />
          <ReviewMetric label="Sentences" value={String(sentenceCount)} />
          <ReviewMetric label="Audio cues" value={String(audioCueCount)} />
          <ReviewMetric label="Media assets" value={String(mediaAssetCount)} />
          <ReviewMetric label="Covered modes" value={String(audioCoveredModes.size)} />
        </dl>

        <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-sm font-bold text-[var(--tenant-text)]">Curated activity path</p>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            These are teacher-approved options for this unit. The page does not promise unlimited template switching; every offered activity keeps audio support and reporting boundaries visible.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {targetModes.map((mode) => (
              <div key={mode} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--tenant-text)]">{modeLabels[mode]}</p>
                  <StatusPill label={audioCoveredModes.has(mode) ? "Audio covered" : "Audio review"} tone={audioCoveredModes.has(mode) ? "success" : "warning"} />
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                  Target-language work remains the progression trigger. Support media or support language cannot complete the activity by itself.
                </p>
              </div>
            ))}
          </div>
        </section>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Route readiness</p>
            <h3 className="mt-1 text-lg font-bold">Teacher and student paths</h3>
          </div>
          <StatusPill label={`${review.routes.length} routes`} tone="neutral" />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {review.routes.map((route) => (
            <a
              key={route.href}
              href={route.href}
              className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm transition hover:bg-[var(--tenant-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              <span className="flex flex-wrap items-start justify-between gap-2">
                <span className="font-bold text-[var(--tenant-text)]">{route.label}</span>
                <StatusPill label={route.status} tone={routeTone[route.status]} />
              </span>
              <span className="mt-2 block break-all font-mono text-xs font-semibold text-[var(--tenant-text)]">{route.href}</span>
              <span className="mt-2 block leading-6 text-[var(--tenant-muted)]">{route.note}</span>
            </a>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Pilot blockers</p>
            <h3 className="mt-1 text-lg font-bold">What remains before real assignment</h3>
          </div>
          <StatusPill label={`${packageBlockers.length + assignmentBlockers.length} open`} tone={packageBlockers.length + assignmentBlockers.length > 0 ? "warning" : "success"} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-[var(--tenant-border)] p-4">
            <p className="text-sm font-bold text-[var(--tenant-text)]">Package gates</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {packageBlockers.length > 0 ? (
                packageBlockers.map((gate) => <li key={gate.gateId}>{gate.label}: {gate.nextStep}</li>)
              ) : (
                <li>No package blockers are open.</li>
              )}
            </ul>
          </section>

          <section className="rounded-lg border border-[var(--tenant-border)] p-4">
            <p className="text-sm font-bold text-[var(--tenant-text)]">Assignment controls</p>
            {review.assignmentPlan ? (
              <div className="mt-3 grid gap-3">
                {review.assignmentPlan.controls.map((control) => (
                  <div key={control.controlId} className="rounded-lg bg-[var(--tenant-primary-soft)] p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-bold text-[var(--tenant-text)]">{control.label}</p>
                      <StatusPill label={control.status} tone={controlTone[control.status]} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{control.note}</p>
                  </div>
                ))}
                {assignmentBlockers.map((blocker) => (
                  <p key={blocker} className="text-sm leading-6 text-[var(--tenant-muted)]">{blocker}</p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
                No assignment plan is attached. This unit stays review-only until teacher launch settings are defined.
              </p>
            )}
          </section>
        </div>
      </Card>
    </div>
  );
}

function ReviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function LaunchSafetyFact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
