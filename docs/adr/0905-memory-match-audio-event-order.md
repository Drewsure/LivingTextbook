# ADR 0905: Memory Match Audio Event Order

## Status

Accepted

## Decision

Memory Match records `round_shown` before requesting learning audio for the
selected card. The card remains tap-to-speak, but the replay sequence must
describe the visible round before recording its supporting audio request.

## Rationale

Canonical game evidence uses `round_shown` to establish the interaction
boundary and `audio_requested` as support evidence attached to that boundary.
Keeping that order makes browser replay, teacher reporting, and a future Phaser
wrapper compare the same sequence without treating listening as a gameplay
answer or progression trigger.

## Boundaries

- Audio remains support-only and cannot unlock, score, or complete a game.
- The platform-owned event adapter remains responsible for replay metadata.
- This decision does not authorize frozen-source import or route replacement.

## Evidence

- `apps/web/src/features/game-shell/pairing/PairingMemoryMatchGame.tsx`
- `scripts/verify-canonical-game-integrations.mjs`
- `docs/CANONICAL_GAME_INTEGRATION_STANDARD.md`
