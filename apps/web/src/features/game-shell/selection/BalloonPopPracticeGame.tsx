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
import {
  completeGameMode,
  createGameInteractionEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { calculateAccuracyBonusDust, getGameScoringProfileForMode } from "../scoringProfiles";
import { buildSelectionEnginePreview, type SelectionEngineOption } from "./selectionEngineAdapter";

interface BalloonPopPracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

const gameMode = "balloon-pop";
const scoringProfileId = "arcade-reinforcement-v1";
const instructionText = "Listen to the word. Pop the matching balloon.";

export function BalloonPopPracticeGame({
  unit,
  launchSession,
  progression,
  audioCues = [],
  onEvent,
  onComplete,
}: BalloonPopPracticeGameProps) {
  const preview = useMemo(() => buildSelectionEnginePreview(unit), [unit]);
  const rounds = useMemo(() => preview.rounds.filter((round) => round.skillFocus === "vocabulary"), [preview.rounds]);
  const scoringProfile = getGameScoringProfileForMode(gameMode);
  const startEventSent = useRef(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [completedRoundIds, setCompletedRoundIds] = useState<string[]>([]);
  const [correctRoundIds, setCorrectRoundIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [poppedOptionIds, setPoppedOptionIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("Listen first. Then pop the matching balloon.");
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
      skillFocus: currentRound.skillFocus,
      optionCount: currentRound.options.length,
      selectionSkin: gameMode,
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

  function handlePop(option: SelectionEngineOption) {
    if (!currentRound || completed || poppedOptionIds.includes(option.optionId)) {
      return;
    }

    const correct = option.optionId === currentRound.correctOptionId;
    const nextAttempts = attempts + 1;

    setAttempts(nextAttempts);
    setPoppedOptionIds((ids) => Array.from(new Set([...ids, option.optionId])));
    playAudioCueText({ text: findAudioText(audioCues, option.audioText), language: "en" });

    emitInteractionEvent("answer_submitted", {
      roundId: currentRound.roundId,
      selectedOptionId: option.optionId,
      selectedLabel: option.label,
      attempts: nextAttempts,
      targetLanguageAttempt: true,
      supportLanguageUnlockAllowed: false,
    });

    emitInteractionEvent("answer_result", {
      roundId: currentRound.roundId,
      correct,
      correctOptionId: currentRound.correctOptionId,
      selectionSkin: gameMode,
    });

    if (!correct) {
      setFeedback("Try again. Listen and pop the matching word.");
      return;
    }

    const nextCompletedRoundIds = Array.from(new Set([...completedRoundIds, currentRound.roundId]));
    const nextCorrectRoundIds = Array.from(new Set([...correctRoundIds, currentRound.roundId]));
    const nextRoundIndex = roundIndex + 1;

    setCompletedRoundIds(nextCompletedRoundIds);
    setCorrectRoundIds(nextCorrectRoundIds);
    setPoppedOptionIds([]);

    if (nextCompletedRoundIds.length < rounds.length) {
      setFeedback("Correct. Next balloon set.");
      setRoundIndex(nextRoundIndex);
      return;
    }

    if (!completionSent) {
      const earnedStarDust = calculateBalloonPopDust({
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
          parentEngine: preview.engineId,
          scoringProfileId,
          completedRounds: nextCompletedRoundIds.length,
          correctRounds: nextCorrectRoundIds.length,
          attempts: nextAttempts,
          selectionSkin: gameMode,
        },
      });

      setFeedback(`Balloon Pop complete. You popped ${nextCorrectRoundIds.length} matching words.`);
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

  function calculateBalloonPopDust(args: { attempts: number; correctRounds: number; totalRounds: number }): number {
    if (!scoringProfile || args.correctRounds === 0) {
      return 0;
    }

    const accuracyDust = calculateAccuracyBonusDust({
      attempts: args.attempts,
      targetAttempts: args.totalRounds,
      profile: scoringProfile,
      minimumDust: 100,
    });
    const correctnessRatio = args.correctRounds / Math.max(args.totalRounds, 1);

    return Math.min(scoringProfile.completionDustCap, Math.round(accuracyDust * correctnessRatio));
  }

  if (!currentRound) {
    return (
      <Card>
        <h3 className="text-lg font-bold">Balloon Pop</h3>
        <p className="mt-2 text-sm text-[var(--tenant-muted)]">No vocabulary rounds are available for this unit.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Balloon Pop</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text={findInstructionText(audioCues)}
              language="en"
              label="Tap the Balloon Pop instruction to hear it"
              className="text-sm"
            />
          </p>
        </div>
        <StatusPill label={completed ? "Complete" : `Round ${roundIndex + 1}/${rounds.length}`} tone={completed ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <BalloonFact label="Engine" value={preview.engineId} />
        <BalloonFact label="Scoring" value={scoringProfileId} />
        <BalloonFact label="Correct pops" value={`${correctRoundIds.length}/${rounds.length}`} />
        <BalloonFact label="Attempts" value={String(attempts)} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Prompt</p>
            <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">
              <AudioCueText
                text={currentRound.promptAudioText}
                language="en"
                label="Tap the Balloon Pop prompt to hear it"
                className="text-sm font-bold"
              />
            </p>
          </div>
          <AudioCueButton text={currentRound.promptAudioText} language="en" label="Listen to the Balloon Pop prompt" />
        </div>
      </section>

      <section className="mt-5 grid min-h-72 gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 sm:grid-cols-3">
        {currentRound.options.map((option, index) => {
          const popped = poppedOptionIds.includes(option.optionId);

          return (
            <button
              key={option.optionId}
              type="button"
              disabled={completed || popped}
              onClick={() => handlePop(option)}
              className={`flex aspect-square min-h-28 items-center justify-center rounded-full border-4 px-4 text-center text-base font-bold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
                popped
                  ? "border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] text-[var(--tenant-muted)]"
                  : getBalloonClass(index)
              }`}
            >
              {popped ? "Popped" : option.label}
            </button>
          );
        })}
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          <AudioCueText text={feedback} language="en" label="Tap the Balloon Pop feedback to hear it" className="text-sm font-semibold" />
        </p>
        <AudioCueButton text={feedback} language="en" label="Replay Balloon Pop feedback" />
      </div>
    </Card>
  );
}

function BalloonFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function getBalloonClass(index: number): string {
  const styles = [
    "border-sky-300 bg-sky-100 text-sky-950 hover:bg-sky-200",
    "border-rose-300 bg-rose-100 text-rose-950 hover:bg-rose-200",
    "border-emerald-300 bg-emerald-100 text-emerald-950 hover:bg-emerald-200",
  ];

  return styles[index % styles.length] ?? styles[0];
}

function findInstructionText(audioCues: AudioCue[]): string {
  return (
    audioCues.find((cue) => cue.kind === "instruction" && cue.gameMode === gameMode)?.text ??
    instructionText
  );
}

function findAudioText(audioCues: AudioCue[], label: string): string {
  return audioCues.find((cue) => cue.text.trim().toLowerCase() === label.trim().toLowerCase())?.text ?? label;
}
