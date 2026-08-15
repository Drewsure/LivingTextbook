"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
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
import { getGameModeCatalogItem } from "../gameModeCatalog";
import { createVocabularyPairingItems } from "./pairingEngineAdapter";
import {
  createPairingEngineState,
  getPairingProgressSummary,
  selectPairingCard,
  type PairingCard,
  type PairingEngineState,
  type PairingSelectionResult,
} from "./pairingEngineState";

interface PairingMatchUpGameProps {
  unit: UnitPayload;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

const gameMode = "match-up" as const;

export function PairingMatchUpGame({
  unit,
  launchSession,
  progression,
  audioCues = [],
  onEvent,
  onComplete,
}: PairingMatchUpGameProps) {
  const [engineState, setEngineState] = useState<PairingEngineState>(() => createMatchUpState(unit));
  const [lastResult, setLastResult] = useState<PairingSelectionResult | undefined>();
  const [mismatchCardIds, setMismatchCardIds] = useState<string[]>([]);
  const [completionSent, setCompletionSent] = useState(false);
  const startSentRef = useRef(false);
  const mode = getGameModeCatalogItem(gameMode);
  const scoringProfile = getGameScoringProfileForMode(gameMode);
  const progress = getPairingProgressSummary(engineState);
  const completedAlready = progression.completedGameModes.includes(gameMode);
  const instructionCue = findAudioCueForGame(audioCues, "instruction", gameMode);
  const feedbackCue = findAudioCueForGame(audioCues, "feedback", gameMode);

  useEffect(() => {
    if (startSentRef.current) {
      return;
    }

    const event = startUnlockedGameMode({
      progression,
      launchSession,
      gameMode,
      occurredAt: new Date().toISOString(),
    });

    if (event) {
      startSentRef.current = true;
      onEvent?.(event);
    }
  }, [launchSession, onEvent, progression]);

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

  function handleCardSelect(card: PairingCard) {
    const audioCue = findTermAudioCue(audioCues, card.label);
    playAudioCueText({ text: audioCue?.text ?? card.label, language: audioCue?.language ?? "en" });

    if (card.status === "matched" || engineState.completed) {
      return;
    }

    const selectedBefore = engineState.selectedCardIds;
    const firstSelectedCard = engineState.cards.find((candidate) => candidate.id === selectedBefore[0]);
    const outcome = selectPairingCard(engineState, card.id);

    if (outcome.result === "ignored") {
      return;
    }

    emitInteractionEvent("round_shown", {
      cardId: card.id,
      pairId: card.pairId,
      cardKind: card.kind,
      label: card.label,
      result: outcome.result,
      attempts: outcome.state.attempts,
    });

    if (outcome.result === "matched" || outcome.result === "mismatched") {
      const correct = outcome.result === "matched";
      const firstCardId = firstSelectedCard?.id ?? "unknown";
      const firstPairId = firstSelectedCard?.pairId ?? "unknown";
      const firstCardKind = firstSelectedCard?.kind ?? "unknown";
      const firstCardLabel = firstSelectedCard?.label ?? "unknown";
      const outcomeProgress = getPairingProgressSummary(outcome.state);

      emitInteractionEvent("answer_submitted", {
        firstCardId,
        firstPairId,
        firstCardKind,
        firstCardLabel,
        secondCardId: card.id,
        secondPairId: card.pairId,
        secondCardKind: card.kind,
        secondCardLabel: card.label,
        attempts: outcome.state.attempts,
      });
      emitInteractionEvent("answer_result", {
        firstCardId,
        secondCardId: card.id,
        result: outcome.result,
        correct,
        attempts: outcome.state.attempts,
        matchedPairs: outcomeProgress.matchedPairs,
        remainingPairs: outcomeProgress.remainingPairs,
      });
    }

    setEngineState(outcome.state);
    setLastResult(outcome.result);

    if (outcome.result === "mismatched") {
      setMismatchCardIds([...selectedBefore, card.id]);
      window.setTimeout(() => setMismatchCardIds([]), 700);
    }

    if (outcome.state.completed && !completionSent) {
      const completedProgress = getPairingProgressSummary(outcome.state);
      const earnedStarDust = calculateAccuracyBonusDust({
        attempts: outcome.state.attempts,
        targetAttempts: completedProgress.totalPairs,
        profile: scoringProfile ?? {
          id: "pairing-reinforcement-v1",
          label: "Pairing Reinforcement",
          vocabularyDust: 0,
          syntaxDust: 0,
          bonusDust: 200,
          completionDustCap: 200,
          summary: "Fallback pairing score.",
        },
        minimumDust: 80,
      });
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        metadata: {
          totalPairs: completedProgress.totalPairs,
          attempts: outcome.state.attempts,
          parentEngine: mode?.engineId ?? "pairing",
          scoringProfileId: scoringProfile?.id ?? "pairing-reinforcement-v1",
        },
      });

      emitInteractionEvent("mastery_updated", {
        completed: true,
        earnedStarDust,
        attempts: outcome.state.attempts,
        totalPairs: completedProgress.totalPairs,
        scoringProfileId: scoringProfile?.id ?? "pairing-reinforcement-v1",
      });
      setCompletionSent(true);
      onComplete(result);
    }
  }

  const sourceCards = engineState.cards.filter((card) => card.kind === "source");
  const targetCards = engineState.cards
    .filter((card) => card.kind === "target")
    .sort((first, second) => stableSortKey(first.id) - stableSortKey(second.id));
  const selectedCards = engineState.cards.filter((card) => engineState.selectedCardIds.includes(card.id));
  const feedbackText = progress.completed
    ? "Match Up complete. Great work."
    : lastResult === "matched"
      ? "Match found. Choose another listening prompt."
      : lastResult === "mismatched"
        ? feedbackCue?.text ?? "Try again. Listen one more time."
        : instructionCue?.text ?? "Tap a listening prompt, then tap the matching word.";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{mode?.label ?? "Match Up"}</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText
              text={instructionCue?.text ?? "Tap a listening prompt, then tap the matching word."}
              language={instructionCue?.language ?? "en"}
              label="Tap the Match Up instruction to hear it"
              className="text-sm"
            />
          </p>
        </div>
        <StatusPill label={progress.completed || completedAlready ? "Complete" : "Playing"} tone={progress.completed || completedAlready ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <MatchUpFact label="Pairs" value={`${progress.matchedPairs}/${progress.totalPairs}`} />
        <MatchUpFact label="Remaining" value={String(progress.remainingPairs)} />
        <MatchUpFact label="Attempts" value={String(progress.attempts)} />
        <MatchUpFact label="Engine" value={mode?.engineId ?? "pairing"} />
      </dl>

      <div className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm font-semibold text-[var(--tenant-text)]">
        <AudioCueText
          text={
            selectedCards.length > 0
              ? `Selected ${selectedCards.map((card) => card.label).join(" and ")}.`
              : "Choose one listening prompt and one word card."
          }
          label="Tap the Match Up selection status to hear it"
          className="text-sm font-semibold"
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <MatchColumn title="Listen prompts">
          {sourceCards.map((card, index) => (
            <MatchUpButton
              key={card.id}
              card={card}
              displayLabel={`Listen ${index + 1}`}
              selected={engineState.selectedCardIds.includes(card.id)}
              mismatched={mismatchCardIds.includes(card.id)}
              onSelect={handleCardSelect}
            />
          ))}
        </MatchColumn>

        <MatchColumn title="Word cards">
          {targetCards.map((card) => (
            <MatchUpButton
              key={card.id}
              card={card}
              displayLabel={card.label}
              selected={engineState.selectedCardIds.includes(card.id)}
              mismatched={mismatchCardIds.includes(card.id)}
              onSelect={handleCardSelect}
            />
          ))}
        </MatchColumn>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--tenant-text)]">
        <AudioCueText
          text={feedbackText}
          language={(lastResult === "mismatched" ? feedbackCue?.language : instructionCue?.language) ?? "en"}
          label="Tap the Match Up message to hear it"
          className="text-sm font-semibold"
        />
        <AudioCueButton
          text={feedbackText}
          language={(lastResult === "mismatched" ? feedbackCue?.language : instructionCue?.language) ?? "en"}
          label="Replay Match Up message"
          compact
        />
      </div>
    </Card>
  );
}

function MatchColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
      <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
      <div className="grid gap-2">{children}</div>
    </section>
  );
}

function MatchUpButton({
  card,
  displayLabel,
  selected,
  mismatched,
  onSelect,
}: {
  card: PairingCard;
  displayLabel: string;
  selected: boolean;
  mismatched: boolean;
  onSelect: (card: PairingCard) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      disabled={card.status === "matched"}
      aria-label={`${displayLabel}. Tap to hear and select ${card.label}.`}
      className={`min-h-12 rounded-lg border px-3 py-2 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
        card.status === "matched"
          ? "border-emerald-400 bg-emerald-50 text-emerald-900"
          : selected
            ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary-soft)] text-[var(--tenant-text)]"
            : mismatched
              ? "border-amber-400 bg-amber-50 text-amber-950"
              : "border-[var(--tenant-border)] bg-white text-[var(--tenant-text)] hover:brightness-95"
      }`}
    >
      {displayLabel}
    </button>
  );
}

function MatchUpFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function createMatchUpState(unit: UnitPayload): PairingEngineState {
  return createPairingEngineState(createVocabularyPairingItems(unit));
}

function stableSortKey(value: string): number {
  return Array.from(value).reduce((total, character, index) => total + character.charCodeAt(0) * (index + 5), 0) % 101;
}

function findTermAudioCue(audioCues: AudioCue[], text: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === "term" && cue.text.trim().toLowerCase() === text.trim().toLowerCase());
}

function findAudioCueForGame(audioCues: AudioCue[], kind: AudioCue["kind"], mode: typeof gameMode): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.gameMode === mode);
}
