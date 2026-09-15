"use client";

import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId } from "@living-textbook/content-model";
import { AudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import { formatMode } from "../studentLabels";

interface NextGameUnlockCardProps {
  nextMode?: GameModeId;
  unlocked: boolean;
  audioReady: boolean;
  started: boolean;
  targetLanguage: string;
  onStart: () => void;
}

export function NextGameUnlockCard({ nextMode, unlocked, audioReady, started, targetLanguage, onStart }: NextGameUnlockCardProps) {
  const modeLabel = nextMode ? formatMode(nextMode) : "next game";
  const canStart = unlocked && audioReady;
  const statusMessage = started
    ? `${modeLabel} has started. Tap cards to hear and match the words.`
    : unlocked && !audioReady
      ? "Reviewed target-language audio is still needed before the next activity can open."
      : unlocked
      ? "The student can continue from flashcards into the next recommended game."
      : "The next game unlocks after flashcard practice is completed.";
  const actionText = started ? "Game started" : !audioReady && unlocked ? "Audio review required" : `Start ${modeLabel}`;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Next Game</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText text={nextMode ? modeLabel : "No next game assigned yet"} language={targetLanguage} label="Tap the next game label to hear it" className="text-sm" />
          </p>
        </div>
        <StatusPill
          label={started ? "Started" : !audioReady && unlocked ? "Audio review" : unlocked ? "Unlocked" : "Locked"}
          tone={started || canStart ? "success" : "warning"}
        />
      </div>
      <div className="mt-4 grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-semibold">
            {started ? `${modeLabel} started` : !audioReady && unlocked ? "Waiting for reviewed audio" : unlocked ? "Ready for the next activity" : "Waiting for entry practice"}
          </p>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText text={statusMessage} language={targetLanguage} label="Tap the next game message to hear it" className="text-sm" />
          </p>
        </div>
        <AudioSupportedAction
          audioText={actionText}
          audioLanguage={targetLanguage}
          onClick={onStart}
          disabled={!canStart || started || !nextMode}
          variant={canStart ? "primary" : "secondary"}
        >
          {actionText}
        </AudioSupportedAction>
      </div>
    </Card>
  );
}
