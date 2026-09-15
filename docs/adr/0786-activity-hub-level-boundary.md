# ADR 0786: Activity Hub Level Boundary

## Status

Accepted

## Decision

The student activity hub filters curated offers and no-map fallback items with
the game catalog's `supportedLevels` rule before displaying them. The unit's
curriculum level is the input for this presentation check.

## Rationale

The hub is a learner-facing route map. It must not display a game that the
direct route would later reject as outside the unit level. Keeping this rule at
both curated and fallback presentation boundaries reduces confusing dead ends
and preserves the white-label curriculum contract.

## Consequences

- Unsupported game modes are omitted from the student hub.
- Direct route, progression, curated offer, and audio gates remain required.
- Teachers may still review package data through teacher-facing surfaces.
- This is a foundation safety change only; it does not enable live services or
  promote external Phaser source.
