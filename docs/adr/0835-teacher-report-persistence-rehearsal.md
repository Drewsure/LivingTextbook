# ADR 0835: Teacher Report Persistence Rehearsal

## Status

Accepted for foundation hardening.

## Context

Teacher report validation and backend storage contracts already existed, but
they were not exercised together. That left a gap where a future provider
adapter could preserve one layer while dropping event-acceptance summaries,
settings context, or tenant boundaries from another.

## Decision

Add a provider-neutral rehearsal adapter that validates the teacher report
request, the `teacher-report-package` persistence intent, and the durable
record contract as one unit. The adapter remains review-only and always
returns `sideEffect: "none"`.

## Consequences

- Report persistence drift is detected before provider code is introduced.
- Hosted and closed/local white-label deployments share the same safety
  boundary.
- The platform still cannot claim live report persistence or export readiness;
  those require a later provider-specific approval.
