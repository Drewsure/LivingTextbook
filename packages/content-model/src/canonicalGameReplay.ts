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

export interface CanonicalCompletionIdempotencyKeyInput {
  tenantId: string;
  unitKey: string;
  launchCode: string;
  studentSessionId: string;
  gameMode: GameModeId;
}

/** Stable identity for one completion write across hosted and local adapters. */
export function createCanonicalCompletionIdempotencyKey({
  tenantId,
  unitKey,
  launchCode,
  studentSessionId,
  gameMode,
}: CanonicalCompletionIdempotencyKeyInput): string {
  return ["completion-v1", tenantId, unitKey, launchCode, studentSessionId, gameMode]
    .map((value) => encodeURIComponent(value.trim()))
    .join(":");
}
