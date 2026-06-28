"use client";

import { Button, Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameModeId,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioCueButton } from "@/features/audio/AudioCueButton";
import { formatLabel, formatMode } from "../studentLabels";
import type { TenantConfig } from "@/features/tenant/types";

interface FlashcardPracticeCardProps {
  tenant: TenantConfig;
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  entryComplete: boolean;
  lastEarnedDust: number;
  nextMode?: GameModeId;
  audioCues?: AudioCue[];
  onComplete: () => void;
}

export function FlashcardPracticeCard({
  tenant,
  unit,
  launchSession,
  progression,
  entryComplete,
  lastEarnedDust,
  nextMode,
  audioCues = [],
  onComplete,
}: FlashcardPracticeCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Flashcard Practice</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            Practice all {unit.pedagogicalPayload.vocabularyTerms.length} words to open the next game.
          </p>
        </div>
        <StatusPill label={formatLabel(progression.masteryStatus)} tone={entryComplete ? "success" : "neutral"} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {unit.pedagogicalPayload.vocabularyTerms.map((term) => {
          const audioCue = findAudioCue(audioCues, "term", term);

          return (
            <div
              key={term}
              className="grid min-h-24 gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-center"
            >
              <span className="self-end text-lg font-bold">{term}</span>
              <AudioCueButton text={audioCue?.text ?? term} language={audioCue?.language ?? "en"} label={`Listen to ${term}`} compact />
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-sm font-semibold">Target sentences</p>
        <div className="mt-3 grid gap-3">
          {unit.pedagogicalPayload.targetSentences.map((sentence) => {
            const audioCue = findAudioCue(audioCues, "sentence", sentence);

            return (
              <div key={sentence} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[var(--tenant-primary-soft)] p-3">
                <span className="text-sm font-semibold text-[var(--tenant-text)]">{sentence}</span>
                <AudioCueButton text={audioCue?.text ?? sentence} language={audioCue?.language ?? "en"} label={`Listen to ${sentence}`} compact />
              </div>
            );
          })}
        </div>
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
        <Button onClick={onComplete} disabled={entryComplete}>
          {entryComplete ? "Practice complete" : "Mark practice complete"}
        </Button>
      </div>
    </Card>
  );
}

function findAudioCue(audioCues: AudioCue[], kind: AudioCue["kind"], text: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.text.trim().toLowerCase() === text.trim().toLowerCase());
}
