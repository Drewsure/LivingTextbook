# ADR 0859: Local Bundle Snapshot Asset Gate

## Status

Accepted for foundation rehearsal.

## Context

The local companion preview already shows per-asset evidence, but its future
machine-readable snapshot could otherwise calculate offline readiness from
other gates alone. That would allow a blocked asset to be hidden by an
aggregate package status.

## Decision

Include the shared asset-evidence aggregate in the snapshot and require zero
asset blockers before `offline_ready_allowed` can be true.

## Boundaries

The snapshot remains review-only. It does not read or copy files, write a
package, activate offline delivery, cache media, or expose a student route.

## Consequences

Future exporters receive one explicit asset gate and cannot bypass per-asset
evidence by relying on a different package-level status.
