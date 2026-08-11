# 2026-08-11 Dedicated Flashcard Entry Routes

## Summary

Added direct flashcard entry-practice routes for the MiniStar and sample publisher demo packages.

## Changes

- Added `/flashcards/[code]` with a reusable `FlashcardDemoFlow`.
- Reused the existing `FlashcardPracticeCard` to preserve target-language listening gates.
- Added `getFlashcardsPath`.
- Added Flashcards to teacher launch shortcuts, partner demo shortcuts, teacher unit review routes, active route matrix, package readiness checks, and active route checks.
- Updated route count expectations from 55 to 57.
- Expanded the active game-route contract verifier to include Flashcards.

## Boundaries

- `/launch/[code]` remains the classroom QR doorway.
- `/flashcards/[code]` is an activity route, not a production assignment route.
- Support language stays support-only and cannot unlock progress.
- No live package writing, QR publishing, upload promotion, or assignment activation was added.

## Verification Target

Run package, generator, route, typecheck, build, and full foundation verification after route wiring.
