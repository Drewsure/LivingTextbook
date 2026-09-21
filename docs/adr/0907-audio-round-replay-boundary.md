# ADR 0907: Audio Round Replay Boundary

## Status

Accepted

## Decision

The canonical event validator requires at least one `audio_requested` event
after `round_shown`. The Phaser candidate-package verifier enforces the same
ordering for returned evidence packets.

## Rationale

An audio request is supporting evidence for a visible learning interaction. It
must not be able to stand in for the round itself or appear detached from the
round in teacher reports and replay review. Enforcing the rule at the shared
validator protects both native routes and future external wrappers.

## Boundaries

- Audio remains support-only and cannot unlock, score, or complete a game.
- Timestamp and identity checks remain required in addition to this order rule.
- This decision does not authorize frozen-source import or package promotion.

## Evidence

- `packages/content-model/src/canonicalGameIntegration.ts`
- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-runtime-behavior.mjs`
