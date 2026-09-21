# ADR 0908: Closed Audio Replay Boundary

## Status

Accepted

## Decision

Canonical game replays and isolated Phaser candidate replays must contain no
`audio_requested` event after `game_completed`. Completion closes the game
attempt for replay and reporting purposes.

## Rationale

Learning audio is supporting evidence for an active learning round. Allowing a
late audio request after the score is complete makes the attempt ambiguous and
can attach post-completion activity to a finished report. Closing the replay at
completion keeps native games, candidate wrappers, and future persistence
adapters deterministic.

## Boundaries

- Completion-screen audio belongs to a separate completion-review context.
- Audio remains support-only and cannot unlock, score, or complete a game.
- This decision does not authorize frozen-source import or package promotion.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`
