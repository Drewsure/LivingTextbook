# ADR 0765: Flashcard Entry Idempotence

## Status

Accepted

## Context

Teacher-QR entry practice can be submitted more than once through double taps,
refreshes, retries, or replayed requests. The entry adapter already recognized
completed Flashcards, but the runtime suite did not prove that a repeated
completion is side-effect free.

## Decision

Require repeated completed-entry submissions to return a completed result with
zero additional Star Dust and no duplicate completion or unlock events. The
original progression total must remain unchanged.

## Consequences

The Flashcards entry gate is safe to retry without duplicate rewards or
duplicate progression evidence. This is a local adapter contract only; it does
not authorize persistence, assignment, or Phaser source promotion.

## Verification

Run `npm run verify:runtime-behavior` and the complete
`npm run verify:foundation` suite.
