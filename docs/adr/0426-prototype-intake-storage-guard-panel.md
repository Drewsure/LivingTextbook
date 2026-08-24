# ADR 0426: Prototype Intake Storage Guard Panel

## Status

Accepted.

## Context

The foundation now models `prototype_intake_queue_item` as a backend-neutral hosted/local storage contract. The next risk is invisibility: if the contract only appears in schema and verifier files, a future build session could discuss Z.ai intake from the game-readiness page without seeing the storage requirements and blocked actions.

## Decision

Add `samplePrototypeIntakeStorageGuard` and `PrototypeIntakeStorageGuardPanel`. Render the panel on `/teacher/game-readiness` and tenant prototype review routes.

The panel shows:

- storage contract ids,
- visible storage fields,
- evidence required before review,
- blocked intake actions.

## Consequences

The prototype workbenches now make the storage contract visible before any outside game intake discussion.

This does not create real storage, upload, import, patch, route, scoring, reward, playlist, package, or assignment behavior.
