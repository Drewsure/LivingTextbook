"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import { formatMode } from "../studentLabels";

interface NextGameUnlockCardProps {
  nextMode?: GameModeId;
  unlocked: boolean;
  started: boolean;
  onStart: () => void;
}

export function NextGameUnlockCard({ nextMode, unlocked, started, onStart }: NextGameUnlockCardProps) {
  const modeLabel = nextMode ? formatMode(nextMode) : "next game";
  const statusMessage = started
    ? `${modeLabel} has started. Tap cards to hear and match the words.`
    : unlocked
      ? "The student can continue from flashcards into the next recommended game."
      : "The next game unlocks after flashcard practice is completed.";
  const actionText = started ? "Game started" : `Start ${modeLabel}`;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Next Game</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText text={nextMode ? modeLabel : "No next game assigned yet"} label="Tap the next game label to hear it" className="text-sm" />
          </p>
        </div>
        <StatusPill label={started ? "Started" : unlocked ? "Unlocked" : "Locked"} tone={unlocked ? "success" : "warning"} />
      </div>
      <div className="mt-4 grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">
            {started ? `${modeLabel} started` : unlocked ? "Ready for the next activity" : "Waiting for entry practice"}
          </p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText text={statusMessage} label="Tap the next game message to hear it" className="text-sm" />
          </p>
        </div>
        <AudioSupportedAction
          audioText={actionText}
          onClick={onStart}
          disabled={!unlocked || started || !nextMode}
          variant={unlocked ? "primary" : "secondary"}
        >
          {actionText}
        </AudioSupportedAction>
      </div>
    </Card>
  );
}
