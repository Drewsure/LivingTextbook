# ADR-0402: Active Playable Route Shell Consolidation

Date: 2026-08-21

## Status

Accepted.

## Context

The foundation now has active routes across entry, pairing, selection, arcade reinforcement, text-spelling, and speaking. Most non-entry playable routes need the same route-level scaffolding, while Flashcards has different entry-gate responsibilities.

## Decision

Use `PlayableGameRouteShell` for the active non-entry playable routes and keep Flashcards on its specialized entry flow.

## Consequences

- Positive: Future game routes begin with a proven route shell.
- Positive: Game-specific components can focus on interaction, audio, events, and scoring.
- Positive: Premium visual skins and future Phaser wrappers can be added around a stable route contract.
- Constraint: Speaking still owns microphone approval policy outside the shared shell.
- Constraint: Entry flashcards remain separate because they control target-practice readiness and first unlocks.
- Constraint: Z.ai prototype intake remains blocked until Codex opens the controlled review gate.

## Verification

See `docs/decision-register/DR-473-active-playable-route-shell-consolidation.md`.
