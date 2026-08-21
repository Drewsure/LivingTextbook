# 2026-08-21 Shared Game Completion Next Path

## Summary

Added a shared completion/next-activity surface for active non-entry game routes.

## Changes

- Added `GameCompletionNextCard`.
- Wired the card into pairing, selection, text-spelling, and speaking demo flows.
- The card reflects existing completion state and deterministic earned reward information.
- The card links learners to the next reviewed activity, the curated activity hub, and Training Academy.
- Active route verification now expects `Game complete path` and `Next Activity` on active non-entry game routes.

## Boundaries

- No scoring, unlock, storage, assignment, or event logic changed.
- No support-language, media, print, or Training Academy action can substitute for target-language completion.
- The card is structural navigation, not premium polish.

## Verification Target

Run `npm run verify:foundation` after route checks are updated.
