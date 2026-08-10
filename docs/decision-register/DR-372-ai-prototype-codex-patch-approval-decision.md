# DR-372: AI Prototype Codex Patch Approval Decision

Decision: Add review-only Codex patch approval decision previews before any prototype patch can move toward app file work.

Rationale: The platform needs a visible adult/admin approval checkpoint after patch scope, test readiness, harness planning, route safety, rollback, storage, and reviewer identity evidence have been reviewed. This keeps prototype integration disciplined while preserving the option to use outside builders such as Z.ai under Codex control.

White-label impact: Strongly positive. Tenants can see a consistent approval boundary that does not hard-code MiniStar rules, while MiniStar-specific hiragana support constraints remain tenant policy.

Cost impact: Positive. The decision preview avoids running test harnesses, invoking Playwright, writing files, or activating paid workflows until a future storage and signed approval flow is accepted.

Blocked actions:

- No Codex patch approval.
- No app file write.
- No app patch generation.
- No test execution.
- No Playwright run.
- No route mutation.
- No student-facing route.
- No scoring or reward mutation.
- No audio manifest mutation.
- No package promotion.
- No assignment.
- No support-language progress trigger.

Follow-up:

- Add a backend-neutral storage contract for `codex_patch_approval_decision` before any patch approval can be recorded.
