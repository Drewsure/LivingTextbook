# DR-524: Shared Game Learning Audio Contract Card

Status: Accepted

Date: 2026-08-29

## Decision

Add a shared learning-audio contract to active student game routes and classify `audio_requested` as support-only progress evidence.

## White-Label Impact

Positive. Tenants can require learner-facing audio across game engines while preserving configurable target languages and preventing support-language shortcuts.

## Cost Impact

Positive. A single route-shell contract avoids every game prototype, Phaser wrapper, or outside build re-implementing audio policy and progress boundaries.

## Constraints

- Active game routes must show target-language term, sentence, and instruction audio coverage before the playable game surface.
- `audio_requested` events are teacher-visible and persistence-required, but support-only.
- Tap-to-speak, support language, and background media cannot unlock progress, award Star Dust, count as mastery, or mutate scoring.
- Flashcards keep the same contract even though they use the specialized entry route instead of `PlayableGameRouteShell`.
