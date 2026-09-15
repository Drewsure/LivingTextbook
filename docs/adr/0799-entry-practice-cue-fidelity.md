# ADR 0799: Entry Practice Cue Fidelity

## Status

Accepted for the foundation slice.

## Context

The entry practice card already resolved authorized audio cues for the active
unit. Some learner-facing controls were not passing those cue objects to the
shared audio primitive, so an approved recording could be bypassed in favor of
speech synthesis.

## Decision

Flashcard Practice passes reviewed instruction, vocabulary, sentence, and
completion cues into `AudioCueText`. The shared control still uses speech
synthesis when no playable approved asset is available.

## Consequences

- Tenant-provided recordings are honored consistently in the first learner
  entry slice.
- Speech remains a cost-efficient and resilient fallback.
- Audio playback cannot by itself satisfy the English listening gate, unlock a
  game, award Star Dust, or alter reporting.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation` after the slice is complete.
