"use client";

import { useState } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";
import type {
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { completeFlashcardEntryPractice } from "@/features/progression/localProgressionAdapter";
import type { TenantConfig } from "@/features/tenant/types";

interface StudentLaunchFlowProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
}

export function StudentLaunchFlow({ tenant, unit, launchSession, progression }: StudentLaunchFlowProps) {
  const [currentProgression, setCurrentProgression] = useState(progression);
  const [sessionEvents, setSessionEvents] = useState<GameProgressEvent[]>([]);
  const [lastEarnedDust, setLastEarnedDust] = useState(0);

  const entryComplete = currentProgression.completedGameModes.includes(launchSession.entryMode);
  const nextMode = launchSession.recommendedNextModes[0];
  const nextModeUnlocked = launchSession.recommendedNextModes.some((mode) =>
    currentProgression.unlockedGameModes.includes(mode),
  );

  function handleCompleteEntryPractice() {
    const result = completeFlashcardEntryPractice({
      progression: currentProgression,
      launchSession,
      unit,
      occurredAt: new Date().toISOString(),
    });

    setCurrentProgression(result.progression);
    setSessionEvents((events) => [...events, ...result.events]);
    setLastEarnedDust(result.dust.total);
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">
              Launch code {launchSession.launchCode}
            </p>
            <h2 className="mt-1 text-2xl font-bold">{tenant.displayName} practice entry</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              Start with {formatMode(launchSession.entryMode)}, then open {nextMode ? formatMode(nextMode) : "the next game"}.
            </p>
          </div>
          <StatusPill label={entryComplete ? "Practice complete" : "QR ready"} tone={entryComplete ? "success" : "neutral"} />
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <ProgressFact label="Current step" value={formatLabel(currentProgression.currentStep)} />
          <ProgressFact label="Unlocked games" value={String(currentProgression.unlockedGameModes.length)} />
          <ProgressFact label={tenant.rewardName} value={String(currentProgression.earnedStarDust)} />
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Flashcard Practice</h3>
            <p className="mt-1 text-sm text-[var(--tenant-muted)]">
              Practice all {unit.pedagogicalPayload.vocabularyTerms.length} words to open the next game.
            </p>
          </div>
          <StatusPill label={formatLabel(currentProgression.masteryStatus)} tone={entryComplete ? "success" : "neutral"} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {unit.pedagogicalPayload.vocabularyTerms.map((term) => (
            <div
              key={term}
              className="flex min-h-20 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-center text-lg font-bold"
            >
              {term}
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 rounded-lg border border-[var(--tenant-border)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-sm font-semibold">Entry practice</p>
            <p className="mt-1 text-sm text-[var(--tenant-muted)]">
              {entryComplete
                ? `${formatMode(launchSession.entryMode)} is complete. ${nextMode ? `${formatMode(nextMode)} is ready.` : "The next activity is ready."}`
                : "Finish this starter practice to open the next activity."}
            </p>
            {lastEarnedDust > 0 && (
              <p className="mt-2 text-sm font-semibold text-[var(--tenant-text)]">
                +{lastEarnedDust} {tenant.rewardName}
              </p>
            )}
          </div>
          <Button onClick={handleCompleteEntryPractice} disabled={entryComplete}>
            {entryComplete ? "Practice complete" : "Mark practice complete"}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Next Game</h3>
            <p className="mt-1 text-sm text-[var(--tenant-muted)]">
              {nextMode ? formatMode(nextMode) : "No next game assigned yet"}
            </p>
          </div>
          <StatusPill label={nextModeUnlocked ? "Unlocked" : "Locked"} tone={nextModeUnlocked ? "success" : "warning"} />
        </div>
        <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <p className="text-sm font-semibold">
            {nextModeUnlocked ? "Ready for the next activity" : "Waiting for entry practice"}
          </p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            {nextModeUnlocked
              ? "The student can continue from flashcards into the next recommended game."
              : "The next game unlocks after flashcard practice is completed."}
          </p>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Progress Summary</h3>
            <p className="mt-1 text-sm text-[var(--tenant-muted)]">
              This session has recorded {sessionEvents.length} update{sessionEvents.length === 1 ? "" : "s"}.
            </p>
          </div>
          <StatusPill label={sessionEvents.length > 0 ? "Updated" : "Waiting"} tone={sessionEvents.length > 0 ? "success" : "neutral"} />
        </div>
        <div className="mt-4 grid gap-3">
          {sessionEvents.length === 0 ? (
            <p className="rounded-lg border border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
              Complete the flashcards to record the first progress update.
            </p>
          ) : (
            sessionEvents.map((event) => (
              <div key={`${event.type}-${event.gameMode}`} className="rounded-lg border border-[var(--tenant-border)] p-4">
                <p className="text-sm font-semibold">{formatLabel(event.type)}</p>
                <p className="mt-1 text-sm text-[var(--tenant-muted)]">{formatMode(event.gameMode)}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function ProgressFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  );
}

function formatMode(value: string): string {
  return formatLabel(value);
}

function formatLabel(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
