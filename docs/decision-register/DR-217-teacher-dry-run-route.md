# DR-217: Teacher Dry-Run Route

Date: 2026-07-15

## Decision

Add a focused teacher dry-run route for the sample publisher pilot package.

## Rationale

The teacher/admin intake page is too broad for a classroom rehearsal. A teacher needs one route that lists the exact rehearsal links and safety boundaries before students are invited.

## Standard

- Route: `/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run`.
- It must show `No classroom launch action`.
- It must render the teacher dry-run rehearsal contract.
- Intake and rehearsal panels should expose an `Open dry-run workspace` link.
- It cannot create assignments, launch students, collect real learner data, store live progress, export reports, or approve pilot status.
