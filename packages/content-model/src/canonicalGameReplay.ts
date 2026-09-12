import type { GameModeId } from "./index";

export interface CanonicalGameReplaySeedInput {
  unitKey: string;
  gameMode: GameModeId;
}

/** Stable, tenant-neutral seed used for replay evidence and deterministic layouts. */
export function createCanonicalGameReplaySeed({ unitKey, gameMode }: CanonicalGameReplaySeedInput): string {
  const normalizedUnitKey = unitKey.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "unit";
  return `replay-v1:${normalizedUnitKey}:${gameMode}`;
}
