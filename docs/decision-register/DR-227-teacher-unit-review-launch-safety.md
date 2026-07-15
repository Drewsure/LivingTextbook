# DR-227: Teacher Unit Review Launch Safety

Date: 2026-07-15

## Decision

Teacher unit review routes must show launch-safety status before package evidence, route readiness, or pilot blocker details.

## Rationale

Unit review is a natural future path into assignments. The foundation build must keep it explicitly review-only until launch policy, persistence, account boundaries, learner-data handling, and report export are accepted.

## Standard

- Teacher unit review routes must show `Launch safety`.
- Teacher unit review routes must show `Assignment stays review-only`.
- Teacher unit review routes must show `No live classroom launch`, `No production student accounts`, `Real learner data blocked`, and `Report export still blocked`.
- `npm run verify:launch-safety` must cover teacher unit review route markers.
