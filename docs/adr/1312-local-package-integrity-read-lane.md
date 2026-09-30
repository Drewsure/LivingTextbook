# ADR 1312: Local Package Integrity Read Lane

## Status

Accepted for the publisher handoff and local-pilot review path.

## Decision

Expose the verified package integrity ledger through a separate bounded,
metadata-only read lane. The route requires the explicit integrity-read gate,
bounded tenant/package/version identity, and a package runtime that has already
validated every listed file. It returns checksums and byte counts only; it does
not return raw source payloads, create an archive, authorize export, mutate QR
aliases, activate a package, enable hosted persistence, or write learner data.

## Consequences

- A publisher or operator can inspect the exact checksum ledger used by the
  package handoff receipt.
- Future signing or archive export can consume this record without making the
  current read lane a release action.

