# ADR 0588: Tenant-Scoped Prototype Return Readiness

Status: Accepted

## Decision

Derive prototype-return readiness separately for each tenant workbench. The summary must carry an explicit tenant identity, filter returned-package checklists by that tenant, and derive its lanes and Codex return-review state from those records.

## Context

The intake readiness path already isolates queue, evidence, and manifest state by tenant. Reusing one platform-wide return summary on tenant routes could show another publisher's checklist or readiness state in the wrong white-label workspace.

## Consequences

- MiniStar and partner tenants receive independent returned-package readiness summaries.
- Missing tenant checklists remain missing rather than inheriting platform or another tenant's state.
- White-label isolation is preserved before any archive import, wrapper decision, or package promotion.
- The platform overview may continue to use the explicit `platform` summary.

## Verification

Prototype-review verification must protect the tenant factory and checklist filtering. Web typecheck, full foundation verification, production build, and active route checks remain required.
