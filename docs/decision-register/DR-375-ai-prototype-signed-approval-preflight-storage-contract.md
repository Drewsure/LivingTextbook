Decision: Preserve AI prototype signed approval preflights as backend-neutral durable records before any signature capture, approve button, or patch authorization can exist.

Rationale: The visible preflight names reviewer identity, scope locks, approval record draft fields, evidence checklist, cannot-approve blockers, and blocked approval actions. The platform needs an auditable hosted/local record so future approval work cannot be inferred from UI state or sample data.

White-label impact: Strongly positive. Tenants can later choose hosted, closed-local, or hybrid approval workflows while sharing the same approval preflight record shape.

Cost impact: Positive. This defers signed approval capture, identity workflow implementation, evidence uploads, test execution, Playwright runs, app file writes, route mutation, package promotion, and assignment until the evidence and policy gates are accepted.

Blocked actions:
- No signed approval capture.
- No approve button.
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
- Do not build live approval capture until reviewer identity, evidence attachment storage, release-control binding, school policy acceptance, and export/rollback expectations are accepted.
