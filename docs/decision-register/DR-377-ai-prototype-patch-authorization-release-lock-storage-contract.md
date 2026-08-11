Decision: Preserve AI prototype patch authorization release locks as backend-neutral durable records before any patch authorization or app file work can exist.

Rationale: The visible release lock names release-control binding, signed approval acceptance, patch scope, test evidence, route safety, rollback, storage, reviewer identity, narrow authorization scope, and blocked actions. The platform needs an auditable hosted/local record so future patch authorization cannot be inferred from UI state or sample data.

White-label impact: Strongly positive. Tenants can later choose hosted, closed-local, or hybrid implementation workflows while sharing the same release-lock shape.

Cost impact: Positive. This defers patch execution, browser automation, file writes, route mutation, package promotion, and assignment until implementation policy and evidence gates are accepted.

Blocked actions:
- No patch authorization.
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
- `npm.cmd run verify:backend-storage`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

Follow-up:
- Do not build generated patch writer execution until signed approval, release-control binding, test evidence, rollback, storage, route safety, and rollback expectations are accepted.
