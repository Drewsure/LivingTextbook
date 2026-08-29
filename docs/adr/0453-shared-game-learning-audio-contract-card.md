# ADR 0453: Shared Game Learning Audio Contract Card

Status: Accepted

Date: 2026-08-29

## Context

Every learner-facing game needs audio support because early learners and non-fluent readers cannot rely on written English alone. Existing game components used tap-to-speak controls, but the active route shell did not visibly state the target-language audio coverage rule or emit a standard event when route-level audio guidance was played.

## Decision

Add a shared learning-audio contract card to active student game routes. The card shows target-language term, sentence, and instruction cue coverage, states the target-language-only progress rule, and emits `audio_requested` as support-only evidence. Flashcards receive the same card directly because they use a specialized entry route.

## Consequences

- Future game modes and outside prototypes inherit one visible audio policy boundary.
- `audio_requested` becomes a classified shared event type and must remain support-only.
- Tap-to-speak, support language, and background media cannot unlock progress, award Star Dust, count as mastery, or mutate scoring.
- Route verification must check the contract on every active student game route.
