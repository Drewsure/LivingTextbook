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

interface FillInBlankPracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

interface FillInBlankRound {
  roundId: string;
  targetSentence: string;
  promptSentence: string;
  expectedAnswer: string;
  choices: string[];
}

const gameMode = "fill-in-the-blank" as const;
const scoringProfileId = "syntax-construction-v1";
const instructionText = "Listen to the sentence. Choose the missing word.";

export function FillInBlankPracticeGame({
  unit,
  launchSession,
  progression,
  audioCues = [],
  onEvent,
  onComplete,
}: FillInBlankPracticeGameProps) {
  const rounds = useMemo(() => buildFillInBlankRounds(unit), [unit]);
  const scoringProfile = getGameScoringProfileForMode(gameMode);
  const startEventSent = useRef(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [completedRoundIds, setCompletedRoundIds] = useState<string[]>([]);
  const [correctRoundIds, setCorrectRoundIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Listen first. Then choose the missing word.");
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
      promptSentence: currentRound.promptSentence,
      expectedAnswerLength: currentRound.expectedAnswer.length,
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

  function handleChoiceSelect(choice: string) {
    if (completed) {
      return;
    }

    setSelectedAnswer(choice);
    playAudioCueText({ text: findAudioText(audioCues, choice), language: "en" });
  }

  function handleSubmit() {
    if (!currentRound || completed || selectedAnswer.trim().length === 0) {
      return;
    }

    const correct = normalizeAnswer(selectedAnswer) === normalizeAnswer(currentRound.expectedAnswer);
    const nextAttempts = attempts + 1;

    setAttempts(nextAttempts);
    emitInteractionEvent("answer_submitted", {
      roundId: currentRound.roundId,
      answer: selectedAnswer,
      expectedAnswer: currentRound.expectedAnswer,
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
      setFeedback("Try again. Listen and choose the missing word.");
      playAudioCueText({ text: "Try again. Listen and choose the missing word.", language: "en" });
      return;
    }

    const nextCompletedRoundIds = Array.from(new Set([...completedRoundIds, currentRound.roundId]));
    const nextCorrectRoundIds = Array.from(new Set([...correctRoundIds, currentRound.roundId]));

    setCompletedRoundIds(nextCompletedRoundIds);
    setCorrectRoundIds(nextCorrectRoundIds);
    setFeedback("Correct. Next sentence.");
    setSelectedAnswer("");
    playAudioCueText({ text: "Correct. Next sentence.", language: "en" });

    if (nextCompletedRoundIds.length < rounds.length) {
      setRoundIndex((index) => index + 1);
      return;
    }

    if (!completionSent) {
      const earnedStarDust = calculateFillInBlankDust({
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

      setFeedback(`Fill in the Blank complete. You completed ${nextCorrectRoundIds.length} of ${rounds.length} sentences.`);
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

  function calculateFillInBlankDust(args: { attempts: number; correctRounds: number; totalRounds: number }): number {
    if (!scoringProfile || args.correctRounds === 0) {
      return 0;
    }

    const accuracyDust = calculateAccuracyBonusDust({
      attempts: args.attempts,
      targetAttempts: args.totalRounds,
      profile: scoringProfile,
      minimumDust: scoringProfile.syntaxDust,
    });
    const correctnessRatio = args.correctRounds / Math.max(args.totalRounds, 1);

    return Math.min(scoringProfile.completionDustCap, Math.round(accuracyDust * correctnessRatio));
  }

  if (!currentRound) {
    return (
      <Card>
        <h3 className="text-lg font-bold">Fill in the Blank</h3>
        <p className="mt-2 text-sm text-[var(--tenant-muted)]">No sentence rounds are available for this unit.</p>
      </Card>
    );
  }

  const promptAudioText = findAudioText(audioCues, currentRound.targetSentence);
  const gameInstructionText = findInstructionText(audioCues);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Fill in the Blank</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text={gameInstructionText}
              language="en"
              label="Tap the Fill in the Blank instruction to hear it"
              className="text-sm"
            />
          </p>
        </div>
        <StatusPill label={completed ? "Complete" : `Round ${roundIndex + 1}/${rounds.length}`} tone={completed ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <FillFact label="Engine" value="text-spelling" />
        <FillFact label="Scoring" value={scoringProfileId} />
        <FillFact label="Correct" value={`${correctRoundIds.length}/${rounds.length}`} />
        <FillFact label="Attempts" value={String(attempts)} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Sentence prompt</p>
            <p className="mt-1 text-base font-bold text-[var(--tenant-text)]">
              <AudioCueText
                text={currentRound.promptSentence}
                language="en"
                label="Tap the Fill in the Blank sentence prompt to hear it"
                className="text-base font-bold"
              />
            </p>
          </div>
          <AudioCueButton text={promptAudioText} language="en" label="Listen to the full target sentence before choosing" />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-sm font-bold text-[var(--tenant-text)]">
          <AudioCueText text="Choose the missing word." language="en" label="Tap the answer choice instruction to hear it" className="text-sm font-bold" />
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {currentRound.choices.map((choice) => {
            const selected = selectedAnswer === choice;

            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleChoiceSelect(choice)}
                disabled={completed}
                className={`min-h-12 rounded-lg border px-4 py-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
                  selected
                    ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary)] text-white"
                    : "border-[var(--tenant-border)] bg-[var(--tenant-surface)] text-[var(--tenant-text)] hover:bg-[var(--tenant-primary-soft)]"
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          <AudioCueText text={feedback} language="en" label="Tap the Fill in the Blank feedback to hear it" className="text-sm font-semibold" />
        </p>
        <div className="flex flex-wrap gap-2">
          <AudioCueButton text={promptAudioText} language="en" label="Replay the full target sentence before submitting" />
          <AudioSupportedAction
            audioText="Submit missing word"
            onClick={handleSubmit}
            disabled={selectedAnswer.trim().length === 0 || completed}
          >
            Submit answer
          </AudioSupportedAction>
        </div>
      </div>
    </Card>
  );
}

function buildFillInBlankRounds(unit: UnitPayload): FillInBlankRound[] {
  const vocabularyTerms = unit.pedagogicalPayload.vocabularyTerms;

  return unit.pedagogicalPayload.targetSentences.slice(0, 2).map((sentence, index) => {
    const expectedAnswer = findBlankAnswer(sentence, vocabularyTerms);
    const promptSentence = blankSentence(sentence, expectedAnswer);
    const choices = buildChoices(expectedAnswer, vocabularyTerms, index);

    return {
      roundId: `fill-in-the-blank-${index + 1}`,
      targetSentence: sentence,
      promptSentence,
      expectedAnswer,
      choices,
    };
  });
}

function FillFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function findBlankAnswer(sentence: string, vocabularyTerms: string[]): string {
  const normalizedSentence = normalizeAnswer(sentence);
  const matchedTerm = [...vocabularyTerms]
    .sort((a, b) => b.length - a.length)
    .find((term) => normalizedSentence.includes(normalizeAnswer(term)));

  if (matchedTerm) {
    return matchedTerm;
  }

  return sentence.replace(/[.!?]+$/g, "").split(/\s+/).find(Boolean) ?? sentence;
}

function blankSentence(sentence: string, expectedAnswer: string): string {
  const escapedAnswer = expectedAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const answerPattern = new RegExp(escapedAnswer.replace(/\s+/g, "\\s+"), "i");

  return sentence.replace(answerPattern, "_____");
}

function buildChoices(expectedAnswer: string, vocabularyTerms: string[], roundIndex: number): string[] {
  const normalizedExpected = normalizeAnswer(expectedAnswer);
  const decoys = vocabularyTerms
    .filter((term) => normalizeAnswer(term) !== normalizedExpected)
    .slice(0, 3);
  const choices = [...decoys];
  const insertIndex = Math.min(roundIndex % (choices.length + 1), choices.length);

  choices.splice(insertIndex, 0, expectedAnswer);

  return choices;
}

function normalizeAnswer(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findInstructionText(audioCues: AudioCue[]): string {
  return audioCues.find((cue) => cue.kind === "instruction" && cue.gameMode === gameMode)?.text ?? instructionText;
}

function findAudioText(audioCues: AudioCue[], label: string): string {
  return audioCues.find((cue) => cue.text.trim().toLowerCase() === label.trim().toLowerCase())?.text ?? label;
}
