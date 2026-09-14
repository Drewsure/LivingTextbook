# ADR 0762: Canonical Game Replay Harness

## Status

Accepted

## Context

The canonical game validator and the eleven active game wrappers were already
covered by static checks, while the runtime behavior suite exercised a single
representative replay directly. A scoring-profile or event-contract mismatch
could therefore survive in another active mode until a route was manually
played.

## Decision

Run a deterministic synthetic replay through the shared canonical event
validator for every active `GameModeId`. Each mode must prove its mapped
scoring profile, completion dust cap, target-language audio, replay seed,
tenant/unit/launch/session identity, ordered completion events, and normalized
award acceptance.

## Consequences

The foundation suite now checks all twelve active modes cheaply without
creating routes, writing persistence, awarding learner rewards, or importing
Phaser source. The harness is contract evidence, not a substitute for visual
or browser interaction testing of a game implementation.

## Verification

Run `npm run verify:canonical-game-replays` and the complete
`npm run verify:foundation` suite.
