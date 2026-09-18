# ADR 0831: Teacher Operations Session Synchronization

## Status

Accepted for foundation hardening.

## Context

The persistence workbench correctly protects status and operation-history
endpoints behind an expiring tenant-scoped teacher session. After sign-in,
however, sibling read-only panels remained in their anonymous protected state
until each teacher manually ran another check. That weakens the review flow
without adding safety.

## Decision

Add a small client-only session-change event carrying only the tenant ID.
Teacher sign-in and sign-out publish it. Status and operation-history panels
listen and re-run their read-only requests only when the event matches their
tenant. The event is never treated as authorization and contains no review
code, token, learner identity, or provider data.

## Consequences

- The review workbench becomes coherent immediately after access changes.
- Cross-tenant refreshes are ignored.
- Server-side authorization remains the only authority for diagnostics.
- The feature does not enable writes, exports, classroom launch, or live
  learner-data workflows.
