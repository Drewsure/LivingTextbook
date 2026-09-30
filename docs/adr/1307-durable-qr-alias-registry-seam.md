# ADR 1307: Durable QR Alias Registry Seam

## Status

Accepted for the first saleable-pilot foundation. The writer is feature-gated
and production delivery remains controlled by human release approval.

## Decision

Persist an approved QR alias registry record separately from route mutation,
package swapping, and student activation. The record is tenant-, package-,
version-, manifest-, receipt-, and checksum-bound, and contains only alias,
fallback, target, deployment, and rollback metadata.

The writer uses an explicit custody root and the
`LIVING_TEXTBOOOK_PILOT_QR_REGISTRY_WRITES_ENABLED=true` gate. It writes
atomically, is idempotent for the exact same record, and returns a conflict for
different content at the same tenant/package/version path. Reads and writes
remain fail-closed when identity, path, or stored-record validation fails.

`routeMutationAllowed` and `studentFacingActivationAllowed` remain `false` in
the record and API response. A durable registry record is evidence for a future
release operation, not permission to publish or redirect learners.

## Consequences

- Local and hosted adapters can share one immutable registry contract.
- QR aliases can be reconciled without storing publisher payload bytes or
  learner records in the registry.
- A storage write is now testable without silently opening live delivery.
- Human release approval, local fallback rehearsal, rollback evidence, and
  explicit print authorization remain separate gates.
- The writer must remain disabled in ordinary development and review sessions.
