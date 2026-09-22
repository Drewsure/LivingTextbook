# ADR 0992: Tenant-Scoped Front-Door Registry Integrity

## Decision

Validate every reviewed front-door registry before resolving a tenant route.
The registry must be internally unambiguous and must bind the same tenant
through the path, content package, access policy, launch session, progression
state, and permanent QR path.

## Why

White-label isolation is a foundation concern. A route that resolves correctly
for one tenant but can inherit another tenant's package or progress context is
not safe to turn into a durable QR or hosted redirect.

## Boundary

The validator is a static review boundary. It does not write route records,
create QR aliases, activate redirects, publish packages, assign learners, or
mark content student-ready.

## Evidence

- `apps/web/src/data/sampleTenantRouteRegistry.ts`
- `scripts/verify-front-door-route-boundary.mjs`
- `docs/verification/FRONT_DOOR_ROUTE_BOUNDARY_CHECKS.md`
