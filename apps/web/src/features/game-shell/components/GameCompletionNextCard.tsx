"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import {
  getBalloonPopPath,
  getFlashcardsPath,
  getLabelItPath,
  getMatchUpPath,
  getMemoryMatchPath,
  getQuizPath,
  getSentenceBuilderPath,
  getSpeakItPath,
  getSpellingPracticePath,
  getStudentActivityHubPath,
  getTrainingAcademyPath,
  getTypeAnswerPath,
  getTrueFalsePath,
} from "@/features/routes/routeContracts";
import { formatMode } from "@/lib/formatLabels";

interface GameCompletionNextCardProps {
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  currentGameMode: GameModeId;
  earnedStarDust: number;
  rewardName: string;
}

export function GameCompletionNextCard({
  launchSession,
  progression,
  currentGameMode,
  earnedStarDust,
  rewardName,
}: GameCompletionNextCardProps) {
  const currentComplete = progression.completedGameModes.includes(currentGameMode);
  const nextMode = findNextRecommendedMode(launchSession, progression, currentGameMode);
  const nextPath = nextMode ? getGamePath(nextMode, launchSession.launchCode) : getStudentActivityHubPath(launchSession.launchCode);
  const nextLabel = nextMode ? formatMode(nextMode) : "Activity hub";
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

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <CompletionFact label="Completed mode" value={formatMode(currentGameMode)} />
        <CompletionFact label={rewardName} value={currentComplete ? `+${earnedStarDust}` : "Pending"} />
        <CompletionFact label="Suggested next" value={nextLabel} />
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

function getGamePath(gameMode: GameModeId, launchCode: string): string {
  switch (gameMode) {
    case "flashcards":
      return getFlashcardsPath(launchCode);
    case "memory-match":
      return getMemoryMatchPath(launchCode);
    case "match-up":
      return getMatchUpPath(launchCode);
    case "label-it":
      return getLabelItPath(launchCode);
    case "quiz":
      return getQuizPath(launchCode);
    case "true-false":
      return getTrueFalsePath(launchCode);
    case "type-answer":
      return getTypeAnswerPath(launchCode);
    case "spelling-practice":
      return getSpellingPracticePath(launchCode);
    case "sentence-builder":
      return getSentenceBuilderPath(launchCode);
    case "speak-it":
      return getSpeakItPath(launchCode);
    case "balloon-pop":
      return getBalloonPopPath(launchCode);
  }
}
