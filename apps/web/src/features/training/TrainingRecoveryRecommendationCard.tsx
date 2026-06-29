"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { formatLabel, formatMode } from "@/lib/formatLabels";
import type { TrainingRecoveryTriggerRecommendation } from "./trainingRecoveryTrigger";

interface TrainingRecoveryRecommendationCardProps {
  recommendation: TrainingRecoveryTriggerRecommendation;
  rewardName: string;
}

export function TrainingRecoveryRecommendationCard({
  recommendation,
  rewardName,
}: TrainingRecoveryRecommendationCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Training Academy</p>
          <h3 className="text-lg font-bold">Recovery Practice Recommended</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText text={recommendation.reason} label="Tap the recovery recommendation to hear it" className="text-sm" />
          </p>
        </div>
        <StatusPill label={recommendation.triggerLabel} tone="warning" />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <RecoveryFact label="Source" value={recommendation.sourceGameMode ? formatMode(recommendation.sourceGameMode) : "Current game"} />
        <RecoveryFact label="Focus" value={formatLabel(recommendation.focusType)} />
        <RecoveryFact label="Misses" value={String(recommendation.missCount)} />
        {typeof recommendation.attempts === "number" && <RecoveryFact label="Attempts" value={String(recommendation.attempts)} />}
        {typeof recommendation.totalPairs === "number" && <RecoveryFact label="Pairs" value={String(recommendation.totalPairs)} />}
        {typeof recommendation.earnedStarDust === "number" && <RecoveryFact label={rewardName} value={String(recommendation.earnedStarDust)} />}
      </dl>

      <div className="mt-5 grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-text)]">{recommendation.detail}</p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            Training Academy is optional support. It does not block the game path.
          </p>
        </div>
        <a
          href={recommendation.recoveryPath}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open Training
        </a>
      </div>
    </Card>
  );
}

function RecoveryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
