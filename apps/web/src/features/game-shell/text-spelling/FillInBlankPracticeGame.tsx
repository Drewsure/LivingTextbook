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
import { AudioSupportedAction } from "@/features/audio/AudioSupportedAction";
import {
  completeGameMode,
  createAudioRequestedEvent,
  createGameInteractionEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { calculateAccuracyBonusDust, getRequiredGameScoringProfileForMode } from "../scoringProfiles";

interface FillInBlankPracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  replaySeed: string;
  audioCues?: AudioCue[];
  targetLanguage: string;
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
const instructionText = "Listen to the sentence. Choose the missing word.";

export function FillInBlankPracticeGame({
  unit,
  launchSession,
  progression,
  replaySeed,
  audioCues = [],
  targetLanguage: configuredTargetLanguage,
  onEvent,
  onComplete,
}: FillInBlankPracticeGameProps) {
  const rounds = useMemo(() => buildFillInBlankRounds(unit), [unit]);
  const scoringProfile = getRequiredGameScoringProfileForMode(gameMode);
  const scoringProfileId = scoringProfile.id;
  const targetLanguage = resolveTargetLanguage({
    tenantTargetLanguage: configuredTargetLanguage,
    unitLanguage: unit.unitMeta.textbookReference?.language,
  });
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
      promptSentence: currentRound.promptSentence,
      expectedAnswerLength: currentRound.expectedAnswer.length,
      textSpellingSkin: gameMode,
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

  function handleChoiceSelect(choice: string) {
    if (completed) {
      return;
    }

    setSelectedAnswer(choice);
    const cue = findAudioCue(audioCues, choice);
    emitAudioRequested("term", cue?.text ?? choice, cue?.language ?? targetLanguage, "fill-in-choice");
    playAudioCueText({ text: cue?.text ?? choice, language: cue?.language ?? targetLanguage });
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
      replaySeed,
    });
    emitInteractionEvent("answer_result", {
      roundId: currentRound.roundId,
      correct,
      attempts: nextAttempts,
      completedRounds: completedRoundIds.length,
      textSpellingSkin: gameMode,
      replaySeed,
    });

    if (!correct) {
      setFeedback("Try again. Listen and choose the missing word.");
      emitAudioRequested("feedback", "Try again. Listen and choose the missing word.", targetLanguage, "fill-in-feedback-auto");
      playAudioCueText({ text: "Try again. Listen and choose the missing word.", language: targetLanguage });
      return;
    }

    const nextCompletedRoundIds = Array.from(new Set([...completedRoundIds, currentRound.roundId]));
    const nextCorrectRoundIds = Array.from(new Set([...correctRoundIds, currentRound.roundId]));

    setCompletedRoundIds(nextCompletedRoundIds);
    setCorrectRoundIds(nextCorrectRoundIds);
    setFeedback("Correct. Next sentence.");
    setSelectedAnswer("");
    emitAudioRequested("feedback", "Correct. Next sentence.", targetLanguage, "fill-in-feedback-auto");
    playAudioCueText({ text: "Correct. Next sentence.", language: targetLanguage });

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
        replaySeed,
        metadata: {
          parentEngine: "text-spelling",
          scoringProfileId,
          completedRounds: nextCompletedRoundIds.length,
          correctRounds: nextCorrectRoundIds.length,
          attempts: nextAttempts,
          textSpellingSkin: gameMode,
          replaySeed,
        },
      });

      setFeedback(`Fill in the Blank complete. You completed ${nextCorrectRoundIds.length} of ${rounds.length} sentences.`);
      emitInteractionEvent("mastery_updated", {
        completed: true,
        parentEngine: "text-spelling",
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

  const promptCue = findAudioCue(audioCues, currentRound.targetSentence);
  const promptAudioText = promptCue?.text ?? currentRound.targetSentence;
  const gameInstructionText = findInstructionText(audioCues);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Fill in the Blank</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text={gameInstructionText}
              language={targetLanguage}
              label="Tap the Fill in the Blank instruction to hear it"
              className="text-sm"
              onPlay={() => emitAudioRequested("instruction", gameInstructionText, targetLanguage, "fill-in-instruction")}
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
                language={targetLanguage}
                label="Tap the Fill in the Blank sentence prompt to hear it"
                className="text-base font-bold"
                onPlay={() => emitAudioRequested("sentence", currentRound.promptSentence, targetLanguage, "fill-in-prompt")}
              />
            </p>
          </div>
          <AudioCueButton
            text={promptAudioText}
            language={promptCue?.language ?? targetLanguage}
            cue={promptCue}
            label="Listen to the full target sentence before choosing"
            onPlay={() => emitAudioRequested("sentence", promptAudioText, promptCue?.language ?? targetLanguage, "fill-in-target-sentence")}
          />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <p className="text-sm font-bold text-[var(--tenant-text)]">
          <AudioCueText
            text="Choose the missing word."
            language={targetLanguage}
            label="Tap the answer choice instruction to hear it"
            className="text-sm font-bold"
            onPlay={() => emitAudioRequested("instruction", "Choose the missing word.", targetLanguage, "fill-in-choice-instruction")}
          />
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
          <AudioCueText
            text={feedback}
            language={targetLanguage}
            label="Tap the Fill in the Blank feedback to hear it"
            className="text-sm font-semibold"
            onPlay={() => emitAudioRequested("feedback", feedback, targetLanguage, "fill-in-feedback")}
          />
        </p>
        <div className="flex flex-wrap gap-2">
          <AudioCueButton
            text={promptAudioText}
            language={promptCue?.language ?? targetLanguage}
            cue={promptCue}
            label="Replay the full target sentence before submitting"
            onPlay={() => emitAudioRequested("sentence", promptAudioText, promptCue?.language ?? targetLanguage, "fill-in-target-sentence-replay")}
          />
          <AudioSupportedAction
            audioText="Submit missing word"
            audioLanguage={targetLanguage}
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

function findAudioCue(audioCues: AudioCue[], label: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.text.trim().toLowerCase() === label.trim().toLowerCase());
}
