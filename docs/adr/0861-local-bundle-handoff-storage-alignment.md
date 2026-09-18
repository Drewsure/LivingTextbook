# ADR 0861: Local Bundle Handoff Storage Alignment

## Status

Accepted for foundation rehearsal.

## Context

The review-only local bundle handoff packet is now the shared evidence
contract, while the provider-neutral backend planning records still described
only the older checklist shape. That mismatch could cause a future adapter to
drop packet checks or safety boundaries during persistence work.

## Decision

Align the local companion handoff schema draft, migration candidate, and
migration spec with the shared packet. Persist `packet_id`, `mode`, `summary`,
`checks`, and `blocked_actions`, with `mode` fixed to `review-only` until a
separate release decision authorizes a new mode.

## Boundaries

This is a storage-contract alignment only. It does not create a database,
write packages, activate offline delivery, mutate hosted redirects, promote
students, or permit manual offline-ready overrides.

## Consequences

Hosted, local, and future provider adapters have one auditable handoff shape.
The storage readiness verifier now fails if any planning layer omits the
shared checks or blocked actions.
