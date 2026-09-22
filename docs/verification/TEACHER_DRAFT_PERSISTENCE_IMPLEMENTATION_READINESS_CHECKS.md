# Teacher Draft Persistence Implementation Readiness Checks

## Purpose

This check defines the handoff from review-only teacher draft evidence to a future persistence adapter implementation. It is a work-order packet, not an implementation approval.

## Required assertions

- The packet is bound to the exact tenant, draft, source package, acceptance readiness, provider-selection preflight, adapter plan, and review-decision readiness records.
- Provider selection, implementation, migration, writes, uploads, route mutation, live test execution, assignment, and package promotion remain blocked.
- The adapter candidate is identified as a candidate plan only; it is not selected or activated.
- Acceptance tests cover tenant isolation, source lineage, owner/policy binding, deterministic idempotent save, raw audio/transcript exclusion, retention/export/deletion, hosted/local parity, rollback/recovery, and assignment/promotion guards.
- Test definitions may be reviewed, but no live provider or database execution is implied.

## Verification

Run:

```powershell
npm run verify:source-draft-import
npm run verify:runtime-behavior
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

The persistence workbench should show the **Teacher draft persistence acceptance packet** with a blocked, provider-neutral status.

