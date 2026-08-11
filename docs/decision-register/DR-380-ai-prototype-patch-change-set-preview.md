Decision: Add review-only AI prototype patch change set previews before any generated prototype patch can exist.

Rationale: A work order identifies the future work lane, but a change set preview makes the future file-level scope explicit for reviewers before any patch is applied.

White-label impact: Positive. Tenants can review wrapper files, fixture mapping files, test files, and rollback notes without committing to one backend, game engine skin, or deployment profile.

Cost impact: Positive. This prevents expensive app patching, browser automation, and route work until the exact future file scope is visible and narrow.

Blocked actions:
- No apply patch.
- No app patch write.
- No generated file write.
- No test execution.
- No Playwright run.
- No route creation.
- No scoring or reward mutation.
- No audio manifest mutation.
- No package promotion.
- No assignment.
- No support-language progress trigger.

Verification:
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`

Follow-up:
- Add backend-neutral storage coverage for patch change set previews before any work-order execution or app patch workflow exists.
