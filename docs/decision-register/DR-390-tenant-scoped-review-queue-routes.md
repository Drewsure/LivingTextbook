# DR-390: Tenant-Scoped Review Queue Routes

Date: 2026-08-11

Status: Accepted

## Decision

Add tenant-scoped draft review queue routes at `/teacher/review/sample-publisher` and `/teacher/review/ministar` alongside the existing global `/teacher/review` workbench.

## Rationale

White-label partners need review surfaces that show only their own draft packages. A global workbench is useful for platform review, but a tenant route must not leak another tenant's generated draft content, source lineage, support-language policy, or approval blockers.

## Impact

The tenant routes reuse the same review queue panel and blockers, but filter queue items by tenant. Active route verification now checks both positive route content and forbidden cross-tenant text.

MiniStar remains separate from the sample publisher route and keeps English target-language and hiragana support-language boundaries visible.

## Verification

- `npm.cmd run verify:teacher-authoring`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run verify:routes`
