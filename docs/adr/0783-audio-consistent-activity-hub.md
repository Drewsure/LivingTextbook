# ADR 0783: Audio-Consistent Activity Hub

## Status

Accepted

## Decision

The student activity hub will use the same `getGameAudioCoverage` contract as
the direct playable game route shell. A game offer can be unlocked by
progression and still be unavailable in the hub when target-language audio is
missing for the unit terms, target sentences, or the selected game's
instruction.

## Rationale

Showing a ready action that immediately leads to a blocked game creates a
confusing learner experience and hides a package-readiness defect. The hub is
the learner's route map, so it must show the effective state before the action
is offered. Audio readiness remains separate from progression readiness so
teachers can distinguish package review work from student performance.

## Consequences

- The hub adds an audio-review status and withholds the open-game action for
  incomplete audio coverage.
- Direct route gates remain necessary as a defense-in-depth boundary.
- White-label tenants use their own target language and content package cues;
  no MiniStar-specific rule is introduced.
- This remains a review/readiness change only and does not enable uploads, live
  AI, persistence, or Phaser source promotion.
