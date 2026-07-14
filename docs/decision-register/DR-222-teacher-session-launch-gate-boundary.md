# DR-222: Teacher Session Launch Gate Boundary

Date: 2026-07-15

## Decision

Teacher session monitor routes must show a compact session launch gate boundary before deeper report, event, roster, media, or settings details.

## Rationale

Session reports can look operational before the platform has real launch policy, persistence, privacy, access control, and export workflows. Keeping the launch gate visible on the report route prevents preview reporting from being mistaken for pilot approval.

## Standard

- Teacher session monitor routes must show `Session launch gate boundary`.
- The same routes must show `No live classroom launch`, `Real learner data blocked`, and `Report export still blocked`.
- The panel may link to the classroom launch gate workspace, but it must not add a launch button, export button, live student session, or production learner data collection.
- Support language, media, and dry-run evidence remain reportable support signals only; target-language events remain the progression trigger.
