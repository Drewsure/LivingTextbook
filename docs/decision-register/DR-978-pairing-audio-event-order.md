# DR-978: Pairing Audio Event Order

## Decision

Canonical pairing modes record `round_shown` before term-level
`audio_requested` evidence for a selected card.

## Required Invariants

- Memory Match and Match Up establish the visible interaction first.
- Learning audio remains support-only and cannot trigger progress or rewards.
- Replay and report consumers can associate card audio with its round.
- Frozen Phaser pairing candidates must preserve the same ordering when reviewed.

## Evidence

- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`
- `apps/web/src/features/game-shell/pairing/PairingMatchUpGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`
