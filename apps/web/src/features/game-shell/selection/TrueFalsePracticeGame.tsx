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
import { resolveTargetLanguage } from "@living-textbook/content-model";
import { AudioCueButton, AudioCueText, playAudioCueText } from "@/features/audio/AudioCueButton";
import {
  completeGameMode,
  createAudioRequestedEvent,
  createGameInteractionEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { calculateAccuracyBonusDust, getRequiredGameScoringProfileForMode } from "../scoringProfiles";

interface TrueFalsePracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  replaySeed: string;
  audioCues?: AudioCue[];
  targetLanguage: string;
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

interface TrueFalseRound {
  roundId: string;
  sourceText: string;
  shownText: string;
  correctAnswer: boolean;
}

const gameMode = "true-false" as const;
const instructionText = "Listen to the word. Tap true if the card matches.";

export function TrueFalsePracticeGame({
  unit,
  launchSession,
  progression,
  replaySeed,
  audioCues = [],
  targetLanguage: configuredTargetLanguage,
  onEvent,
  onComplete,
}: TrueFalsePracticeGameProps) {
  const rounds = useMemo(() => buildTrueFalseRounds(unit), [unit]);
  const scoringProfile = getRequiredGameScoringProfileForMode(gameMode);
  const scoringProfileId = scoringProfile.id;
  const targetLanguage = resolveTargetLanguage({
    tenantTargetLanguage: configuredTargetLanguage,
    unitLanguage: unit.unitMeta.textbookReference?.language,
  });
  const startEventSent = useRef(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [completedRoundIds, setCompletedRoundIds] = useState<string[]>([]);
  const [correctRoundIds, setCorrectRoundIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Listen first. Does the card match?");
  const [completionSent, setCompletionSent] = useState(false);
  const currentRound = rounds[roundIndex] ?? rounds[0];
  const sourceCue = currentRound ? findAudioCue(audioCues, currentRound.sourceText) : undefined;
  const instructionCue = findAudioCueForGame(audioCues, "instruction");
  const feedbackCue = findAudioCueForGame(audioCues, "feedback");
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
      replaySeed,
    });

    if (event) {
      onEvent?.(event);
    }
  }, [launchSession, onEvent, progression, replaySeed]);

  useEffect(() => {
    if (!currentRound || completedRoundIds.includes(currentRound.roundId)) {
      return;
    }

    emitInteractionEvent("round_shown", {
      roundId: currentRound.roundId,
      promptText: currentRound.sourceText,
      shownText: currentRound.shownText,
      optionCount: 2,
      selectionSkin: gameMode,
      replaySeed,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound?.roundId]);

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
        replaySeed,
        cueKind,
        cueText,
        language,
        source,
      }),
    );
  }

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
        replaySeed,
        metadata,
      }),
    );
  }

  function handleAnswer(selectedAnswer: boolean) {
    if (!currentRound || completed || completedRoundIds.includes(currentRound.roundId)) {
      return;
    }

    const correct = selectedAnswer === currentRound.correctAnswer;
    const nextAttempts = attempts + 1;
    const nextCompletedRoundIds = Array.from(new Set([...completedRoundIds, currentRound.roundId]));
    const nextCorrectRoundIds = correct ? Array.from(new Set([...correctRoundIds, currentRound.roundId])) : correctRoundIds;

    setAttempts(nextAttempts);
    setCompletedRoundIds(nextCompletedRoundIds);
    setCorrectRoundIds(nextCorrectRoundIds);
    const immediateFeedback = correct ? "Correct." : "Try again next time.";
    emitAudioRequested("feedback", immediateFeedback, targetLanguage, "true-false-answer-feedback");
    playAudioCueText({ text: immediateFeedback, language: targetLanguage, cue: feedbackCue });

    emitInteractionEvent("answer_submitted", {
      roundId: currentRound.roundId,
      selectedAnswer,
      expectedAnswer: currentRound.correctAnswer,
      sourceText: currentRound.sourceText,
      shownText: currentRound.shownText,
      attempts: nextAttempts,
      targetLanguageAttempt: true,
      supportLanguageUnlockAllowed: false,
      replaySeed,
    });
    emitInteractionEvent("answer_result", {
      roundId: currentRound.roundId,
      correct,
      expectedAnswer: currentRound.correctAnswer,
      completedRounds: nextCompletedRoundIds.length,
      selectionSkin: gameMode,
      replaySeed,
    });

    if (nextCompletedRoundIds.length < rounds.length) {
      setFeedback(correct ? "Correct. Next card." : "Not this time. Listen to the next card.");
      setRoundIndex((index) => index + 1);
      return;
    }

    if (!completionSent) {
      const earnedStarDust = calculateTrueFalseDust({
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
        replaySeed,
        metadata: {
          parentEngine: "selection",
          scoringProfileId,
          completedRounds: nextCompletedRoundIds.length,
          correctRounds: nextCorrectRoundIds.length,
          attempts: nextAttempts,
          selectionSkin: gameMode,
          replaySeed,
        },
      });

      setFeedback(`True or False complete. You answered ${nextCorrectRoundIds.length} of ${rounds.length} correctly.`);
      emitInteractionEvent("mastery_updated", {
        completed: true,
        parentEngine: "selection",
        earnedStarDust: result.earnedStarDust,
        completedRounds: nextCompletedRoundIds.length,
        correctRounds: nextCorrectRoundIds.length,
        scoringProfileId,
        supportLanguageUnlockAllowed: false,
        replaySeed,
      });
      setCompletionSent(true);
      onComplete(result);
    }
  }

  function calculateTrueFalseDust(args: { attempts: number; correctRounds: number; totalRounds: number }): number {
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
        <h3 className="text-lg font-bold">True or False</h3>
        <p className="mt-2 text-sm text-[var(--tenant-muted)]">No vocabulary rounds are available for this unit.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">True or False</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text={findInstructionText(audioCues)}
              language={instructionCue?.language ?? targetLanguage}
              cue={instructionCue}
              label="Tap the True or False instruction to hear it"
              className="text-sm"
              onPlay={() =>
                emitAudioRequested("instruction", findInstructionText(audioCues), targetLanguage, "true-false-instruction")
              }
            />
          </p>
        </div>
        <StatusPill label={completed ? "Complete" : `Round ${roundIndex + 1}/${rounds.length}`} tone={completed ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <TrueFalseFact label="Engine" value="selection" />
        <TrueFalseFact label="Scoring" value={scoringProfileId} />
        <TrueFalseFact label="Correct" value={`${correctRoundIds.length}/${rounds.length}`} />
        <TrueFalseFact label="Attempts" value={String(attempts)} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Listen prompt</p>
            <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">
              <AudioCueText
                text={sourceCue?.text ?? currentRound.sourceText}
                language={sourceCue?.language ?? targetLanguage}
                cue={sourceCue}
                label="Tap the True or False prompt to hear it"
                className="text-sm font-bold"
                onPlay={() => {
                  const cue = findAudioCue(audioCues, currentRound.sourceText);
                  emitAudioRequested("term", cue?.text ?? currentRound.sourceText, cue?.language ?? targetLanguage, "true-false-prompt");
                }}
              />
            </p>
          </div>
          <AudioCueButton
            text={sourceCue?.text ?? currentRound.sourceText}
            language={sourceCue?.language ?? targetLanguage}
            cue={sourceCue}
            label="Listen to the True or False prompt"
            onPlay={() => {
              const cue = findAudioCue(audioCues, currentRound.sourceText);
              emitAudioRequested("term", cue?.text ?? currentRound.sourceText, cue?.language ?? targetLanguage, "true-false-prompt-replay");
            }}
          />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-4 text-center">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Visible card</p>
        <p className="mt-3 text-3xl font-bold text-[var(--tenant-text)]">
          <AudioCueText
            text={findAudioCue(audioCues, currentRound.shownText)?.text ?? currentRound.shownText}
            language={findAudioCue(audioCues, currentRound.shownText)?.language ?? targetLanguage}
            cue={findAudioCue(audioCues, currentRound.shownText)}
            label="Tap the visible card to hear it"
            className="text-3xl font-bold"
            onPlay={() => {
              const cue = findAudioCue(audioCues, currentRound.shownText);
              emitAudioRequested("term", cue?.text ?? currentRound.shownText, cue?.language ?? targetLanguage, "true-false-visible-card");
            }}
          />
        </p>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-3">
          <AudioCueButton
            text="True"
            language={targetLanguage}
            label="Listen to the True choice"
            onPlay={() => emitAudioRequested("term", "True", targetLanguage, "true-false-choice")}
          />
          <button
            type="button"
            disabled={completed}
            onClick={() => handleAnswer(true)}
            className="min-h-14 rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-3 text-center text-base font-bold text-emerald-950 transition hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] disabled:opacity-60"
          >
            True
          </button>
        </div>
        <div className="grid gap-2 rounded-lg border border-rose-300 bg-rose-50 p-3">
          <AudioCueButton
            text="False"
            language={targetLanguage}
            label="Listen to the False choice"
            onPlay={() => emitAudioRequested("term", "False", targetLanguage, "true-false-choice")}
          />
          <button
            type="button"
            disabled={completed}
            onClick={() => handleAnswer(false)}
            className="min-h-14 rounded-lg border border-rose-300 bg-rose-100 px-4 py-3 text-center text-base font-bold text-rose-950 transition hover:bg-rose-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] disabled:opacity-60"
          >
            False
          </button>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          <AudioCueText
            text={feedback}
            language={feedbackCue?.language ?? targetLanguage}
            cue={feedbackCue}
            label="Tap the True or False feedback to hear it"
            className="text-sm font-semibold"
            onPlay={() => emitAudioRequested("feedback", feedback, targetLanguage, "true-false-feedback")}
          />
        </p>
        <AudioCueButton
          text={feedback}
          language={targetLanguage}
          label="Replay True or False feedback"
          onPlay={() => emitAudioRequested("feedback", feedback, targetLanguage, "true-false-feedback-replay")}
        />
      </div>
    </Card>
  );
}

function buildTrueFalseRounds(unit: UnitPayload): TrueFalseRound[] {
  const terms = unit.pedagogicalPayload.vocabularyTerms;

  return terms.slice(0, 6).map((term, index) => {
    const shownText = index % 2 === 0 ? term : terms[(index + 1) % terms.length] ?? term;

    return {
      roundId: `true-false-${index + 1}`,
      sourceText: term,
      shownText,
      correctAnswer: term === shownText,
    };
  });
}

function TrueFalseFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function findInstructionText(audioCues: AudioCue[]): string {
  return (
    audioCues.find((cue) => cue.kind === "instruction" && cue.gameMode === gameMode)?.text ??
    instructionText
  );
}

function findAudioCue(audioCues: AudioCue[], label: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.text.trim().toLowerCase() === label.trim().toLowerCase());
}

function findAudioCueForGame(audioCues: AudioCue[], kind: AudioCue["kind"]): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.gameMode === gameMode);
}
