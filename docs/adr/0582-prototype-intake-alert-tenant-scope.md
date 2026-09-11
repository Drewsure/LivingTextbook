# ADR 0582: Prototype Intake Alert Tenant Scope

Status: Accepted

## Decision

Every prototype-intake alert must carry an explicit `tenantId`. A route must validate that the alert tenant matches the route tenant before showing the alert as contract-valid. The platform-wide game-readiness route uses the explicit `platform` scope; tenant prototype routes construct tenant-scoped alert records.

## Context

The LivingTextbook product is white-label. Prototype evidence, readiness, and eventual integration decisions must not cross tenant boundaries. A shared sample alert without an identity could make a partner route display MiniStar or platform state as if it belonged to that tenant.

## Consequences

- Tenant review routes cannot borrow another tenant’s intake signal.
- The shared UI remains reusable while its data identity is explicit.
- Tenant scoping does not imply a returned package, integration approval, or student-facing availability.
- Platform-level readiness remains available without pretending to belong to a school or publisher tenant.

## Verification

Runtime behavior must cover matching and mismatched tenant IDs. Prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
