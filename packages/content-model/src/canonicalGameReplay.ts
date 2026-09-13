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

export interface CanonicalCompletionWriteCandidate {
  idempotencyKey: string;
  payloadHash: string;
  recordId: string;
}

export interface ExistingCanonicalCompletionWrite extends CanonicalCompletionWriteCandidate {}

export type CanonicalCompletionWriteResolution =
  | { outcome: "create"; candidate: CanonicalCompletionWriteCandidate }
  | { outcome: "return-existing"; existing: ExistingCanonicalCompletionWrite }
  | { outcome: "conflict"; reason: "payload-hash-mismatch"; existing: ExistingCanonicalCompletionWrite }
  | { outcome: "invalid"; errors: string[] };

/**
 * Plans the provider-neutral result for an idempotent completion write.
 * This function does not write storage; the selected adapter must enforce the
 * same atomic create-or-return-existing behavior at its durable boundary.
 */
export function planCanonicalCompletionWrite(
  candidate: CanonicalCompletionWriteCandidate,
  existing?: ExistingCanonicalCompletionWrite,
): CanonicalCompletionWriteResolution {
  const errors: string[] = [];
  if (!candidate.idempotencyKey.trim()) errors.push("completion idempotency key is required");
  if (!candidate.payloadHash.trim()) errors.push("completion payload hash is required");
  if (!candidate.recordId.trim()) errors.push("completion record id is required");
  if (errors.length > 0) return { outcome: "invalid", errors };

  if (!existing) return { outcome: "create", candidate };
  if (existing.idempotencyKey !== candidate.idempotencyKey) {
    return { outcome: "invalid", errors: ["existing completion does not match the lookup key"] };
  }
  if (existing.payloadHash === candidate.payloadHash) {
    return { outcome: "return-existing", existing };
  }
  return { outcome: "conflict", reason: "payload-hash-mismatch", existing };
}
