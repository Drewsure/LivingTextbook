# ADR 1263: Review-Only Delivery Mode Decision Sidecar

## Status

Accepted for the first saleable white-label pilot foundation.

## Decision

Record a tenant-scoped, immutable delivery-mode decision beside each real
quarantine submission. The allowed planning choices are `closed-local`,
`hosted-pwa`, and `hybrid`. The decision is surfaced in the live readiness and
delivery-manifest previews, but it never activates delivery.

The sidecar is gated by `LIVING_TEXTBOOOK_DELIVERY_MODE_DECISIONS_ENABLED` and
requires authorized review. It carries explicit false activation flags for
provider selection, persistence activation, package assembly, QR printing, and
student-facing use. Conflicting rewrites fail closed.

## Rationale

The publisher must be able to state the intended pilot shape before package
assembly and cost/policy decisions are complete. Keeping that choice separate
from activation preserves the closed-local fallback, makes hosted costs and
school policy explicit, and gives the handoff UI truthful live lineage.

## Consequences

- The first pilot can plan closed-local delivery without pretending that a
  deployable bundle already exists.
- Hosted and hybrid modes remain visible as choices but require their own
  provider, privacy, persistence, recovery, and release gates.
- The readiness preview can show a selected mode while correctly remaining
  blocked for delivery, QR printing, package release, and learners.
