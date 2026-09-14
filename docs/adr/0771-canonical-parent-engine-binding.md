# ADR 0771: Canonical Parent-Engine Binding

## Status

Accepted

## Context

The platform has four parent engines and twelve active canonical modes. The
scoring profile was already checked at completion, but the event contract did
not require the completion evidence to identify the parent engine that owns the
mode. That left a preventable integration ambiguity for future Z.ai or Phaser
wrappers.

## Decision

Add a platform-owned `CANONICAL_GAME_PARENT_ENGINE_BY_MODE` map and require
matching `parentEngine` metadata on `mastery_updated` and `game_completed`
events. Missing or mismatched bindings invalidate the canonical completion
sequence.

## Consequences

Every active game route now proves both its scoring identity and its engine
identity before progression can accept completion. Outside prototypes must
adapt to the declared engine instead of introducing a parallel event model.
The change does not import frozen source, add persistence, or activate the
narrative engine.

## Verification

Run `npm run verify:canonical-game-replays`,
`npm run verify:runtime-behavior`, and the complete
`npm run verify:foundation` suite. The game-mode coverage verifier also checks
that the canonical map and web catalog remain aligned.
