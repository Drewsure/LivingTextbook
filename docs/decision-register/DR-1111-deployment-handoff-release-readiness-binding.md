# DR-1111: Deployment Handoff Release-Readiness Binding

## Decision

Bind the commercial deployment handoff to the white-label release-readiness
record and propagate its unresolved phase blockers into the hosted, local, and
packaged review artifacts.

## Required invariants

- Release-readiness identity is non-empty and tenant/package scoped by the
  handoff source packet.
- Release status is explicit: blocked, review-only, or pilot-ready.
- Release blockers remain visible and cannot be replaced by a deployment
  recommendation.
- Export, installation, activation, and QR/route mutation remain false.

## Status

Implemented and verified as review-only evidence.
