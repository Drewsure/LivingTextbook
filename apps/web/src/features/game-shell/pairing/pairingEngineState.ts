import type { PairingItem } from "./pairingEngineAdapter";

export type PairingCardKind = "source" | "target";
export type PairingCardStatus = "available" | "matched";
export type PairingSelectionResult = "ignored" | "selected" | "matched" | "mismatched";

export interface PairingCard {
  id: string;
  pairId: string;
  label: string;
  kind: PairingCardKind;
  status: PairingCardStatus;
}

export interface PairingEngineState {
  cards: PairingCard[];
  selectedCardIds: string[];
  matchedPairIds: string[];
  attempts: number;
  completed: boolean;
}

export interface PairingSelectionOutcome {
  state: PairingEngineState;
  result: PairingSelectionResult;
  pairId?: string;
}

export interface PairingProgressSummary {
  totalPairs: number;
  matchedPairs: number;
  remainingPairs: number;
  attempts: number;
  completed: boolean;
}

export function createPairingEngineState(items: PairingItem[]): PairingEngineState {
  const cards = items.flatMap((item) => [
    {
      id: `${item.id}:source`,
      pairId: item.id,
      label: item.sourceText,
      kind: "source" as const,
      status: "available" as const,
    },
    {
      id: `${item.id}:target`,
      pairId: item.id,
      label: item.targetText,
      kind: "target" as const,
      status: "available" as const,
    },
  ]);

  return {
    cards,
    selectedCardIds: [],
    matchedPairIds: [],
    attempts: 0,
    completed: cards.length === 0,
  };
}

export function getPairingProgressSummary(state: PairingEngineState): PairingProgressSummary {
  const totalPairs = state.cards.length / 2;
  const matchedPairs = state.matchedPairIds.length;

  return {
    totalPairs,
    matchedPairs,
    remainingPairs: Math.max(totalPairs - matchedPairs, 0),
    attempts: state.attempts,
    completed: state.completed,
  };
}

export function selectPairingCard(state: PairingEngineState, cardId: string): PairingSelectionOutcome {
  if (state.completed || state.selectedCardIds.includes(cardId)) {
    return { state, result: "ignored" };
  }

  const selectedCard = state.cards.find((card) => card.id === cardId);

  if (!selectedCard || selectedCard.status === "matched") {
    return { state, result: "ignored" };
  }

  const selectedCardIds = [...state.selectedCardIds, cardId];

  if (selectedCardIds.length < 2) {
    return {
      state: {
        ...state,
        selectedCardIds,
      },
      result: "selected",
      pairId: selectedCard.pairId,
    };
  }

  const [firstCardId, secondCardId] = selectedCardIds;
  const firstCard = state.cards.find((card) => card.id === firstCardId);
  const secondCard = state.cards.find((card) => card.id === secondCardId);
  const attempts = state.attempts + 1;

  if (!firstCard || !secondCard) {
    return {
      state: {
        ...state,
        selectedCardIds: [],
        attempts,
      },
      result: "ignored",
    };
  }

  const isMatchedPair = firstCard.pairId === secondCard.pairId && firstCard.kind !== secondCard.kind;

  if (!isMatchedPair) {
    return {
      state: {
        ...state,
        selectedCardIds: [],
        attempts,
      },
      result: "mismatched",
    };
  }

  const matchedPairIds = Array.from(new Set([...state.matchedPairIds, firstCard.pairId]));
  const cards = state.cards.map((card) =>
    card.pairId === firstCard.pairId
      ? {
          ...card,
          status: "matched" as const,
        }
      : card,
  );

  return {
    state: {
      cards,
      selectedCardIds: [],
      matchedPairIds,
      attempts,
      completed: matchedPairIds.length === cards.length / 2,
    },
    result: "matched",
    pairId: firstCard.pairId,
  };
}
