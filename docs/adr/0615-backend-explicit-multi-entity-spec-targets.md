# ADR-0615: Explicit Multi-Entity Spec Targets

Status: Accepted

## Decision

Any migration candidate that spans more than one schema entity must give every
actionable migration specification an explicit `targetEntities` list. A
specification cannot silently inherit a broad multi-entity candidate target.

Deferred candidates may have no specifications and therefore do not need a
target list until they become actionable.

## Why

Candidate targets describe an implementation slice, while specifications
describe materialized records. Requiring explicit targets at the point a spec
becomes actionable prevents ambiguous primary keys, accidental field joins,
and adapter-specific guesses.

## Guardrails

- Explicit targets must remain a duplicate-free subset of candidate targets.
- Field, requiredness, and primary-key validation use the explicit list.
- Candidate coverage remains visible for sequencing and migration planning.
- This gate does not select a provider or enable storage writes.

## Consequences

Future multi-entity backend work must define its record boundaries before
adapter design. The rule supports separate release, audio-coverage,
release-control, and settings stores within one broader migration slice.
