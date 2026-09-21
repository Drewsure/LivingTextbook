# DR-979: Audio Round Replay Boundary

## Decision

Canonical and Phaser candidate replays must place `audio_requested` after
`round_shown`.

## Required Invariants

- Audio evidence is attached to a visible learning round.
- Audio cannot stand in for `round_shown` or create progression evidence.
- Native and external candidate validators enforce the same ordering.
- Timestamp, tenant, launch, learner-session, and replay identity checks remain required.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`
