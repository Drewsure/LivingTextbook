# 2026-08-11 Active Game Route Contract Coverage

## Summary

Closed an architectural route-contract gap by adding Speak It to the active route contract registry and strengthening `verify:game-modes`.

## Changes

- Added a `/speak/[code]` route contract.
- Updated the game-mode verifier to require route contract ids, route patterns, and route helpers for Memory Match, Quiz, Sentence Builder, and Speak It.

## Boundaries

- No new game mode was activated.
- No AI speech scoring, microphone persistence, assignment activation, or premium tutor behavior was added.
- Flashcards remain routed through the student launch entry flow.

## Verification Target

Run `npm.cmd run verify:game-modes`, then typecheck and production build.
