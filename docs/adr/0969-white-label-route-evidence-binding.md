# ADR 0969: White-label Route Evidence Binding

Status: Accepted

## Context

The release-readiness contract described route and deployment evidence as
belonging to the same tenant/package record, but route evidence carried only
global route counts and source identifiers. That left a gap between the
documented tenant-isolation rule and the data validator.

## Decision

Route and deployment evidence must carry explicit `tenantId` and `packageId`
values. The shared validator must require both to match the surrounding
release-readiness record before route health is accepted as evidence.

## Consequences

- A healthy global route sweep cannot be attached to another publisher's
  readiness record.
- Route evidence remains review-only and does not authorize launch, storage,
  offline delivery, QR mutation, or package promotion.
- Future tenant/package route reports must derive these identities from their
  authoritative release record rather than hand-entering them.

## Verification

- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `node scripts/verify-white-label-release-readiness.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
