Decision: Add backend-neutral storage coverage for AI prototype patch implementation work orders.

Rationale: Review-only work orders are useful only if future hosted and local storage can preserve the same evidence, allowed file scope, verification order, rollback plan, and blocked actions before any patch work begins.

White-label impact: Positive. Tenants can later adopt hosted, closed-local, or hybrid patch policies without changing the product vocabulary or weakening review gates.

Cost impact: Positive. This prevents premature test harnesses, browser automation, app file patches, route writes, and backend-specific migrations until the implementation scope is narrow and approved.

Blocked actions:
- No work order execution.
- No app file write.
- No app patch generation.
- No test execution.
- No Playwright run.
- No route mutation.
- No scoring or reward mutation.
- No audio manifest mutation.
- No package promotion.
- No assignment.
- No support-language progress trigger.

Verification:
- `npm.cmd run verify:backend-storage`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

Follow-up:
- Keep work-order records review-only until Codex makes a separate implementation decision for any actual patch workflow.
