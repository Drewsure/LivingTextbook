# ADR 0829: Hosted Persistence Read Authorization

## Status

Accepted for foundation hardening.

## Context

The hosted progression endpoint supports both a student continuity read and a
teacher-only adapter probe. A coded tenant/package/launch/student identity is
useful for the probe, but it is not proof that the caller is allowed to read a
record.

## Decision

Require an explicit access purpose on every read. Authenticate student
continuity with the matching signed student session or server-only token, and
authenticate teacher review with the expiring tenant-scoped teacher session.
Reject missing or unknown purposes before the provider lookup.

## Consequences

- Rehearsal and durable providers share one privacy boundary.
- The teacher workbench remains useful without exposing learner records to an
  unauthenticated browser.
- A local or hosted deployment must configure the appropriate session boundary
  before its read path can be treated as available.
