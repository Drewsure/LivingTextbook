# DR-981: Audio Mastery Boundary

## Decision

Canonical and Phaser candidate replays must reject `audio_requested` after
`mastery_updated`.

## Required Invariants

- Learning audio is contained within the active game attempt.
- Mastery closes learning evidence before the final completion event.
- Native and external candidate validators enforce the same ordering.
- Timestamp, tenant, launch, learner-session, and replay identity checks remain required.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`
