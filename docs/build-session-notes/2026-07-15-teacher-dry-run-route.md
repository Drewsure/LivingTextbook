# Build Session Note: Teacher Dry-Run Route

Date: 2026-07-15

## Change

Added a focused teacher dry-run route:

- `http://127.0.0.1:3000/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run`

## Why

Teachers need a practical pre-classroom route that is simpler than the full intake page but still preserves the release-control boundaries.

## Verification

- Active route list includes the dry-run route.
- Active route verifier expects `Teacher dry-run route workspace`, `No classroom launch action`, `Rehearsal route shortcuts`, and the dry-run safety text.
- Teacher dry-run panels expose `Open dry-run workspace`.

## Boundary

The route does not schedule a class, create an assignment, collect real learner data, store live progress, export reports, or approve a pilot.
