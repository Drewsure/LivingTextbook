Decision: Add review-only AI prototype patch authorization release locks before any generated patch can become app file work.

Rationale: Signed approval preflight is not sufficient by itself. Patch authorization also needs release-control binding, narrow file scope, accepted test evidence, route safety, rollback, storage verification, and reviewer identity evidence.

White-label impact: Positive. Tenants can later adopt different hosted/local approval policies while the platform keeps one release-lock vocabulary.

Cost impact: Positive. This defers patch execution, browser automation, file writes, route mutation, package promotion, and assignment until the implementation workflow is accepted.

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
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

Follow-up:
- Add backend-neutral storage coverage for patch authorization release locks before any authorization capture or patch writer work exists.
