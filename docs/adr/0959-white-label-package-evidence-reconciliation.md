# ADR 0959: White-Label Package Evidence Reconciliation

Status: Accepted

## Context

The white-label release dashboard can summarize governed phases, but a summary
alone is too weak for a publisher package. Package promotion must be grounded
in the actual source assembly, verifier, target-language audio, media rights,
publish, and assignment lanes.

## Decision

Bind the release-readiness record to the existing package-readiness
reconciliation through its tenant, package, source checksum, reconciliation
identifier, lane counts, and unresolved lane identifiers. Keep promotion and
student-facing activation permanently false in this foundation slice.

## Consequences

- A readiness summary cannot hide unresolved package lanes.
- Source identity and package identity are visible at the release boundary.
- The same evidence shape can support MiniStar and future publisher tenants.
- Lane reconciliation still does not authorize storage writes, approval, or
  student launch.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
