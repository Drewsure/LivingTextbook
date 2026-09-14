# ADR 0753: Explicit Speech Primitive Language

## Status

Accepted

## Context

Route and game callers had been repaired to pass target language, but the
shared speech primitives still declared English as an optional fallback. That
left a future caller able to omit language and silently produce the wrong
learner voice.

## Decision

Make `language` required on `AudioCueText`, `AudioCueButton`, and
`playAudioCueText`. Remove their English defaults. The explicit target-language
resolver at tenant/unit boundaries remains responsible for supplying the
platform baseline when content does not configure a language.

## Consequences

Missing language handoffs fail at typecheck time and are visible in canonical
verification. Reviewed cue language and approved assist language remain
caller-selected and separate. No unlock, scoring, persistence, reporting,
assignment, reward, or Phaser source-promotion behavior changes.

## Verification

Run workspace typecheck, `npm run verify:canonical-games`, the active route
verifier, and the full foundation suite.
