"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { createCanonicalGameReplaySeed } from "@living-textbook/content-model";
import type {
  AudioCue,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioCueButton, AudioCueText, playAudioCueText } from "@/features/audio/AudioCueButton";
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import {
  completeGameMode,
  createAudioRequestedEvent,
  createGameInteractionEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { calculateAccuracyBonusDust, getGameScoringProfileForMode } from "../scoringProfiles";
import { buildSentenceBuilderPreview } from "./textSpellingEngineAdapter";

interface SentenceBuilderPracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

const gameMode = "sentence-builder" as const;

export function SentenceBuilderPracticeGame({
  unit,
  launchSession,
  progression,
  audioCues = [],
  onEvent,
  onComplete,
}: SentenceBuilderPracticeGameProps) {
  const preview = useMemo(() => buildSentenceBuilderPreview(unit), [unit]);
  const scoringProfile = getGameScoringProfileForMode(gameMode);
  const replaySeed = createCanonicalGameReplaySeed({ unitKey: launchSession.unitKey, gameMode });
  const targetLanguage = unit.unitMeta.textbookReference?.language ?? "en";
  const startSentRef = useRef(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [completedRoundIds, setCompletedRoundIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Tap the words in order.");
  const [completionSent, setCompletionSent] = useState(false);
  const currentRound = preview.rounds[roundIndex] ?? preview.rounds[0];
  const completed = completedRoundIds.length === preview.rounds.length;
  const selectedTiles = currentRound
    ? selectedTileIds
        .map((tileId) => currentRound.tiles.find((tile) => tile.tileId === tileId))
        .filter(Boolean)
    : [];
  const remainingTiles = currentRound
    ? currentRound.tiles.filter((tile) => !selectedTileIds.includes(tile.tileId))
    : [];

  useEffect(() => {
    if (startSentRef.current) {
      return;
    }

    const event = startUnlockedGameMode({
      progression,
      launchSession,
      gameMode,
      occurredAt: new Date().toISOString(),
      replaySeed,
    });

    if (event) {
      startSentRef.current = true;
      onEvent?.(event);
    }
  }, [launchSession, onEvent, progression, replaySeed]);

  useEffect(() => {
    if (!currentRound || completedRoundIds.includes(currentRound.roundId)) {
      return;
    }

    emitInteractionEvent("round_shown", {
      roundId: currentRound.roundId,
      targetSentence: currentRound.targetSentence,
      tileCount: currentRound.tiles.length,
      textSpellingSkin: gameMode,
      replaySeed,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound?.roundId]);

  function emitInteractionEvent(
    type: "round_shown" | "answer_submitted" | "answer_result" | "mastery_updated",
    metadata: Record<string, string | number | boolean>,
  ) {
    onEvent?.(
      createGameInteractionEvent({
        type,
        progression,
        launchSession,
        gameMode,
        occurredAt: new Date().toISOString(),
        metadata,
      }),
    );
  }

  function emitAudioRequested(
    cueKind: "term" | "sentence" | "instruction" | "feedback",
    cueText: string,
    language: string,
    source: string,
  ) {
    onEvent?.(
      createAudioRequestedEvent({
        progression,
        launchSession,
        gameMode,
        occurredAt: new Date().toISOString(),
        cueKind,
        cueText,
        language,
        source,
      }),
    );
  }

  function handleTileSelect(tileId: string) {
    if (!currentRound || completed) {
      return;
    }

    const tile = currentRound.tiles.find((candidate) => candidate.tileId === tileId);

    if (!tile || completed) {
      return;
    }

    const tileCue = findAudioCue(audioCues, tile.label);
    const audioText = tileCue?.text ?? tile.audioText;
    const audioLanguage = tileCue?.language ?? targetLanguage;
    emitAudioRequested("term", audioText, audioLanguage, "sentence-builder-tile");
    playAudioCueText({ text: audioText, language: audioLanguage });
    setSelectedTileIds((ids) => [...ids, tileId]);
  }

  function handleTileRemove(tileId: string) {
    setSelectedTileIds((ids) => ids.filter((id) => id !== tileId));
  }

  function handleSubmit() {
    if (!currentRound || completed) {
      return;
    }

    const answer = selectedTiles.map((tile) => tile?.label ?? "");
    const correct = answersMatch(answer, currentRound.expectedAnswer);
    const nextAttempts = attempts + 1;

    setAttempts(nextAttempts);
    emitInteractionEvent("answer_submitted", {
      roundId: currentRound.roundId,
      answer: answer.join(" "),
      targetSentence: currentRound.targetSentence,
      attempts: nextAttempts,
      replaySeed,
    });
    emitInteractionEvent("answer_result", {
      roundId: currentRound.roundId,
      correct,
      attempts: nextAttempts,
      completedRounds: completedRoundIds.length,
      replaySeed,
    });

    if (!correct) {
      setFeedback("Try again. Listen and build the sentence.");
      return;
    }

    const nextCompletedRoundIds = Array.from(new Set([...completedRoundIds, currentRound.roundId]));
    setCompletedRoundIds(nextCompletedRoundIds);
    setFeedback("Correct sentence. Great work.");
    setSelectedTileIds([]);

    if (nextCompletedRoundIds.length < preview.rounds.length) {
      setRoundIndex((index) => index + 1);
      return;
    }

    if (!completionSent) {
      const earnedStarDust = calculateSentenceBuilderDust({
        attempts: nextAttempts,
        targetAttempts: preview.rounds.length,
        completedRounds: nextCompletedRoundIds.length,
      });
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        metadata: {
          parentEngine: preview.engineId,
          scoringProfileId: preview.scoringProfileId,
          completedRounds: nextCompletedRoundIds.length,
          attempts: nextAttempts,
          replaySeed,
        },
      });

      emitInteractionEvent("mastery_updated", {
        completed: true,
        earnedStarDust: result.earnedStarDust,
        completedRounds: nextCompletedRoundIds.length,
        attempts: nextAttempts,
        scoringProfileId: preview.scoringProfileId,
        replaySeed,
      });
      setCompletionSent(true);
      onComplete(result);
    }
  }

  function handleResetRound() {
    setSelectedTileIds([]);
    setFeedback("Tap the words in order.");
  }

  function calculateSentenceBuilderDust(args: {
    attempts: number;
    targetAttempts: number;
    completedRounds: number;
  }): number {
    if (!scoringProfile || args.completedRounds < preview.rounds.length) {
      return 0;
    }

    return calculateAccuracyBonusDust({
      attempts: args.attempts,
      targetAttempts: args.targetAttempts,
      profile: scoringProfile,
      minimumDust: scoringProfile.syntaxDust,
    });
  }

  if (!currentRound) {
    return (
      <Card>
        <h3 className="text-lg font-bold">Sentence Builder</h3>
        <p className="mt-2 text-sm text-[var(--tenant-muted)]">No sentence rounds are available for this unit.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Sentence Builder</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text="Tap the words in order. Listen before you submit."
              language={targetLanguage}
              label="Tap the Sentence Builder instruction to hear it"
              className="text-sm"
              onPlay={() =>
                emitAudioRequested(
                  "instruction",
                  "Tap the words in order. Listen before you submit.",
                  targetLanguage,
                  "sentence-builder-instruction",
                )
              }
            />
          </p>
        </div>
        <StatusPill label={completed ? "Complete" : `Round ${roundIndex + 1}/${preview.rounds.length}`} tone={completed ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <SentenceFact label="Engine" value={preview.engineId} />
        <SentenceFact label="Scoring" value={preview.scoringProfileId} />
        <SentenceFact label="Attempts" value={String(attempts)} />
        <SentenceFact label="Rounds" value={`${completedRoundIds.length}/${preview.rounds.length}`} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Target sentence</p>
            <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">
              <AudioCueText
                text={currentRound.targetSentence}
                language={targetLanguage}
                label="Tap the target sentence to hear it"
                className="text-sm font-bold"
                onPlay={() =>
                  emitAudioRequested(
                    "sentence",
                    currentRound.targetSentence,
                    targetLanguage,
                    "sentence-builder-target",
                  )
                }
              />
            </p>
          </div>
          <AudioCueButton
            text={currentRound.targetSentence}
            language={targetLanguage}
            label="Listen to the full target sentence"
            onPlay={() =>
              emitAudioRequested(
                "sentence",
                currentRound.targetSentence,
                targetLanguage,
                "sentence-builder-target-replay",
              )
            }
          />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-sm font-bold text-[var(--tenant-text)]">Your sentence</p>
        <div className="mt-3 flex min-h-14 flex-wrap gap-2 rounded-lg border border-dashed border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          {selectedTiles.length > 0 ? (
            selectedTiles.map((tile) => (
              <button
                key={tile?.tileId}
                type="button"
                onClick={() => tile && handleTileRemove(tile.tileId)}
                className="inline-flex min-h-10 items-center rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--tenant-text)]"
              >
                {tile?.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-[var(--tenant-muted)]">Choose tiles below.</p>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-sm font-bold text-[var(--tenant-text)]">Word tiles</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {remainingTiles.map((tile) => (
            <button
              key={tile.tileId}
              type="button"
              onClick={() => handleTileSelect(tile.tileId)}
              className="inline-flex min-h-11 items-center rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-4 py-2 text-sm font-semibold text-[var(--tenant-text)] transition hover:bg-[var(--tenant-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              {tile.label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          <AudioCueText
            text={feedback}
            language={targetLanguage}
            label="Tap the Sentence Builder feedback to hear it"
            className="text-sm font-semibold"
            onPlay={() => emitAudioRequested("feedback", feedback, targetLanguage, "sentence-builder-feedback")}
          />
        </p>
        <div className="flex flex-wrap gap-2">
          <AudioSupportedAction
            audioText="Reset sentence"
            onClick={handleResetRound}
            variant="secondary"
          >
            Reset
          </AudioSupportedAction>
          <AudioSupportedAction
            audioText="Submit sentence"
            onClick={handleSubmit}
            disabled={selectedTiles.length !== currentRound.expectedAnswer.length || completed}
          >
            Submit sentence
          </AudioSupportedAction>
        </div>
      </div>
    </Card>
  );
}

function SentenceFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function answersMatch(answer: string[], expected: string[]): boolean {
  return answer.map(normalize).join(" ") === expected.map(normalize).join(" ");
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findAudioCue(audioCues: AudioCue[], label: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === "term" && cue.text.trim().toLowerCase() === label.trim().toLowerCase());
}
