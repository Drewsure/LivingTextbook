# ADR 1395: Preserve Publisher Request IDs In Immutable Package Review

## Status

Accepted for review-only pilot foundation

## Context

Package reconciliation now binds publisher evidence request IDs to source
assets, but the immutable quarantine package-evidence record still retained
only a generic lane review reference. The exact publisher provenance could be
lost before delivery handoff.

## Decision

Add `publisherEvidenceRequestIds` to each package-evidence reference. Require
at least one safe publisher request ID for every publisher-owned lane. Require
the platform-derived game lane to carry an empty request-ID list. Preserve the
same field in the delivery handoff summary and expose it in the bounded
review capture surface.

## Consequences

- Publisher evidence remains traceable through package review and delivery.
- Platform game evidence cannot be mistaken for publisher rights,
  accessibility, or scan evidence.
- Existing review and write gates remain unchanged: the record is immutable,
  metadata-only, assembly-blocked, promotion-blocked, QR-blocked,
  persistence-blocked, and student-blocked.
