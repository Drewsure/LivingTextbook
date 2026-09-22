# ADR 0968: White-label Evidence Tenant Binding

Status: Accepted

## Context

White-label release readiness already bound pilot evidence to the readiness
tenant, but package reconciliation and release-control evidence were only
bound through package or gate identifiers. A reused or misrouted evidence
record could therefore look structurally valid while belonging to another
publisher.

## Decision

Package evidence and release-control evidence must each carry an explicit
`tenantId`, and the shared validator must require that value to match the
readiness tenant. A matching package id alone is not sufficient evidence of
tenant isolation.

## Consequences

- Cross-tenant package, approval, and release-gate evidence is rejected before
  a readiness view can consume it.
- Existing sample records now derive their tenant ids from the authoritative
  package and publish-gate records.
- Tenant-scoped evidence remains review-only; this change does not authorize
  persistence, promotion, QR mutation, or student launch.

## Verification

- `node scripts/verify-white-label-release-readiness-behavior.mjs`
- `node scripts/verify-white-label-release-readiness.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
