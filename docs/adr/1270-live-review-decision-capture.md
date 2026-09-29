# ADR 1270: Live Review Decision Capture

## Status

Accepted.

## Decision

Mount the existing gated review-decision write contract in the live publisher
handoff, with a single immutable source-review capture control.

## Rationale

The pilot needs an operational way for an authorized reviewer to record the
source checkpoint against the actual quarantine submission. A read-only
display alone cannot support a real publisher rehearsal.

## Consequences

- Operators can record accepted-for-package-review or changes-required from
  the handoff when the explicit review gate is enabled.
- The server remains authoritative for identity, idempotence, conflicts, and
  blocked capabilities.
- Release approval and all package/student-facing capabilities remain separate.
