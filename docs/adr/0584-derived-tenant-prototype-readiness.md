# ADR 0584: Derived Tenant Prototype Readiness

Status: Accepted

## Decision

Tenant prototype readiness summaries must derive their queue, evidence-alignment, returned-manifest, and package-availability lanes from records belonging to the selected tenant. A tenant with no matching record must show a missing lane rather than inherit the platform summary’s status.

## Context

Explicit tenant identity prevents cross-tenant labeling, but identity alone does not prevent cross-tenant readiness data from being reused. White-label review needs both scoped records and scoped derivation before a future Z.ai handoff can be trusted.

## Consequences

- Tenant review surfaces show evidence for the tenant being reviewed.
- Empty tenant data is visible as missing and cannot accidentally look ready.
- The platform summary remains useful for the global workbench while tenant routes become the insertion point for future tenant-specific evidence providers.
- No import, integration approval, route creation, or student workflow is enabled.

## Verification

Prototype-review verification, web typecheck, full foundation verification, production build, and active route checks remain required.
