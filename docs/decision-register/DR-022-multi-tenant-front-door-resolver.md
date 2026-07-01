# DR-022: Multi-Tenant Front Door Resolver

Status: Accepted

Date: 2026-07-01

## Decision

Resolve `/enter/[tenantId]` through tenant/package/access-policy demo data instead of hard-coding MiniStar in the route.

## Rationale

Printed textbook QR codes and partner front doors are a core white-label requirement. Supporting a second tenant through the same route proves the route contract and prevents MiniStar-specific assumptions from hardening.

## Accepted Scope

- Add a sample front-door resolver.
- Keep MiniStar and sample publisher front doors working.
- Keep front-door launch state local and demo-only.
- Preserve target-language entry gates after the front door opens.

## Deferred Scope

- Database-backed route registry.
- Production authentication.
- Teacher-created launch sessions.
- Real classroom rosters.
- Partner admin UI for entry/user code management.

## Verification

Use `docs/verification/SECOND_TENANT_PACKAGE_CHECKS.md` and verify both `/enter/ministar` and `/enter/sample-publisher`.
