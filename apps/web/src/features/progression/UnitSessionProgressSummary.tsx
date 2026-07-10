"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type { GameProgressEvent, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { formatMode } from "@/lib/formatLabels";

interface UnitSessionProgressSummaryProps {
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  events: GameProgressEvent[];
  rewardName: string;
  mediaAssetCount?: number;
  title?: string;
}

export function UnitSessionProgressSummary({
  launchSession,
  progression,
  events,
  rewardName,
  mediaAssetCount = 0,
  title = "Unit Progress",
}: UnitSessionProgressSummaryProps) {
  const entryComplete = progression.completedGameModes.includes(launchSession.entryMode);
  const nextMode = launchSession.recommendedNextModes[0];
  const nextModeUnlocked = Boolean(nextMode && progression.unlockedGameModes.includes(nextMode));
  const nextModeStarted = Boolean(nextMode && events.some((event) => event.type === "game_started" && event.gameMode === nextMode));
  const nextModeComplete = Boolean(nextMode && progression.completedGameModes.includes(nextMode));
  const mediaStarted = countEvents(events, "media_started");
  const mediaPaused = countEvents(events, "media_paused");
  const mediaCompleted = countEvents(events, "media_completed");
  const targetLanguageEngagedItems = sumMetadataNumber(events, "targetLanguageEngagedItems");
  const requiredTargetLanguageItems = maxMetadataNumber(events, "requiredTargetLanguageItems");
  const supportLanguageUnlockEvents = countMetadataBoolean(events, "supportLanguageUnlockAllowed", true);
  const latestBackgroundEvent = [...events]
    .reverse()
    .find((event) => event.type === "background_media_enabled" || event.type === "background_media_disabled");
  const backgroundStatus = latestBackgroundEvent?.type === "background_media_enabled" ? "Enabled" : latestBackgroundEvent ? "Disabled" : "Not started";
  const summaryText = createSummaryText({
    entryComplete,
    nextMode,
    nextModeStarted,
    nextModeComplete,
    rewardName,
    earnedStarDust: progression.earnedStarDust,
  });

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Session state</p>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText text={summaryText} label="Tap the session summary to hear it" className="text-sm" />
          </p>
        </div>
        <StatusPill label={nextModeComplete ? "Game complete" : entryComplete ? "In progress" : "Practice ready"} tone={nextModeComplete ? "success" : "neutral"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ProgressStep
          label={formatMode(launchSession.entryMode)}
          status={entryComplete ? "Complete" : "Ready"}
          detail="Entry practice unlocks the next activity."
          tone={entryComplete ? "success" : "neutral"}
        />
        <ProgressStep
          label={nextMode ? formatMode(nextMode) : "Next game"}
          status={nextModeComplete ? "Complete" : nextModeStarted ? "Playing" : nextModeUnlocked ? "Unlocked" : "Locked"}
          detail={nextMode ? "First playable post-flashcard game." : "No next game is assigned yet."}
          tone={nextModeComplete ? "success" : nextModeUnlocked ? "neutral" : "warning"}
        />
        <ProgressStep
          label="Unit media"
          status={mediaAssetCount > 0 ? `${mediaCompleted}/${mediaAssetCount} complete` : `${mediaCompleted} complete`}
          detail={`${mediaStarted} started and ${mediaPaused} paused in this local session.`}
          tone={mediaCompleted > 0 ? "success" : "neutral"}
        />
        <ProgressStep
          label="Background media"
          status={backgroundStatus}
          detail="Optional support media is tracked separately from game mastery."
          tone={backgroundStatus === "Enabled" ? "success" : "neutral"}
        />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <SummaryFact label={rewardName} value={String(progression.earnedStarDust)} />
        <SummaryFact label="Completed modes" value={String(progression.completedGameModes.length)} />
        <SummaryFact label="Events" value={String(events.length)} />
        <SummaryFact
          label="English listened"
          value={requiredTargetLanguageItems > 0 ? `${targetLanguageEngagedItems}/${requiredTargetLanguageItems}` : String(targetLanguageEngagedItems)}
        />
        <SummaryFact label="Support unlocks" value={String(supportLanguageUnlockEvents)} />
      </dl>
    </Card>
  );
}

function ProgressStep({
  label,
  status,
  detail,
  tone,
}: {
  label: string;
  status: string;
  detail: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm font-bold text-[var(--tenant-text)]">{label}</p>
        <StatusPill label={status} tone={tone} />
      </div>
      <p className="mt-2 text-sm text-[var(--tenant-muted)]">{detail}</p>
    </div>
  );
}

function SummaryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function countEvents(events: GameProgressEvent[], type: GameProgressEvent["type"]): number {
  return events.filter((event) => event.type === type).length;
}

function sumMetadataNumber(events: GameProgressEvent[], key: string): number {
  return events.reduce((total, event) => {
    const value = event.metadata?.[key];
    return typeof value === "number" ? total + value : total;
  }, 0);
}

function maxMetadataNumber(events: GameProgressEvent[], key: string): number {
  return events.reduce((max, event) => {
    const value = event.metadata?.[key];
    return typeof value === "number" ? Math.max(max, value) : max;
  }, 0);
}

function countMetadataBoolean(events: GameProgressEvent[], key: string, expected: boolean): number {
  return events.filter((event) => event.metadata?.[key] === expected).length;
}

function createSummaryText({
  entryComplete,
  nextMode,
  nextModeStarted,
  nextModeComplete,
  rewardName,
  earnedStarDust,
}: {
  entryComplete: boolean;
  nextMode?: string;
  nextModeStarted: boolean;
  nextModeComplete: boolean;
  rewardName: string;
  earnedStarDust: number;
}): string {
  if (nextModeComplete && nextMode) {
    return `${formatMode(nextMode)} is complete. You have ${earnedStarDust} ${rewardName}.`;
  }

  if (nextModeStarted && nextMode) {
    return `${formatMode(nextMode)} is in progress. Keep matching and listening.`;
  }

  if (entryComplete && nextMode) {
    return `${formatMode(nextMode)} is unlocked. You have ${earnedStarDust} ${rewardName}.`;
  }

  return "Start with flashcards. Listen to each word, then open the next activity.";
}
