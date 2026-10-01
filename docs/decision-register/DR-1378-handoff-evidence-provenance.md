# DR-1378: Handoff Evidence Provenance

## Decision

Carry evidence origin into the publisher delivery handoff and expose a
validated package-evidence provenance summary.

## Context

Package review now distinguishes publisher assets from platform-derived game
evidence. The handoff must preserve that distinction for the eventual pilot
packet instead of collapsing all references into opaque identities.

## Consequences

- Reviewers can reconcile custody by lane and reference identity.
- Canonical game evidence remains distinct from publisher uploads.
- The handoff stays review-only and side-effect-free.
- No release, promotion, QR, persistence, or student-use permission is implied.

## Verification

`node scripts/verify-publisher-delivery-handoff-record.mjs`

`node scripts/verify-live-release-lineage-boundary.mjs`
