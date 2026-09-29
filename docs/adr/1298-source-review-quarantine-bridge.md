# ADR 1298: Source-Review Quarantine Bridge

Status: Accepted

## Context

Publisher source intake already wrote tenant-bound quarantine metadata and
exposed authorized review APIs, but the normal tenant source-review workspace
did not show that review contract. A publisher could enter source review and
then lose the operational handoff to scan, rights, evidence, and package
readiness review.

## Decision

Expose the existing `QuarantineMetadataReviewPanel` inside the tenant source-
review workspace. The panel remains a metadata-only bridge to authorized API
contracts; it does not read raw payloads, create file viewers, or mutate review
state.

## Boundaries

- Quarantine review remains tenant-scoped and authorization-protected.
- The bridge may show bounded identifiers and review endpoint contracts, never
  payload bytes, filesystem paths, or download URLs.
- Source extraction, package assembly, QR printing, persistence, release, and
  student use remain separate gates.
- Sample Publisher and MiniStar records remain filtered by tenant identity.

## Verification

- `npm run verify:source-review`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes:preview`
