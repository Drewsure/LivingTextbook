# ADR 1344: Bind QR Registration To Released Delivery Custody

## Status

Accepted for the first saleable white-label pilot.

## Decision

The QR registry API must require the accepted quarantine review lineage and a
durable delivery metadata record before it can persist approved aliases. The
submitted delivery manifest and release receipt must match the stored records
by canonical JSON identity.

## Context

QR aliases are the bridge from a printed textbook page to the local or hosted
learning experience. Registering them before the package release is durable
would create a misleading custody record and weaken the operator's ability to
reproduce or roll back a package handoff.

## Consequences

- The controlled operator sequence is release metadata, QR registry, and then
  local package assembly.
- Missing or mismatched release custody fails closed before registry writes.
- Registry writes remain immutable, tenant-scoped, route-mutation-disabled,
  and student-facing-activation-disabled.
- This decision does not select hosted persistence or activate a student route.
