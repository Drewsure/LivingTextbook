# DR-914: Source-to-Package Assembly Contract

## Decision

Add a shared source package assembly packet to connect reviewed extraction
evidence with candidate canonical packages without enabling promotion.

## Included

- Tenant/source/extraction/package identity and checksum.
- Candidate unit and media references.
- Required record inventory.
- Explicit false promotion guards.
- Review-only intake panel and runtime behavior checks.

## Excluded

File upload, extraction execution, storage, draft writes, package release,
route activation, QR mutation, and student assignment.

See ADR 0842.
