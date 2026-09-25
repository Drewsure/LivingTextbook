# ADR 1187: Explicit Upstream Identity Carriage

## Status

Accepted for foundation scaffolding; production approval remains blocked.

## Decision

Require the assist-language audio decision-snapshot binding to carry the exact
reconciliation, reviewer-gate, and controlled human-review packet IDs in
addition to its composite release-review, decision-snapshot, release-control,
and approval-ledger identities.

## Boundaries

- Required upstream identities must remain tenant- and package-scoped.
- A composite binding label cannot substitute for an upstream record ID.
- The binding remains provider-neutral, review-only, and side-effect-free.
- Release, approval, promotion, persistence, export, activation, and student
  launch remain disabled.

## Verification

`verify:assist-language-audio-catalog-release-decision-snapshot-binding`
checks the explicit record set, identity comparison, cross-tenant rejection,
and tampered-fingerprint rejection.
