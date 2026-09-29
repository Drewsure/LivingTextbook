# ADR 1299: Shared Quarantine Package Identity

Status: Accepted

## Context

Seven review and delivery API routes independently derived a default package
id from tenant and unit key. Small differences could split source, evidence,
packet, delivery, and release lineage.

## Decision

Use `deriveQuarantinePackageId` as the single default derivation contract.
Explicit package ids remain supported only when supplied by the reviewed
request path.

## Boundaries

- The helper is deterministic and bounded.
- It does not authorize package assembly, promotion, QR printing, persistence,
  or student use.
- Durable review records still validate tenant, quarantine, package, and
  checksum identity.
- A later explicit package id must still pass existing route and packet checks.

## Verification

- `npm run verify:upload-quarantine-intake`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:publisher-intake-rehearsal`
- `npm run verify:routes:preview`
