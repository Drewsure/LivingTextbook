# ADR 0471: Tenant Navigation Boundary Panel

Status: Accepted

Date: 2026-09-02

## Context

The app shell now builds navigation from the current tenant, but that boundary was mostly implicit. As more upload, evidence, media, release-control, local companion, and assignment routes are added, future builders need a visible map that explains which paths are shared, tenant-scoped, sample-publisher-only, or not yet created for MiniStar.

Without this visible map, a future shortcut could accidentally place a sample-publisher pilot route inside a MiniStar page or reuse MiniStar media state on a partner page.

## Decision

Add a review-only `TenantNavigationBoundaryPanel` to `/teacher/intake`.

The panel shows:

- shared platform routes
- tenant-scoped review routes
- sample-publisher-only operational routes
- MiniStar routes that are intentionally not created yet
- cross-tenant guardrails
- blocked navigation actions

## Guardrails

- The panel is a review surface only.
- Navigation links and route examples cannot activate uploads, storage writes, evidence export, release-state mutation, local package export, assignment activation, or live classroom workflow.
- Tenant-scoped routes must enter navigation through route helpers or tenant-aware route data.
- Sample-publisher-only routes must not appear on MiniStar-branded pages until MiniStar-specific records exist.
- MiniStar-only media state must not appear on sample-publisher pages.
- Support-language content remains support-only, and target-language actions remain the only mastery triggers.

## Verification

- `/teacher/intake` must include the tenant navigation boundary text.
- Active route verification must check representative guardrails and blocked actions.
- Review-list keys must remain contextual to avoid duplicate React keys.

Commands:

- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
