Decision: Add backend-neutral storage coverage for AI prototype patch change set previews.

Rationale: A review-only change set needs durable planned file changes, invariant checks, review blockers, next records, and blocked actions before any future patch workflow can be considered.

White-label impact: Positive. Tenants can preserve the same file-level review vocabulary across hosted, closed-local, and hybrid deployments.

Cost impact: Positive. This blocks expensive patch application, generated file writes, tests, browser automation, and route work until the future implementation scope is narrow and approved.

Blocked actions:
- No apply patch.
- No app file write.
- No generated file write.
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
- Keep change-set records review-only until Codex makes a separate implementation decision for any actual patch workflow.
