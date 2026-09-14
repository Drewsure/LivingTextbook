# ADR 0763: Canonical Flashcard Entry Slice

## Status

Accepted

## Context

Flashcards are the teacher-QR onboarding gate and the first target-language
practice surface. They intentionally use an entry completion adapter rather
than the unlocked-game wrapper contract used by the other active modes. The
static verifier previously checked the entry flow in several places, but did
not register it as a named canonical slice.

## Decision

Keep Flashcards as a separate canonical entry-slice contract. Its checks must
require reviewed target-language engagement for every term and sentence,
audio replay evidence, deterministic entry completion, next-mode policy use,
and an explicit rule that support-language practice cannot unlock the next
game. It must not be forced through the normal playable-game wrapper gate.

## Consequences

The platform now distinguishes twelve canonical learning slices: eleven
playable game wrappers plus one QR entry slice. This matches the product flow
and keeps the first learner action structurally different without weakening
shared audio, event, progression, or white-label rules.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:canonical-game-replays`,
and the complete `npm run verify:foundation` suite.
