# DR-977: Memory Match Audio Event Order

## Decision

The canonical Memory Match interaction records `round_shown` before its first
term-level `audio_requested` event.

## Required Invariants

- A visible round is established before supporting learning audio is recorded.
- Learning audio remains support-only and cannot trigger progress or rewards.
- Replay and report consumers can associate the audio request with the round.
- Frozen Phaser candidates must follow the same ordering when reviewed.

## Evidence

- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`
- `docs/adr/0905-memory-match-audio-event-order.md`
