# ADR 0876: Release-Control Evidence In The Revocation And Rollback Chain

## Status

Accepted for foundation rehearsal.

## Context

The policy acceptance preview now carries the authoritative release-control
evidence, but the revocation/rollback plan and its impact matrix could still
reconstruct release state locally. That would make an emergency policy or media
withdrawal plan harder to audit and could allow stale evidence to influence a
future route or package decision.

## Decision

Carry the exact release-control evidence from the acceptance-record preview
into the revocation/rollback plan and from that plan into the rollback impact
matrix. Render the binding identity, decision, and blockers while preserving
review-only, no-mutation behavior.

## Consequences

Rollback planning is now traceable to the same release evidence as policy and
pilot review. No revocation, rollback, QR redirect, deletion, media
replacement, local deactivation, entitlement change, or classroom shutdown is
enabled by the chain.
