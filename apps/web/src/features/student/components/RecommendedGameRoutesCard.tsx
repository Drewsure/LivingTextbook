"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId, LaunchSession, StudentProgressionState } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import {
  getQuizPath,
  getSentenceBuilderPath,
  getSpeakItPath,
  getStudentLaunchPath,
} from "@/features/routes/routeContracts";
import { formatMode } from "../studentLabels";

interface RecommendedGameRoutesCardProps {
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function RecommendedGameRoutesCard({ launchSession, progression }: RecommendedGameRoutesCardProps) {
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {recommendedRoutes.map((route) => (
          <a
            key={route.mode}
            href={route.unlocked ? route.href : "#"}
            aria-disabled={!route.unlocked}
            className={`rounded-lg border p-3 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
              route.unlocked
                ? "border-[var(--tenant-border)] bg-[var(--tenant-surface)] hover:bg-[var(--tenant-primary-soft)]"
                : "pointer-events-none border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] opacity-70"
            }`}
          >
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-[var(--tenant-text)]">
                {route.order}. {formatMode(route.mode)}
              </span>
              <StatusPill label={route.completed ? "Complete" : route.unlocked ? "Ready" : "Locked"} tone={route.unlocked ? "success" : "warning"} />
            </span>
            <span className="mt-2 block leading-5 text-[var(--tenant-muted)]">{route.summary}</span>
            <span className="mt-2 block break-all text-xs font-semibold text-[var(--tenant-muted)]">{route.unlocked ? route.href : "Finish flashcards to unlock."}</span>
          </a>
        ))}
      </div>
    </Card>
  );
}

function getModePath(mode: GameModeId, launchCode: string): string {
  if (mode === "quiz") {
    return getQuizPath(launchCode);
  }

  if (mode === "sentence-builder") {
    return getSentenceBuilderPath(launchCode);
  }

  if (mode === "speak-it") {
    return getSpeakItPath(launchCode);
  }

  return getStudentLaunchPath(launchCode);
}

function getModeSummary(mode: GameModeId): string {
  if (mode === "memory-match") {
    return "Play inside this launch page first. Match vocabulary cards with tap-to-hear support.";
  }

  if (mode === "quiz") {
    return "Open the selection-engine quiz with audio-supported prompts and answer choices.";
  }

  if (mode === "sentence-builder") {
    return "Open the text-spelling route and build reviewed target sentences.";
  }

  if (mode === "speak-it") {
    return "Open teacher-controlled listening and local record/replay practice.";
  }

  return "Open this reviewed game route.";
}
