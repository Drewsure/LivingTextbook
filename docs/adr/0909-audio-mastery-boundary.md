# ADR 0909: Audio Mastery Boundary

## Status

Accepted

## Decision

Canonical game replays and isolated Phaser candidate replays must contain no
`audio_requested` event after `mastery_updated`. Learning audio belongs to the
active attempt and must finish before mastery is recorded.

## Rationale

Mastery is the point at which the platform accepts the learning result and
computes the deterministic award. Allowing audio after that point makes the
attempt's support evidence open-ended and can blur the boundary between game
play and completion review. The rule keeps report grouping, persistence, and
external wrapper behavior deterministic.

## Boundaries

- Audio remains support-only and cannot unlock, score, or complete a game.
- Completion-review audio must use a separate review context.
- This decision does not authorize frozen-source import or package promotion.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`
