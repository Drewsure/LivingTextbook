# DR-373: Codex Patch Approval Decision Storage Contract

Decision: Preserve Codex patch approval decisions as backend-neutral durable records before any patch approval or app file work can exist.

Rationale: The visible approval preview names patch scope, route safety, rollback, storage, reviewer identity, evidence checks, decision options, and blocked actions. The platform needs an auditable hosted/local record so future patch approval cannot be inferred from UI state or sample data.

White-label impact: Strongly positive. Tenants can review and export the same approval decision shape while choosing hosted, closed-local, or hybrid runtime paths later.

Cost impact: Positive. This defers signed approval capture, test execution, Playwright runs, app file writes, route mutation, and backend workflow automation until the evidence and policy gates are accepted.

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

- Keep future runnable patch work behind signed approval, route safety, rollback, storage verification, and narrowly scoped implementation tickets.
