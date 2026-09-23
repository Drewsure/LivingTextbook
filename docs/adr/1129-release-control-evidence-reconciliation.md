# ADR 1129: Release-Control Evidence Reconciliation

## Decision

The tenant-scoped pilot release-control route consumes the same composite
browser/privacy/tenant evidence release binding that appears on the broader
release-readiness dashboard.

## Boundaries

The route remains a review surface. It exposes exact packet and adjudication
lineage, but cannot publish, activate assignments, release a local bundle,
mark a package student-ready, write hosted persistence, or mutate QR routes.

## Verification

- `npm run verify:routes`
- `npm run verify:foundation`
