"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioCueButton, AudioCueText, playAudioCueText } from "@/features/audio/AudioCueButton";
import {
  completeGameMode,
  createGameInteractionEvent,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { calculateAccuracyBonusDust, getGameScoringProfileForMode } from "../scoringProfiles";
import { buildSelectionEnginePreview } from "./selectionEngineAdapter";

interface QuizPracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

const gameMode = "quiz";

export function QuizPracticeGame({
  unit,
  launchSession,
  progression,
  audioCues = [],
  onEvent,
  onComplete,
}: QuizPracticeGameProps) {
  const preview = useMemo(() => buildSelectionEnginePreview(unit), [unit]);
  const scoringProfile = getGameScoringProfileForMode(gameMode);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>();
  const [completedRoundIds, setCompletedRoundIds] = useState<string[]>([]);
  const [correctRoundIds, setCorrectRoundIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Listen, choose, then submit.");
  const [completionSent, setCompletionSent] = useState(false);
  const currentRound = preview.rounds[roundIndex] ?? preview.rounds[0];
  const completed = completedRoundIds.length === preview.rounds.length;

  useEffect(() => {
    if (!currentRound || completed) {
      return;
    }

    emitInteractionEvent("round_shown", {
      roundId: currentRound.roundId,
      skillFocus: currentRound.skillFocus,
      optionCount: currentRound.options.length,
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

  function handleSelect(optionId: string) {
    const option = currentRound.options.find((candidate) => candidate.optionId === optionId);

    if (!option || completed) {
      return;
    }

    setSelectedOptionId(optionId);
    playAudioCueText({ text: findAudioText(audioCues, option.audioText), language: "en" });
  }

  function handleSubmit() {
    if (!selectedOptionId || completed) {
      return;
    }

    const selectedOption = currentRound.options.find((option) => option.optionId === selectedOptionId);
    const correct = selectedOptionId === currentRound.correctOptionId;
    const nextAttempts = attempts + 1;
    const nextCompletedRoundIds = Array.from(new Set([...completedRoundIds, currentRound.roundId]));
    const nextCorrectRoundIds = correct ? Array.from(new Set([...correctRoundIds, currentRound.roundId])) : correctRoundIds;

    setAttempts(nextAttempts);
    setCompletedRoundIds(nextCompletedRoundIds);
    setCorrectRoundIds(nextCorrectRoundIds);
    emitInteractionEvent("answer_submitted", {
      roundId: currentRound.roundId,
      selectedOptionId,
      selectedLabel: selectedOption?.label ?? "",
      attempts: nextAttempts,
      targetLanguageAttempt: true,
    });
    emitInteractionEvent("answer_result", {
      roundId: currentRound.roundId,
      correct,
      correctOptionId: currentRound.correctOptionId,
      completedRounds: nextCompletedRoundIds.length,
    });

    if (nextCompletedRoundIds.length < preview.rounds.length) {
      setFeedback(correct ? "Correct. Next question." : "Not this time. Listen to the next one.");
      setSelectedOptionId(undefined);
      setRoundIndex((index) => index + 1);
      return;
    }

    if (!completionSent) {
      const earnedStarDust = calculateQuizDust({
        attempts: nextAttempts,
        correctRounds: nextCorrectRoundIds.length,
        totalRounds: preview.rounds.length,
      });
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        metadata: {
          parentEngine: preview.engineId,
          scoringProfileId: "selection-assessment-v1",
          completedRounds: nextCompletedRoundIds.length,
          correctRounds: nextCorrectRoundIds.length,
          attempts: nextAttempts,
        },
      });

      setFeedback(`Quiz complete. You answered ${nextCorrectRoundIds.length} of ${preview.rounds.length} correctly.`);
      emitInteractionEvent("mastery_updated", {
        completed: true,
        earnedStarDust,
        completedRounds: nextCompletedRoundIds.length,
        correctRounds: nextCorrectRoundIds.length,
        scoringProfileId: "selection-assessment-v1",
      });
      setCompletionSent(true);
      onComplete(result);
    }
  }

  function calculateQuizDust(args: { attempts: number; correctRounds: number; totalRounds: number }): number {
    if (!scoringProfile || args.correctRounds === 0) {
      return 0;
    }

    const accuracyDust = calculateAccuracyBonusDust({
      attempts: args.attempts,
      targetAttempts: args.totalRounds,
      profile: scoringProfile,
    });
    const correctnessRatio = args.correctRounds / Math.max(args.totalRounds, 1);

    return Math.round(accuracyDust * correctnessRatio);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Teacher Review Quiz</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text="Listen to the prompt. Tap an answer choice to hear it, then submit."
              language="en"
              label="Tap the quiz instruction to hear it"
              className="text-sm"
            />
          </p>
        </div>
        <StatusPill label={completed ? "Complete" : `Question ${roundIndex + 1}/${preview.rounds.length}`} tone={completed ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <QuizFact label="Engine" value={preview.engineId} />
        <QuizFact label="Scoring" value="selection-assessment-v1" />
        <QuizFact label="Correct" value={`${correctRoundIds.length}/${preview.rounds.length}`} />
        <QuizFact label="Attempts" value={String(attempts)} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{currentRound.skillFocus}</p>
            <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">
              <AudioCueText
                text={currentRound.promptAudioText}
                language="en"
                label="Tap the quiz prompt to hear it"
                className="text-sm font-bold"
              />
            </p>
          </div>
          <AudioCueButton text={currentRound.promptAudioText} language="en" label="Listen to the question prompt" />
        </div>
      </section>

      <section className="mt-5 grid gap-3">
        {currentRound.options.map((option) => {
          const selected = selectedOptionId === option.optionId;

          return (
            <button
              key={option.optionId}
              type="button"
              onClick={() => handleSelect(option.optionId)}
              className={`min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
                selected
                  ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary)] text-white"
                  : "border-[var(--tenant-border)] bg-[var(--tenant-surface)] text-[var(--tenant-text)] hover:bg-[var(--tenant-primary-soft)]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          <AudioCueText text={feedback} language="en" label="Tap the quiz feedback to hear it" className="text-sm font-semibold" />
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedOptionId || completed}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit answer
        </button>
      </div>
    </Card>
  );
}

function QuizFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function findAudioText(audioCues: AudioCue[], label: string): string {
  return audioCues.find((cue) => cue.text.trim().toLowerCase() === label.trim().toLowerCase())?.text ?? label;
}
