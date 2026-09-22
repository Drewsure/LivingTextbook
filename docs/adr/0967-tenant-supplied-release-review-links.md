# ADR 0967: Tenant-Supplied Release Review Links

Status: Accepted

## Context

The release-readiness panel is a reusable white-label surface, but its first
review-workbench map embedded the Sample Publisher requirements route. That
would make a future tenant-facing release view appear to belong to the sample
tenant and could send an operator across tenant boundaries.

## Decision

Make release review links an explicit page-supplied contract. The reusable
panel renders only the links it receives; the tenant-scoped page owns the
requirements route and may later resolve the complete link set from the
tenant/package release record.

## Consequences

- MiniStar and publisher tenants can use the same release panel without
  inheriting another tenant's requirements path.
- Link routing remains review-only and does not authorize storage, promotion,
  external game import, QR mutation, or student launch.
- A production tenant resolver must provide the same scoped link contract
  before the panel is used beyond the sample pages.

## Verification

- `node scripts/verify-white-label-release-readiness.mjs`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web -- --webpack`
- `npm run verify:routes`
