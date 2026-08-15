"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";
import { AudioCueButton, AudioCueText } from "@/features/audio/AudioCueButton";
import {
  getBalloonPopPath,
  getLabelItPath,
  getMatchUpPath,
  getStudentActivityHubPath,
  getMemoryMatchPath,
  getQuizPath,
  getSentenceBuilderPath,
  getSpeakItPath,
  getStudentLaunchPath,
  getTypeAnswerPath,
  getTrueFalsePath,
} from "@/features/routes/routeContracts";
import { formatMode } from "../studentLabels";

interface RecommendedGameRoutesCardProps {
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  onRouteGuidanceListened?: (mode: GameModeId, routeStatus: "locked" | "unlocked" | "complete", routeHref: string) => void;
}

export function RecommendedGameRoutesCard({ launchSession, progression, onRouteGuidanceListened }: RecommendedGameRoutesCardProps) {
  const recommendedRoutes = launchSession.recommendedNextModes.map((mode, index) => ({
    mode,
    order: index + 1,
    href: getModePath(mode, launchSession.launchCode),
    unlocked: progression.unlockedGameModes.includes(mode),
    completed: progression.completedGameModes.includes(mode),
    summary: getModeSummary(mode),
  }));

  if (recommendedRoutes.length === 0) {
    return null;
  }

  const unlockedCount = recommendedRoutes.filter((route) => route.unlocked).length;
  const activityHubPath = getStudentActivityHubPath(launchSession.launchCode);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Recommended Game Path</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text="Complete flashcards first. Then choose the next activity your teacher wants you to play."
              label="Tap the recommended game path instruction to hear it"
              className="text-sm"
            />
          </p>
        </div>
        <StatusPill label={`${unlockedCount}/${recommendedRoutes.length} unlocked`} tone={unlockedCount > 0 ? "success" : "warning"} />
      </div>

      <div className="mt-4 grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-bold text-[var(--tenant-text)]">Reviewed activity hub</p>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text="Open the reviewed activity hub to see all teacher-approved practice routes for this unit."
              label="Tap the activity hub route guidance to hear it"
              className="text-sm"
            />
          </p>
          <p className="mt-2 break-all text-xs font-semibold text-[var(--tenant-muted)]">{activityHubPath}</p>
        </div>
        <a
          href={activityHubPath}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open activity hub
        </a>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {recommendedRoutes.map((route) => {
          const listenText = `${formatMode(route.mode)}. ${route.summary}`;

          return (
            <div
              key={route.mode}
              className={`rounded-lg border p-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
                route.unlocked
                  ? "border-[var(--tenant-border)] bg-[var(--tenant-surface)]"
                  : "border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] opacity-80"
              }`}
            >
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-[var(--tenant-text)]">
                  {route.order}. {formatMode(route.mode)}
                </span>
                <StatusPill label={route.completed ? "Complete" : route.unlocked ? "Ready" : "Locked"} tone={route.unlocked ? "success" : "warning"} />
              </span>
              <span className="mt-2 block leading-5 text-[var(--tenant-muted)]">{route.summary}</span>
              <span className="mt-3 flex flex-wrap items-center gap-2">
                <AudioCueButton
                  text={listenText}
                  label={`Listen to ${formatMode(route.mode)} route`}
                  compact
                  onPlay={() =>
                    onRouteGuidanceListened?.(
                      route.mode,
                      route.completed ? "complete" : route.unlocked ? "unlocked" : "locked",
                      route.href,
                    )
                  }
                />
                {route.unlocked ? (
                  <a
                    href={route.href}
                    className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
                  >
                    Open
                  </a>
                ) : (
                  <span className="inline-flex min-h-10 items-center rounded-lg border border-[var(--tenant-border)] px-3 py-2 text-sm font-semibold text-[var(--tenant-muted)]">
                    Finish flashcards
                  </span>
                )}
              </span>
              <span className="mt-2 block break-all text-xs font-semibold text-[var(--tenant-muted)]">{route.unlocked ? route.href : "Finish flashcards to unlock."}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function getModePath(mode: GameModeId, launchCode: string): string {
  if (mode === "memory-match") {
    return getMemoryMatchPath(launchCode);
  }

  if (mode === "match-up") {
    return getMatchUpPath(launchCode);
  }

  if (mode === "label-it") {
    return getLabelItPath(launchCode);
  }

  if (mode === "quiz") {
    return getQuizPath(launchCode);
  }

  if (mode === "true-false") {
    return getTrueFalsePath(launchCode);
  }

  if (mode === "type-answer") {
    return getTypeAnswerPath(launchCode);
  }

  if (mode === "sentence-builder") {
    return getSentenceBuilderPath(launchCode);
  }

  if (mode === "balloon-pop") {
    return getBalloonPopPath(launchCode);
  }

  if (mode === "speak-it") {
    return getSpeakItPath(launchCode);
  }

  return getStudentLaunchPath(launchCode);
}

function getModeSummary(mode: GameModeId): string {
  if (mode === "memory-match") {
    return "Open the pairing route and match vocabulary cards with tap-to-hear support.";
  }

  if (mode === "match-up") {
    return "Open the visible pairing route and match listening prompts to vocabulary word cards.";
  }

  if (mode === "label-it") {
    return "Open the image-label route and place reviewed labels on picture points with target-language audio.";
  }

  if (mode === "quiz") {
    return "Open the selection-engine quiz with audio-supported prompts and answer choices.";
  }

  if (mode === "true-false") {
    return "Open the selection-engine true or false route and decide if the listened word matches the card.";
  }

  if (mode === "type-answer") {
    return "Open the text-spelling typing route and type the word after hearing the target-language prompt.";
  }

  if (mode === "sentence-builder") {
    return "Open the text-spelling route and build reviewed target sentences.";
  }

  if (mode === "balloon-pop") {
    return "Open the arcade selection route and pop matching vocabulary balloons.";
  }

  if (mode === "speak-it") {
    return "Open teacher-controlled listening and local record/replay practice.";
  }

  return "Open this reviewed game route.";
}
