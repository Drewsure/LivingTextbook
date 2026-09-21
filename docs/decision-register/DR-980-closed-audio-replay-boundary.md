# DR-980: Closed Audio Replay Boundary

## Decision

Canonical and Phaser candidate replays must reject `audio_requested` after
`game_completed`.

## Required Invariants

- A completed attempt is closed for replay and teacher-report grouping.
- Completion-screen audio is not silently merged into game evidence.
- Native and external candidate validators enforce the same boundary.
- Timestamp, tenant, launch, learner-session, and replay identity checks remain required.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`
