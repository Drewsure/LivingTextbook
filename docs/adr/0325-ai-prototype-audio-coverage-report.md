# ADR 0325: AI Prototype Audio Coverage Report

## Status

Accepted

## Context

Returned game prototypes can pass fixture and event replay while still failing young learners if terms, sentences, instructions, feedback, or critical controls do not have reliable target-language audio. This is especially risky for early readers, English learners, speech-matching games, and teacher-led QR entry practice.

Audio coverage also has cost and safety implications. A prototype must not generate voice, trigger voice API billing, mutate audio manifests, write playlists, count media-only listening as mastery, or let support-language audio unlock progress.

## Decision

Add review-only AI prototype audio coverage reports to `/teacher/generator/sample-publisher` and `/teacher/generator/ministar`.

The report must show source records, target language, assist-language boundary, learning-audio priority, required cue families, target-language checks, control audio checks, support-language rules, replay evidence, failure triggers, and blocked actions.

## Consequences

- Returned prototypes must prove tap-to-speak or replay coverage for vocabulary terms, target sentences, instructions, feedback, and critical controls before integration review continues.
- Speech-matching and speaking modes must prove prompt replay audio before microphone scoring is considered.
- Support-language and background media remain support-only.
- MiniStar Japanese support audio remains hiragana-only for early levels and unable to unlock English progress.
- Audio reports remain review-only and cannot generate voice, trigger API cost, mutate audio manifests, write playlists, mark package audio complete, create routes, or assign students.
