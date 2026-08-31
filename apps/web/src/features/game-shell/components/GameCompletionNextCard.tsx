"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";
import type { UnitGameOffer, UnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { getGameModeRoutePath } from "@/features/routes/gameModeRoutePaths";
import { getStudentActivityHubPath, getTrainingAcademyPath } from "@/features/routes/routeContracts";
import { formatMode } from "@/lib/formatLabels";

interface GameCompletionNextCardProps {
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  currentGameMode: GameModeId;
  earnedStarDust: number;
  rewardName: string;
  offerMap?: UnitGameOfferMap;
}

export function GameCompletionNextCard({
  launchSession,
  progression,
  currentGameMode,
  earnedStarDust,
  rewardName,
  offerMap,
}: GameCompletionNextCardProps) {
  const currentComplete = progression.completedGameModes.includes(currentGameMode);
  const nextOffer = findNextReviewedOffer(offerMap, progression, currentGameMode);
  const nextMode = nextOffer?.gameMode ?? findNextRecommendedMode(launchSession, progression, currentGameMode);
  const nextPath = nextOffer?.launchRoute ?? (nextMode ? getGameModeRoutePath(nextMode, launchSession.launchCode) : getStudentActivityHubPath(launchSession.launchCode));
  const nextLabel = nextOffer?.label ?? (nextMode ? formatMode(nextMode) : "Activity hub");
  const nextSource = nextOffer ? "Reviewed offer map" : "Launch session";
  const statusLabel = currentComplete ? "Ready for next" : "Finish game";
  const summaryText = currentComplete
    ? `${formatMode(currentGameMode)} is complete. Open ${nextLabel} or return to the activity hub.`
    : `Finish ${formatMode(currentGameMode)} to record mastery before choosing the next activity.`;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Game complete path</p>
          <h3 className="text-lg font-bold">Next Activity</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText text={summaryText} label="Tap the next activity summary to hear it" className="text-sm" />
          </p>
        </div>
        <StatusPill label={statusLabel} tone={currentComplete ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        <CompletionFact label="Completed mode" value={formatMode(currentGameMode)} />
        <CompletionFact label={rewardName} value={currentComplete ? `+${earnedStarDust}` : "Pending"} />
        <CompletionFact label="Suggested next" value={nextLabel} />
        <CompletionFact label="Next source" value={nextSource} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <CompletionLink href={nextPath} label={currentComplete ? `Open ${nextLabel}` : "Complete current game first"} disabled={!currentComplete} />
        <CompletionLink href={getStudentActivityHubPath(launchSession.launchCode)} label="Activity hub" />
        <CompletionLink href={getTrainingAcademyPath(launchSession.launchCode)} label="Training Academy" />
      </div>
    </Card>
  );
}

function CompletionFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function CompletionLink({ href, label, disabled = false }: { href: string; label: string; disabled?: boolean }) {
  if (disabled) {
    return (
      <span className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] px-3 py-2 text-sm font-bold text-[var(--tenant-muted)]">
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-3 py-2 text-center text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
    >
      {label}
    </a>
  );
}

function findNextRecommendedMode(
  launchSession: LaunchSession,
  progression: StudentProgressionState,
  currentGameMode: GameModeId,
): GameModeId | undefined {
  const currentIndex = launchSession.recommendedNextModes.indexOf(currentGameMode);
  const searchStart = currentIndex >= 0 ? currentIndex + 1 : 0;
  const afterCurrent = launchSession.recommendedNextModes.slice(searchStart);
  const beforeCurrent = launchSession.recommendedNextModes.slice(0, Math.max(currentIndex, 0));
  const candidates = [...afterCurrent, ...beforeCurrent];

  return candidates.find((mode) => !progression.completedGameModes.includes(mode));
}

function findNextReviewedOffer(
  offerMap: UnitGameOfferMap | undefined,
  progression: StudentProgressionState,
  currentGameMode: GameModeId,
): UnitGameOffer | undefined {
  if (!offerMap) {
    return undefined;
  }

  const reviewedOffers = offerMap.offers
    .filter((offer) => offer.readiness === "ready")
    .filter((offer) => offer.availability !== "hidden" && offer.availability !== "blocked")
    .filter((offer) => offer.availability !== "teacher-only" && offer.availability !== "premium")
    .slice()
    .sort((first, second) => (first.recommendedOrder ?? 99) - (second.recommendedOrder ?? 99));
  const currentIndex = reviewedOffers.findIndex((offer) => offer.gameMode === currentGameMode);
  const searchStart = currentIndex >= 0 ? currentIndex + 1 : 0;
  const afterCurrent = reviewedOffers.slice(searchStart);
  const beforeCurrent = reviewedOffers.slice(0, Math.max(currentIndex, 0));
  const candidates = [...afterCurrent, ...beforeCurrent];

  return candidates.find((offer) => !progression.completedGameModes.includes(offer.gameMode));
}
