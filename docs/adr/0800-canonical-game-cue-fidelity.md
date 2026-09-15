# ADR 0800: Canonical Game Cue Fidelity

## Status

Accepted for the foundation slice.

## Context

The canonical games already receive tenant- and mode-authorized audio cues.
Some instruction and feedback controls still invoked the shared audio primitive
without passing the corresponding cue, which made approved recordings
unavailable on those surfaces.

## Decision

Canonical game components pass their existing authorized instruction, prompt,
term, sentence, and feedback cues into `AudioCueText` or `AudioCueButton`.
Authored copy without a reviewed cue continues to use browser speech synthesis.

## Consequences

- Reviewed tenant recordings are honored consistently across the first-party
  game family.
- Speech synthesis remains a cost-efficient fallback for uncued interface copy.
- Audio source selection cannot change scoring, mastery, rewards, unlocks,
  microphone approval, or teacher reporting.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation` after the slice is complete.
