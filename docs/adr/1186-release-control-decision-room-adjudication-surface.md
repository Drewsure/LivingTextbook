# ADR 1186: Release-Control Decision-Room Adjudication Surface

## Status

Accepted for foundation scaffolding; production approval remains blocked.

## Decision

Expose the assist-language audio decision-snapshot adjudication binding in the
main tenant-scoped release-control decision room. The room and media review
surface must point at the same binding identity and source snapshot rather than
maintaining separate summaries.

## Boundaries

- The shared comparison must reject tenant, package, snapshot, decision,
  persistence-mode, and fingerprint drift.
- The route remains review-only and tenant-scoped.
- No release, persistence, approval, promotion, export, activation, or student
  launch action is introduced.

## Verification

`verify:assist-language-audio-catalog-release-decision-snapshot-binding`
includes matching-identity, cross-tenant, and tampered-fingerprint checks.
