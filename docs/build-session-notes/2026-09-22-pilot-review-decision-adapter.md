# Build Session: Pilot Review Decision Adapter

## Goal

Rehearse future persistence operations without allowing a provider to mutate
review state or activate a classroom.

## Completed

- Added the shared review-only adapter for validate, write, restore, and
  export operations.
- Added tenant, package, and persistence-mode identity checks.
- Added explicit no-side-effect adapter results to hosted/local sample
  rehearsals.
- Recorded ADR 0949 and DR-1021.

## Next gate

Keep provider implementation deferred until retention, audit, school policy,
and production write approval are accepted.
