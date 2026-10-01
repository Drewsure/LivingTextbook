# ADR 1396: Preserve Evidence Lineage In Journey And Closure Review

## Status

Accepted for review-only pilot foundation

## Context

Structured publisher evidence request IDs now survive intake, package
reconciliation, immutable package review, and delivery handoff. The package
review journey and final delivery closure packet still exposed only broad
review identities, leaving the operator's final view less traceable than the
upstream records.

## Decision

Add exact `publisherEvidenceRequestIds` to the package review journey and
delivery closure packet. Derive the journey list from the submission manifest
and the closure list from the immutable package-evidence review. Validate
non-empty unique lineage and display it in both operator panels.

## Consequences

- The review operator can follow publisher rights, accessibility, and scan
  requests through the final review surfaces.
- A summary remains distinct from approval; it cannot bypass source, release,
  QR, persistence, policy, or student gates.
- The pilot remains metadata-only and blocked until real publisher evidence
  and human release decisions exist.
