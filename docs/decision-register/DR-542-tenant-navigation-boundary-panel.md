# DR-542: Tenant Navigation Boundary Panel

Status: Accepted

Date: 2026-09-02

Decision: Add a review-only tenant navigation boundary panel to `/teacher/intake`.

## Rationale

- White-label navigation boundaries should be visible before more tenant workbenches are created.
- The foundation dashboard needs to show which routes are shared, tenant-scoped, sample-publisher-only, or intentionally not created yet for MiniStar.
- This prevents future agents from treating sample-publisher pilot routes as universal platform routes.

## Guardrails

- Review shortcut only.
- No upload activation.
- No release-state mutation.
- No local package export.
- No assignment activation.
- No live workflow from navigation.
- No storage write from route shortcuts.
- No sample-publisher-only links on MiniStar pages.
- No MiniStar-only media state on sample-publisher pages.

## Verification

- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
