"use client";

import { useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AudioCue,
  GameModeId,
  LaunchSession,
  StudentProgressionState,
  UnitPayload,
} from "@living-textbook/content-model";
import { playAudioCueText } from "@/features/audio/AudioCueButton";
import {
  completeGameMode,
  type GameModeCompletionResult,
} from "@/features/progression/localProgressionAdapter";
import { formatMode } from "@/lib/formatLabels";
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

interface PairingMemoryMatchGameProps {
  unit: UnitPayload;
  gameMode: GameModeId;
  launchSession: LaunchSession;
  progression: StudentProgressionState;
  audioCues?: AudioCue[];
  onComplete: (result: GameModeCompletionResult) => void;
}

export function PairingMemoryMatchGame({
  unit,
  gameMode,
  launchSession,
  progression,
  audioCues = [],
  onComplete,
}: PairingMemoryMatchGameProps) {
  const [engineState, setEngineState] = useState<PairingEngineState>(() => createShuffledPairingState(unit));
  const [lastResult, setLastResult] = useState<PairingSelectionResult | undefined>();
  const [mismatchCardIds, setMismatchCardIds] = useState<string[]>([]);
  const [completionSent, setCompletionSent] = useState(false);
  const mode = getGameModeCatalogItem(gameMode);
  const progress = getPairingProgressSummary(engineState);
  const completedAlready = progression.completedGameModes.includes(gameMode);

  function handleCardSelect(card: PairingCard) {
    if (card.status === "matched" || engineState.completed) {
      return;
    }

    const audioCue = findAudioCue(audioCues, card.label);
    playAudioCueText({ text: audioCue?.text ?? card.label, language: audioCue?.language ?? "en" });

    const selectedBefore = engineState.selectedCardIds;
    const outcome = selectPairingCard(engineState, card.id);

    if (outcome.result === "ignored") {
      return;
    }

    setEngineState(outcome.state);
    setLastResult(outcome.result);

    if (outcome.result === "mismatched") {
      setMismatchCardIds([...selectedBefore, card.id]);
      window.setTimeout(() => setMismatchCardIds([]), 700);
    }

    if (outcome.state.completed && !completionSent) {
      const earnedStarDust = calculateMemoryMatchDust(outcome.state.attempts, progress.totalPairs);
      const result = completeGameMode({
        progression,
        launchSession,
        gameMode,
        earnedStarDust,
        occurredAt: new Date().toISOString(),
        metadata: {
          totalPairs: progress.totalPairs,
          attempts: outcome.state.attempts,
          parentEngine: mode?.engineId ?? unit.unitMeta.engineId,
        },
      });

      setCompletionSent(true);
      onComplete(result);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{mode?.label ?? formatMode(gameMode)}</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            Tap a card to hear it, then find its matching card. Matched cards stay open.
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
              disabled={card.status === "matched" || engineState.completed}
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
        {progress.completed
          ? "Memory Match complete. Great work."
          : lastResult === "matched"
            ? "Match found. Keep going."
            : lastResult === "mismatched"
              ? "Not a match. Try another pair."
              : "Tap a card to start."}
      </p>
    </Card>
  );
}

function createShuffledPairingState(unit: UnitPayload): PairingEngineState {
  const pairingItems = createVocabularyPairingItems(unit);
  const state = createPairingEngineState(pairingItems);

  return {
    ...state,
    cards: [...state.cards].sort((first, second) => stableSortKey(first.id) - stableSortKey(second.id)),
  };
}

function stableSortKey(value: string): number {
  return Array.from(value).reduce((total, character, index) => total + character.charCodeAt(0) * (index + 3), 0) % 97;
}

function findAudioCue(audioCues: AudioCue[], text: string): AudioCue | undefined {
  return audioCues.find((cue) => cue.kind === "term" && cue.text.trim().toLowerCase() === text.trim().toLowerCase());
}

function calculateMemoryMatchDust(attempts: number, totalPairs: number): number {
  const safeAttempts = Math.max(attempts, 1);
  const safePairs = Math.max(totalPairs, 1);
  const accuracyRatio = Math.min(safePairs / safeAttempts, 1);

  return Math.max(100, Math.round(accuracyRatio * 200));
}

function MemoryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  );
}
