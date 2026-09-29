# ADR 1267: Live Release Receipt Preview

## Status

Accepted.

## Decision

Derive a review-only release-receipt preview for every authorized quarantine
handoff from that submission's delivery-manifest preview. Show the receipt,
manifest, and package-index identities and the independent human closure checks
without recording approval or enabling release.

## Rationale

The saleable pilot needs a real publisher submission to have one traceable
release path. A static sample receipt is useful for contract examples but is
not evidence for a live publisher package.

## Consequences

- Operators can review release readiness against the actual quarantine.
- Approval and rollback remain separate human decisions.
- The future release writer must bind to this preview's identities and
  checksum, but cannot be invoked by the preview itself.
