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

interface TypeAnswerPracticeGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  replaySeed: string;
  audioCues?: AudioCue[];
  targetLanguage: string;
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

interface TypeAnswerRound {
  roundId: string;
  promptText: string;
  expectedAnswer: string;
}

const gameMode = "type-answer" as const;
const instructionText = "Listen to the word. Type the answer.";

export function TypeAnswerPracticeGame({
  unit,
  launchSession,
  progression,
  replaySeed,
  audioCues = [],
  targetLanguage: configuredTargetLanguage,
  onEvent,
  onComplete,
}: TypeAnswerPracticeGameProps) {
  const rounds = useMemo(() => buildTypeAnswerRounds(unit), [unit]);
  const scoringProfile = getRequiredGameScoringProfileForMode(gameMode);
  const scoringProfileId = scoringProfile.id;
  const targetLanguage = resolveTargetLanguage({
    tenantTargetLanguage: configuredTargetLanguage,
    unitLanguage: unit.unitMeta.textbookReference?.language,
  });
  const startEventSent = useRef(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [completedRoundIds, setCompletedRoundIds] = useState<string[]>([]);
  const [correctRoundIds, setCorrectRoundIds] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("Listen first. Then type the word.");
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
      promptText: currentRound.promptText,
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

  function handleSubmit() {
    if (!currentRound || completed) {
      return;
    }

    const typedAnswer = answer.trim();
    const correct = normalizeAnswer(typedAnswer) === normalizeAnswer(currentRound.expectedAnswer);
    const nextAttempts = attempts + 1;

    setAttempts(nextAttempts);
    emitInteractionEvent("answer_submitted", {
      roundId: currentRound.roundId,
      answer: typedAnswer,
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
      setFeedback("Try again. Listen and type the word.");
      emitAudioRequested("feedback", "Try again. Listen and type the word.", targetLanguage, "type-answer-feedback-auto");
      playAudioCueText({ text: "Try again. Listen and type the word.", language: targetLanguage });
      return;
    }

    const nextCompletedRoundIds = Array.from(new Set([...completedRoundIds, currentRound.roundId]));
    const nextCorrectRoundIds = Array.from(new Set([...correctRoundIds, currentRound.roundId]));

    setCompletedRoundIds(nextCompletedRoundIds);
    setCorrectRoundIds(nextCorrectRoundIds);
    setFeedback("Correct. Next typing card.");
    setAnswer("");
    emitAudioRequested("feedback", "Correct. Next typing card.", targetLanguage, "type-answer-feedback-auto");
    playAudioCueText({ text: "Correct. Next typing card.", language: targetLanguage });

    if (nextCompletedRoundIds.length < rounds.length) {
      setRoundIndex((index) => index + 1);
      return;
    }

    if (!completionSent) {
      const earnedStarDust = calculateTypeAnswerDust({
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

      setFeedback(`Type Answer complete. You typed ${nextCorrectRoundIds.length} of ${rounds.length} words correctly.`);
      emitInteractionEvent("mastery_updated", {
        completed: true,
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

  function calculateTypeAnswerDust(args: { attempts: number; correctRounds: number; totalRounds: number }): number {
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
        <h3 className="text-lg font-bold">Type Answer</h3>
        <p className="mt-2 text-sm text-[var(--tenant-muted)]">No vocabulary rounds are available for this unit.</p>
      </Card>
    );
  }

  const promptCue = findAudioCue(audioCues, currentRound.expectedAnswer);
  const promptAudioText = promptCue?.text ?? currentRound.expectedAnswer;
  const gameInstructionText = findInstructionText(audioCues);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Type Answer</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
            <AudioCueText
              text={gameInstructionText}
              language={targetLanguage}
              label="Tap the Type Answer instruction to hear it"
              className="text-sm"
              onPlay={() => emitAudioRequested("instruction", gameInstructionText, targetLanguage, "type-answer-instruction")}
            />
          </p>
        </div>
        <StatusPill label={completed ? "Complete" : `Round ${roundIndex + 1}/${rounds.length}`} tone={completed ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <TypingFact label="Engine" value="text-spelling" />
        <TypingFact label="Scoring" value={scoringProfileId} />
        <TypingFact label="Correct" value={`${correctRoundIds.length}/${rounds.length}`} />
        <TypingFact label="Attempts" value={String(attempts)} />
      </dl>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Listen prompt</p>
            <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">
              <AudioCueText
                text="Listen to the word."
                language={targetLanguage}
                label="Tap the Type Answer prompt instruction to hear it"
                className="text-sm font-bold"
                onPlay={() => emitAudioRequested("instruction", "Listen to the word.", targetLanguage, "type-answer-prompt-instruction")}
              />
            </p>
          </div>
          <AudioCueButton
            text={promptAudioText}
            language={promptCue?.language ?? targetLanguage}
            label="Listen to the Type Answer prompt"
            onPlay={() => emitAudioRequested("term", promptAudioText, promptCue?.language ?? targetLanguage, "type-answer-prompt")}
          />
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4">
        <label htmlFor="type-answer-input" className="text-sm font-bold text-[var(--tenant-text)]">
          <AudioCueText
            text="Type your answer."
            language={targetLanguage}
            label="Tap the Type Answer input label to hear it"
            className="text-sm font-bold"
            onPlay={() => emitAudioRequested("instruction", "Type your answer.", targetLanguage, "type-answer-input-label")}
          />
        </label>
        <input
          id="type-answer-input"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={completed}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          className="mt-3 min-h-14 w-full rounded-lg border border-[var(--tenant-border)] bg-white px-4 py-3 text-lg font-bold text-[var(--tenant-text)] outline-none transition focus:border-[var(--tenant-primary)] focus:ring-2 focus:ring-[var(--tenant-primary-soft)] disabled:opacity-70"
        />
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[var(--tenant-text)]">
          <AudioCueText
            text={feedback}
            language={targetLanguage}
            label="Tap the Type Answer feedback to hear it"
            className="text-sm font-semibold"
            onPlay={() => emitAudioRequested("feedback", feedback, targetLanguage, "type-answer-feedback")}
          />
        </p>
        <div className="flex flex-wrap gap-2">
          <AudioCueButton
            text={promptAudioText}
            language={promptCue?.language ?? targetLanguage}
            label="Replay Type Answer prompt before submitting"
            onPlay={() => emitAudioRequested("term", promptAudioText, promptCue?.language ?? targetLanguage, "type-answer-prompt-replay")}
          />
          <AudioSupportedAction
            audioText="Submit answer"
            audioLanguage={targetLanguage}
            onClick={handleSubmit}
            disabled={answer.trim().length === 0 || completed}
          >
            Submit answer
          </AudioSupportedAction>
        </div>
      </div>
    </Card>
  );
}

function buildTypeAnswerRounds(unit: UnitPayload): TypeAnswerRound[] {
  return unit.pedagogicalPayload.vocabularyTerms.slice(0, 6).map((term, index) => ({
    roundId: `type-answer-${index + 1}`,
    promptText: "Listen to the word.",
    expectedAnswer: term,
  }));
}

function TypingFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
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
