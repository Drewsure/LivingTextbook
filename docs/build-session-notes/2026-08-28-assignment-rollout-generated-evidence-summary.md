# Build Session Note: Assignment Rollout Generated Evidence Summary

Date: 2026-08-28

## Slice

Added a generated-package evidence count to the assignment rollout summary metrics.

## Why

Teachers and tenant admins need a quick scan before reading detailed rollout cards. Generated-package evidence should be visible without implying readiness or activation.

## Guardrails

- Informational metric only.
- No scheduling.
- No assignment activation.
- No evidence approval.
- No storage write.

## Verification

Run:

```powershell
npm run verify:assignment-rollout
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run verify:routes
```
