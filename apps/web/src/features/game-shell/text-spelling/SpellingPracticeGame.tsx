"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
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
  createGameInteractionEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { calculateAccuracyBonusDust, getGameScoringProfileForMode } from "../scoringProfiles";

interface SpellingPracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

interface SpellingLetterTile {
  tileId: string;
  label: string;
  spokenText: string;
  expectedOrder: number;
}

interface SpellingRound {
  roundId: string;
  promptText: string;
  targetTerm: string;
  normalizedAnswer: string;
  letterBank: SpellingLetterTile[];
}

const gameMode = "spelling-practice" as const;
const scoringProfileId = "spelling-typing-v1";
const instructionText = "Listen to the word. Tap the letters in order.";

export function SpellingPracticeGame({
  unit,
  launchSession,
  progression,
  audioCues = [],
  onEvent,
  onComplete,
}: SpellingPracticeGameProps) {
  const rounds = useMemo(() => buildSpellingRounds(unit), [unit]);
  const scoringProfile = getGameScoringProfileForMode(gameMode);
  const startEventSent = useRef(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<SpellingLetterTile[]>([]);
  const [completedRoundIds, setCompletedRoundIds] = useState<string[]>([]);
  const [correctRoundIds, setCorrectRoundIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Listen first. Then tap the letters.");
  const [completionSent, setCompletionSent] = useState(false);
  const currentRound = rounds[roundIndex] ?? rounds[0];
  const completed = rounds.length > 0 && completedRoundIds.length === rounds.length;

  useEffect(() => {
    if (startEventSent.current) {
      return;
    }

    startEventSent.current = true;
    const event = startUnlockedGameMode({
      progression,
      launchSession,
      gameMode,
      occurredAt: new Date().toISOString(),
    });

    if (event) {
      onEvent?.(event);
    }
  }, [launchSession, onEvent, progression]);

  useEffect(() => {
    if (!currentRound || completedRoundIds.includes(currentRound.roundId)) {
      return;
    }

    emitInteractionEvent("round_shown", {
      roundId: currentRound.roundId,
      promptText: currentRound.promptText,
      targetTermLength: currentRound.normalizedAnswer.length,
      textSpellingSkin: gameMode,
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

  function handleSelectTile(tile: SpellingLetterTile) {
    if (completed || selectedTiles.some((selected) => selected.tileId === tile.tileId)) {
      return;
    }

    setSelectedTiles((tiles) => [...tiles, tile]);
    playAudioCueText({ text: tile.spokenText, language: "en" });
  }

  function handleRemoveSelectedTile(tile: SpellingLetterTile) {
    if (completed) {
      return;
    }

    setSelectedTiles((tiles) => tiles.filter((selected) => selected.tileId !== tile.tileId));
    playAudioCueText({ text: tile.spokenText, language: "en" });
  }

  function handleClear() {
    setSelectedTiles([]);
    setFeedback("Cleared. Listen again and tap the letters.");
    playAudioCueText({ text: "Cleared. Listen again and tap the letters.", language: "en" });
  }

  function handleSubmit() {
    if (!currentRound || completed) {
      return;
    }

    const submittedAnswer = selectedTiles.map((tile) => tile.label).join("");
    const correct = submittedAnswer === currentRound.normalizedAnswer;
    const nextAttempts = attempts + 1;

    setAttempts(nextAttempts);
    emitInteractionEvent("answer_submitted", {
      roundId: currentRound.roundId,
      answer: submittedAnswer,
      expectedAnswer: currentRound.normalizedAnswer,
      attempts: nextAttempts,
      targetLanguageAttempt: true,
      supportLanguageUnlockAllowed: false,
    });
    emitInteractionEvent("answer_result", {
      roundId: currentRound.roundId,
      correct,
      attempts: nextAttempts,
      completedRounds: completedRoundIds.length,
      textSpellingSkin: gameMode,
    });

    if (!correct) {
      setFeedback("Try again. Listen and check the letter order.");
      playAudioCueText({ text: "Try again. Listen and check the letter order.", language: "en" });
      return;
    }

    const nextCompletedRoundIds = Array.from(new Set([...completedRoundIds, currentRound.roundId]));
    const nextCorrectRoundIds = Array.from(new Set([...correctRoundIds, currentRound.roundId]));

    setCompletedRoundIds(nextCompletedRoundIds);
    setCorrectRoundIds(nextCorrectRoundIds);
    setFeedback("Correct spelling. Next word.");
    setSelectedTiles([]);
    playAudioCueText({ text: "Correct spelling. Next word.", language: "en" });

    if (nextCompletedRoundIds.length < rounds.length) {
      setRoundIndex((index) => index + 1);
      return;
    }

    if (!completionSent) {
      const earnedStarDust = calculateSpellingDust({
        attempts: nextAttempts,
        correctRounds: nextCorrectRoundIds.length,
        totalRounds: rounds.length,
      });
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        metadata: {
          parentEngine: "text-spelling",
          scoringProfileId,
          completedRounds: nextCompletedRoundIds.length,
          correctRounds: nextCorrectRoundIds.length,
          attempts: nextAttempts,
          textSpellingSkin: gameMode,
        },
      });

      setFeedback(`Spelling Practice complete. You spelled ${nextCorrectRoundIds.length} of ${rounds.length} words correctly.`);
      emitInteractionEvent("mastery_updated", {
        completed: true,
        earnedStarDust,
        completedRounds: nextCompletedRoundIds.length,
        correctRounds: nextCorrectRoundIds.length,
        scoringProfileId,
        supportLanguageUnlockAllowed: false,
      });
      setCompletionSent(true);
      onComplete(result);
    }
  }

  function calculateSpellingDust(args: { attempts: number; correctRounds: number; totalRounds: number }): number {
    if (!scoringProfile || args.correctRounds === 0) {
      return 0;
    }

    const accuracyDust = calculateAccuracyBonusDust({
      attempts: args.attempts,
      targetAttempts: args.totalRounds,
      profile: scoringProfile,
      minimumDust: scoringProfile.vocabularyDust,
    });
    const correctnessRatio = args.correctRounds / Math.max(args.totalRounds, 1);

    return Math.min(scoringProfile.completionDustCap, Math.round(accuracyDust * correctnessRatio));
  }

  if (!currentRound) {
    return (
      <Card>
        <h3 className="text-lg font-bold">Spelling Practice</h3>
        <p className="mt-2 text-sm text-[var(--tenant-muted)]">No vocabulary rounds are available for this unit.</p>
      </Card>
    );
  }

  const availableTiles = currentRound.letterBank.filter(
    (tile) => !selectedTiles.some((selected) => selected.tileId === tile.tileId),
  );
  const promptAudioText = findAudioText(audioCues, currentRound.targetTerm);
  const gameInstructionText = findInstructionText(audioCues);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Spelling Practice</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text={gameInstructionText}
              language="en"
              label="Tap the Spelling Practice instruction to hear it"
              className="text-sm"
            />
          </p>
        </div>
        <StatusPill label={completed ? "Complete" : `Round ${roundIndex + 1}/${rounds.length}`} tone={completed ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <SpellingFact label="Engine" value="text-spelling" />
        <SpellingFact label="Scoring" value={scoringProfileId} />
        <SpellingFact label="Correct" value={`${correctRoundIds.length}/${rounds.length}`} />
        <SpellingFact label="Attempts" value={String(attempts)} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Listen word</p>
            <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">
              <AudioCueText
                text="Listen to the word."
                language="en"
                label="Tap the Spelling Practice prompt instruction to hear it"
                className="text-sm font-bold"
              />
            </p>
          </div>
          <AudioCueButton text={promptAudioText} language="en" label="Listen to the Spelling Practice word" />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold text-[var(--tenant-text)]">
            <AudioCueText text="Build the spelling." language="en" label="Tap the spelling answer area label to hear it" className="text-sm font-bold" />
          </p>
          <StatusPill label={`${selectedTiles.length}/${currentRound.normalizedAnswer.length} letters`} tone="neutral" />
        </div>
        <div className="mt-3 flex min-h-16 flex-wrap gap-2 rounded-lg border border-dashed border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
          {selectedTiles.length === 0 ? (
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Tap letters below.</p>
          ) : (
            selectedTiles.map((tile) => (
              <button
                key={`selected-${tile.tileId}`}
                type="button"
                onClick={() => handleRemoveSelectedTile(tile)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-3 py-2 text-lg font-bold uppercase text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
              >
                {tile.label}
              </button>
            ))
          )}
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-sm font-bold text-[var(--tenant-text)]">
          <AudioCueText text="Letter bank." language="en" label="Tap the letter bank label to hear it" className="text-sm font-bold" />
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {availableTiles.map((tile) => (
            <button
              key={tile.tileId}
              type="button"
              onClick={() => handleSelectTile(tile)}
              disabled={completed}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-lg font-bold uppercase text-[var(--tenant-text)] transition hover:bg-[var(--tenant-primary-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] disabled:opacity-70"
            >
              {tile.label}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          <AudioCueText text={feedback} language="en" label="Tap the Spelling Practice feedback to hear it" className="text-sm font-semibold" />
        </p>
        <div className="flex flex-wrap gap-2">
          <AudioCueButton text={promptAudioText} language="en" label="Replay Spelling Practice word before submitting" />
          <AudioSupportedAction
            audioText="Clear letters"
            onClick={handleClear}
            disabled={selectedTiles.length === 0 || completed}
            variant="secondary"
          >
            Clear
          </AudioSupportedAction>
          <AudioSupportedAction
            audioText="Submit spelling"
            onClick={handleSubmit}
            disabled={selectedTiles.length !== currentRound.normalizedAnswer.length || completed}
          >
            Submit spelling
          </AudioSupportedAction>
        </div>
      </div>
    </Card>
  );
}

function buildSpellingRounds(unit: UnitPayload): SpellingRound[] {
  return unit.pedagogicalPayload.vocabularyTerms
    .slice(0, 6)
    .map((term, index) => {
      const normalizedAnswer = normalizeSpelling(term);
      const letters = normalizedAnswer.split("");

      return {
        roundId: `spelling-practice-${index + 1}`,
        promptText: "Listen to the word. Tap the letters in order.",
        targetTerm: term,
        normalizedAnswer,
        letterBank: deterministicLetterBank(letters, index),
      };
    })
    .filter((round) => round.normalizedAnswer.length > 0);
}

function deterministicLetterBank(letters: string[], roundIndex: number): SpellingLetterTile[] {
  return letters
    .map((letter, index) => ({
      tileId: `spelling-${roundIndex + 1}-letter-${index + 1}-${letter}`,
      label: letter,
      spokenText: `letter ${letter}`,
      expectedOrder: index + 1,
      sortWeight: ((letter.charCodeAt(0) + 7) * (index + 3) + roundIndex * 11) % 97,
    }))
    .sort((left, right) => left.sortWeight - right.sortWeight || right.expectedOrder - left.expectedOrder)
    .map(({ sortWeight: _sortWeight, ...tile }) => tile);
}

function SpellingFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function normalizeSpelling(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findInstructionText(audioCues: AudioCue[]): string {
  return audioCues.find((cue) => cue.kind === "instruction" && cue.gameMode === gameMode)?.text ?? instructionText;
}

function findAudioText(audioCues: AudioCue[], label: string): string {
  return audioCues.find((cue) => cue.text.trim().toLowerCase() === label.trim().toLowerCase())?.text ?? label;
}
