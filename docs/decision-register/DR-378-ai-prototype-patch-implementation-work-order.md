Decision: Add review-only AI prototype patch implementation work orders before any generated prototype patch can become app file work.

Rationale: Patch authorization release locks prevent premature action, but future file work also needs a visible work order that names required records, allowed file groups, dry-run verification order, rollback proof, and blocked actions.

White-label impact: Positive. Tenants can later adopt hosted, closed-local, or hybrid patch policies while the platform keeps one work-order vocabulary.

Cost impact: Positive. This avoids expensive test harnesses, browser automation, and patch work until the future implementation scope is narrow and reviewable.

Blocked actions:
- No work order execution.
- No app file write.
- No app patch generation.
- No test execution.
- No Playwright run.
- No route mutation.
- No scoring or reward mutation.
- No package promotion.
- No assignment.
- No support-language progress trigger.

Verification:
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

Follow-up:
- Add backend-neutral storage coverage for patch implementation work orders before any authorization capture, patch writer, or app file work exists.
