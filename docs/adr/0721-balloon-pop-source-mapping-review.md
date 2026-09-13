# ADR 0721: Balloon Pop Source Mapping Review

## Status

Accepted for review-only mapping; integration blocked

## Context

The frozen `Drewsure/ministar-lab` snapshot contains a Balloon Pop scene with
timed motion, target boxes, direct speech, and immediate feedback. It is a
useful second candidate after the pairing-first Memory Match review, but it
also contains scene-owned randomness, scoring, audio, identity, persistence,
and canvas lifecycle behavior.

## Decision

Record the reusable interaction and every required replacement boundary in
`docs/PHASER_BALLOON_POP_MAPPING_REVIEW.md`. Keep the frozen source isolated
and require a complete candidate return package before proposing a wrapper.
The external candidate order remains Memory Match, Balloon Pop, Label It, then
the gated voice candidate.

## Consequences

The team can evaluate the timing mechanic without confusing a promising Phaser
scene with an approved product integration. A future wrapper can reuse the
visual interaction only after deterministic replay, canonical scoring/audio,
platform identity, accessibility, and tenant policy evidence passes.
