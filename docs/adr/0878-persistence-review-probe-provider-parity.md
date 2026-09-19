# ADR 0878: Persistence Review-Probe Provider Parity

## Status

Accepted for foundation hardening.

## Context

The progression API supports two explicit read purposes: student continuity and
teacher review. The process-memory rehearsal provider previously allowed a
teacher probe after tenant-scoped teacher authorization, while the SQLite branch
then required a learner session as well. That made review behavior provider-
dependent and could hide durable records from an authorized teacher.

## Decision

Authorize the request according to its declared purpose. A student-continuity
read requires the matching signed student session or server token. A
teacher-review-probe uses the already-verified tenant-scoped teacher review
authorization and does not require a learner cookie. Browser clients must keep
blocked policy, unauthorized access, missing records, provider unavailability,
and transport errors distinct.

## Consequences

Teacher diagnostics are consistent across rehearsal and durable providers while
learner records remain protected from unscoped reads. The route remains
provider-neutral, and no new write or export capability is introduced.
