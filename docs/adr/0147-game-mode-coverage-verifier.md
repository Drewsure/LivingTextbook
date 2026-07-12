# ADR 0147: Game Mode Coverage Verifier

## Status

Accepted

## Context

The platform is intentionally reusable-engine first. As Z.ai or other builders prototype game modes, the shared `GameModeId` union must stay aligned with catalog metadata, engine mapping, learner-audio requirement, and deterministic scoring profile mapping.

## Decision

Add `npm run verify:game-modes` and include it in `npm run verify:foundation`.

## Consequences

- The verifier fails when a shared game mode is missing from the game mode catalog.
- The verifier fails when a game mode lacks scoring profile mapping.
- The verifier fails when a game mode does not declare required learner audio.
- Future external game prototypes must update the shared catalog before they can be treated as platform modes.
