# ADR 1378: Preserve Evidence Provenance in the Delivery Handoff

## Status

Accepted for the review-only pilot foundation.

## Decision

The publisher delivery handoff record will preserve the origin of every
evidence reference and include a package-evidence provenance summary. Origins
are `publisher-asset`, `platform-derived`, and `delivery-control`. The summary
retains review status, review identity, lane/reference identities, and counts
for publisher assets versus platform-derived evidence.

## Why

The canonical game pathway is platform-derived, while content, media, rights,
and accessibility evidence may be supplied by a publisher. A final handoff
must make that custody boundary explicit so reviewers do not mistake a game
record for an uploaded asset or mistake a delivery-control record for proof of
release approval.

## Boundary

This is metadata-only review evidence. It does not authorize package assembly,
asset promotion, QR printing, persistence activation, or student-facing use.

## Verification

The handoff model validator, package-readiness route, read-only handoff panel,
focused handoff verifier, typecheck, live-release lineage verifier, and full
foundation composition must continue to pass.
