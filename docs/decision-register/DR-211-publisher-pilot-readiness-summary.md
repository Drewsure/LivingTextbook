# DR-211: Publisher Pilot Readiness Summary

Date: 2026-07-14

## Decision

Show a publisher-facing pilot readiness summary on `/teacher/intake`, derived from the package publish gate.

## Rationale

The product needs a clear white-label partner story: controlled demo evidence can be shown, but pilot release remains blocked until media rights, game/audio coverage, persistence, policy, reporting, and deployment gates close.

## Standard

- The package publish gate remains the source of truth.
- The summary may group data for readability.
- The summary must show `Demo-ready now`, `Pilot blockers`, `Missing evidence`, `Still not allowed`, `Source of truth: package publish gate`, and `No publish action`.
- No second hand-maintained readiness checklist is allowed for pilot status.
