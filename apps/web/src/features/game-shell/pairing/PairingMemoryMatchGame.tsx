"use client";

import { useEffect, useRef, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameModeId,
  GameProgressEvent,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { AudioCueText, playAudioCueText } from "@/features/audio/AudioCueButton";
import {
  completeGameMode,
  createAudioRequestedEvent,
  createGameInteractionEvent,
  startUnlockedGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { formatMode } from "@/lib/formatLabels";
import { getGameModeCatalogItem } from "../gameModeCatalog";
import { calculateAccuracyBonusDust, getGameScoringProfileForMode } from "../scoringProfiles";
import { createVocabularyPairingItems } from "./pairingEngineAdapter";
import {
  createPairingEngineState,
  getPairingProgressSummary,
  selectPairingCard,
  type PairingCard,
  type PairingEngineState,
  type PairingSelectionResult,
} from "./pairingEngineState";

interface PairingMemoryMatchGameProps {
  unit: UnitPayload;
  gameMode: GameModeId;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  replaySeed: string;
  audioCues?: AudioCue[];
  onEvent?: (event: GameProgressEvent) => void;
  onComplete: (result: GameModeCompletionResult) => void;
}

export function PairingMemoryMatchGame({
  unit,
  gameMode,
  launchSession,
  progression,
  replaySeed,
  audioCues = [],
  onEvent,
  onComplete,
}: PairingMemoryMatchGameProps) {
  const [engineState, setEngineState] = useState<PairingEngineState>(() => createShuffledPairingState(unit, replaySeed));
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
  const targetLanguage = unit.unitMeta.textbookReference?.language ?? "en";

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

  function emitAudioRequested(cueKind: "term" | "instruction" | "feedback", cueText: string, language: string, source: string) {
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

  function handleCardSelect(card: PairingCard) {
    const audioCue = findAudioCue(audioCues, card.label);
    emitAudioRequested("term", audioCue?.text ?? card.label, audioCue?.language ?? targetLanguage, "memory-match-card");
    playAudioCueText({ text: audioCue?.text ?? card.label, language: audioCue?.language ?? targetLanguage });

    if (card.status === "matched" || engineState.completed) {
      return;
    }

    const selectedBefore = engineState.selectedCardIds;
    const firstSelectedCard = engineState.cards.find((candidate) => candidate.id === selectedBefore[0]);
    const outcome = selectPairingCard(engineState, card.id);

    if (outcome.result === "ignored") {
      return;
    }

    if (selectedBefore.length === 0) {
      emitInteractionEvent("round_shown", {
        cardId: card.id,
        pairId: card.pairId,
        cardKind: card.kind,
        label: card.label,
        roundIndex: outcome.state.attempts + 1,
        totalPairs: progress.totalPairs,
        replaySeed,
      });
    }

    if (outcome.result === "matched" || outcome.result === "mismatched") {
      const correct = outcome.result === "matched";
      const firstCardId = firstSelectedCard?.id ?? "unknown";
      const firstPairId = firstSelectedCard?.pairId ?? "unknown";
      const firstCardKind = firstSelectedCard?.kind ?? "unknown";
      const firstCardLabel = firstSelectedCard?.label ?? "unknown";

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
        replaySeed,
      });
      emitInteractionEvent("answer_result", {
        firstCardId,
        secondCardId: card.id,
        result: outcome.result,
        correct,
        attempts: outcome.state.attempts,
        matchedPairs: outcome.state.matchedPairIds.length,
        remainingPairs: Math.max(progress.totalPairs - outcome.state.matchedPairIds.length, 0),
        replaySeed,
      });
    }

    setEngineState(outcome.state);
    setLastResult(outcome.result);

    if (outcome.result === "mismatched") {
      setMismatchCardIds([...selectedBefore, card.id]);
      window.setTimeout(() => setMismatchCardIds([]), 700);
    }

    if (outcome.state.completed && !completionSent) {
      const earnedStarDust = calculateMemoryMatchDust({
        attempts: outcome.state.attempts,
        totalPairs: progress.totalPairs,
        scoringProfile,
      });
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        replaySeed,
        metadata: {
          totalPairs: progress.totalPairs,
          attempts: outcome.state.attempts,
          parentEngine: mode?.engineId ?? unit.unitMeta.engineId,
          scoringProfileId: scoringProfile?.id ?? "none",
          replaySeed,
        },
      });

      emitInteractionEvent("mastery_updated", {
        completed: true,
        earnedStarDust: result.earnedStarDust,
        attempts: outcome.state.attempts,
        totalPairs: progress.totalPairs,
        scoringProfileId: scoringProfile?.id ?? "none",
        replaySeed,
      });
      setCompletionSent(true);
      onComplete(result);
    }
  }

  const feedbackText = progress.completed
    ? "Memory Match complete. Great work."
    : lastResult === "matched"
      ? "Match found. Keep going."
      : lastResult === "mismatched"
        ? feedbackCue?.text ?? "Not a match. Try another pair."
        : instructionCue?.text ?? "Tap a card to hear it, then find its matching card.";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{mode?.label ?? formatMode(gameMode)}</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            <AudioCueText
              text={instructionCue?.text ?? "Tap a card to hear it, then find its matching card. Matched cards stay open."}
              language={instructionCue?.language ?? targetLanguage}
              label="Tap the Memory Match instruction to hear it"
              className="text-sm"
              onPlay={() =>
                emitAudioRequested(
                  "instruction",
                  instructionCue?.text ?? "Tap a card to hear it, then find its matching card. Matched cards stay open.",
                  instructionCue?.language ?? targetLanguage,
                  "memory-match-instruction",
                )
              }
            />
          </p>
        </div>
        <StatusPill label={progress.completed || completedAlready ? "Complete" : "Playing"} tone={progress.completed || completedAlready ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-4">
        <MemoryFact label="Pairs" value={`${progress.matchedPairs}/${progress.totalPairs}`} />
        <MemoryFact label="Remaining" value={String(progress.remainingPairs)} />
        <MemoryFact label="Attempts" value={String(progress.attempts)} />
        <MemoryFact label="Engine" value={mode?.engineId ?? unit.unitMeta.engineId} />
      </dl>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {engineState.cards.map((card) => {
          const visible = card.status === "matched" || engineState.selectedCardIds.includes(card.id) || mismatchCardIds.includes(card.id);
          const selected = engineState.selectedCardIds.includes(card.id);
          const mismatched = mismatchCardIds.includes(card.id);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardSelect(card)}
              aria-label={visible ? `Card says ${card.label}` : "Hidden Memory Match card"}
              className={`aspect-[4/3] rounded-lg border p-3 text-center text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)] ${
                card.status === "matched"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                  : selected
                    ? "border-[var(--tenant-primary)] bg-[var(--tenant-surface)] text-[var(--tenant-text)]"
                    : mismatched
                      ? "border-amber-400 bg-amber-50 text-amber-950"
                      : "border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] text-[var(--tenant-muted)] hover:brightness-95"
              }`}
            >
              {visible ? card.label : "Tap"}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm font-semibold text-[var(--tenant-text)]">
        <AudioCueText
          text={feedbackText}
          language={(lastResult === "mismatched" ? feedbackCue?.language : instructionCue?.language) ?? targetLanguage}
          label="Tap the Memory Match message to hear it"
          className="text-sm font-semibold"
          onPlay={() =>
            emitAudioRequested(
              lastResult === "mismatched" ? "feedback" : "instruction",
              feedbackText,
              (lastResult === "mismatched" ? feedbackCue?.language : instructionCue?.language) ?? targetLanguage,
              "memory-match-feedback",
            )
          }
        />
      </p>
    </Card>
  );
}

function createShuffledPairingState(unit: UnitPayload, replaySeed: string): PairingEngineState {
  const pairingItems = createVocabularyPairingItems(unit);
  const state = createPairingEngineState(pairingItems);

  return {
    ...state,
    cards: [...state.cards].sort((first, second) => stableSortKey(`${replaySeed}:${first.id}`) - stableSortKey(`${replaySeed}:${second.id}`)),
  };
}

function stableSortKey(value: string): number {
  return Array.from(value).reduce((total, character, index) => total + character.charCodeAt(0) * (index + 3), 0) % 97;
}

function findAudioCue(audioCues: AudioCue[], text: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === "term" && cue.text.trim().toLowerCase() === text.trim().toLowerCase());
}

function findAudioCueForGame(audioCues: AudioCue[], kind: AudioCue["kind"], gameMode: GameModeId): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === kind && cue.gameMode === gameMode);
}

function calculateMemoryMatchDust({
  attempts,
  totalPairs,
  scoringProfile,
}: {
  attempts: number;
  totalPairs: number;
  scoringProfile: ReturnType<typeof getGameScoringProfileForMode>;
}): number {
  if (!scoringProfile) {
    return 100;
  }

  return calculateAccuracyBonusDust({
    attempts,
    targetAttempts: totalPairs,
    profile: scoringProfile,
    minimumDust: Math.min(100, scoringProfile.completionDustCap),
  });
}

function MemoryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  );
}
