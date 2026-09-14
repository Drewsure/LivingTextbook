# ADR 0739: Shared Learning-Audio Replay Handoff

## Status

Accepted

## Context

The playable route shell resolves one canonical replay seed and passes it to
the mounted game. Its shared learning-audio contract, and the same contract
rendered directly by flashcard entry practice, could create an
`audio_requested` event without that seed, causing a platform-issued replay to
be mixed with the fallback unit/mode seed before completion validation.

## Decision

Pass the resolved `replaySeed` through every caller into
`GameLearningAudioContractCard`, and include it when the card creates its
audio evidence. The shared card must not resolve a separate seed.

## Consequences

All shell and game audio evidence remains replay-compatible, including audio
requested before the first game interaction. This does not enable live
storage, scoring, progression, rewards, assignment, or source promotion.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, both
workspace typechecks, and `npm run verify:foundation`.
