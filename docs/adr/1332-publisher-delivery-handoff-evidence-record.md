# ADR 1332: Publisher Delivery Handoff Evidence Record

## Decision

Add a versioned `PublisherDeliveryHandoffRecord` to the live publisher
handoff. It binds the source review, package review packet, delivery manifest,
release receipt, package index, assembly request, QR registry, and fallback
route identities into one inspectable record.

The record is deliberately metadata-only. It remains blocked and review-only;
it does not deliver files, include raw payload bytes, create a QR print
artifact, activate persistence, or enable student-facing use.

## Handoff contract

The record lists the four metadata files expected from a future approved
delivery (`delivery-package.json`, `delivery-manifest.json`,
`release-receipt.json`, and `handoff-record.json`) while reporting that none
are included at the review stage. It also exposes the planned fallback route
and the missing rollback reference so a future operator cannot mistake a
preview identity for a completed delivery.

## Consequences

- Publishers and reviewers can inspect one versioned handoff shape before a
  package writer is authorized.
- The package assembler, release receipt, QR print, and persistence gates stay
  independent and auditable.
- A later real delivery can replace preview-only evidence with approved
  evidence without changing the white-label contract.

## Verification

`npm run verify:publisher-delivery-handoff-record` validates the eight evidence
references, metadata-only file boundary, fallback and rollback fields, and
protected action flags.
