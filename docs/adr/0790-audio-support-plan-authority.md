# ADR 0790: Audio Support Plan Authority

## Status

Accepted

## Decision

The unit audio support plan is the authoritative reuse manifest for learner
game audio. When a route calculates coverage, `gameModeAudioCueIds` may
authorize a cue whose source metadata is scoped to another mode, and the mode
plan determines whether vocabulary or sentence coverage is required.

## Rationale

Content packages commonly record a vocabulary cue against the entry practice
that first introduces it, while later games reuse that reviewed recording. A
runtime contract that ignores the plan either blocks valid activities or
silently treats every unit sentence as required for every game. The plan gives
white-label tenants an auditable, cost-efficient way to declare reuse without
making audio scope global or ambiguous.

## Consequences

- Every learner game route must pass its unit audio support plan to the shared
  coverage helper.
- A mode can be ready with only the cue families it actually uses.
- Missing or inconsistent plan references remain package-validation failures.
- This does not enable live uploads, live AI, or external Phaser promotion.
