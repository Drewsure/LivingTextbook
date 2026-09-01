# Tenant Navigation Boundary Checks

Status: Active foundation check

## Purpose

Keep white-label navigation rules visible before more teacher/admin routes become active.

## Required Surface

`/teacher/intake` must show a review-only tenant navigation boundary panel with:

- White-label navigation boundary
- Shared platform routes
- Tenant-scoped review routes
- Sample-publisher-only operational routes
- MiniStar not created yet
- Review shortcut only
- No cross-tenant navigation bleed
- No upload activation
- No release-state mutation
- No local package export
- No assignment activation

## Non-Activation Rule

The panel is a route map, not a workflow launcher. It cannot create upload inputs, storage writes, evidence exports, release mutations, local packages, assignments, or live classroom launches.

## Verification

Run:

```powershell
npm.cmd run verify:review-keys
npm.cmd run typecheck --workspace @living-textbook/web
npm.cmd run build --workspace @living-textbook/web
npm.cmd run verify:routes
```
