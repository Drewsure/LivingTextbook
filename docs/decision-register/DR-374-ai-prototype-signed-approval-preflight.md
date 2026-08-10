Decision: Add review-only AI prototype signed approval preflights before any patch authorization or signature capture can exist.

Rationale: The platform needs a visible adult/admin approval boundary after Codex patch approval decisions. Naming identity, scope, evidence, and cannot-approve blockers now prevents future AI-generated patch work from treating a visible UI option as a real approval.

White-label impact: Positive. Tenants can define their own reviewer identity and signature policy later while sharing the same preflight shape.

Cost impact: Positive. This avoids implementing paid identity/signature workflows, evidence uploads, test execution, Playwright runs, or app patching until the product package and school policy are accepted.

Blocked actions:
- No signed approval capture.
- No approve button.
- No app patch generation.
- No app file write.
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
- Add a backend-neutral storage contract for signed approval preflights before any approval capture UI or export packet can exist.
