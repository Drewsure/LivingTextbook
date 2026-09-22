# DR-1064: Tenant-Scoped Front-Door Registry Integrity

Decision: validate the reviewed front-door registry before resolving a tenant
route so one tenant cannot inherit another tenant's package, access policy,
launch session, progression state, or permanent QR identity.

Required invariants:

- Route IDs, paths, and active tenant IDs are unique.
- The route path, content package, access policy, launch session, progression,
  and permanent QR path remain tenant-bound.
- The launch unit must be present in the bound content package.
- Registry validation remains review-only and cannot mutate routes, QR aliases,
  redirects, assignments, packages, or student-ready state.

Evidence: `apps/web/src/data/sampleTenantRouteRegistry.ts`,
`scripts/verify-front-door-route-boundary.mjs`, and
`docs/adr/0992-tenant-scoped-front-door-registry-integrity.md`.
