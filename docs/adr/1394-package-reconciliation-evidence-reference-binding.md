# ADR 1394: Bind Publisher Evidence References Into Package Reconciliation

## Status

Accepted for review-only pilot foundation

## Context

Publisher evidence request IDs already survive intake, submission-manifest,
and review-handoff boundaries. Package reconciliation still exposed only
source assets and generic requirements, leaving a final provenance gap before
the package review packet.

## Decision

Add `publisherEvidenceRequestIds` to every package evidence lane. Derive the
IDs from the manifest evidence requests whose declared asset coverage
intersects that lane's source assets. Keep the game lane platform-derived and
source-asset-free. Reject unknown evidence references and any manifest
evidence request that is not represented by a reconciliation lane.

## Consequences

- Reviewers can trace publisher files through the complete intake, manifest,
  handoff, and package-reconciliation chain.
- Platform game evidence cannot be confused with publisher rights,
  accessibility, or scan evidence.
- The reconciliation remains metadata-only; package assembly, promotion, QR
  printing, persistence, and student-facing use remain blocked.
