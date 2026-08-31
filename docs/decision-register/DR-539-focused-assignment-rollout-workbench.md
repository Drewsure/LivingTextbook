# DR-539: Focused Assignment Rollout Workbench

Status: Accepted

Decision: Add `/teacher/assignments` as a focused assignment rollout workbench.

Rationale:

- Student assignments, private links, QR/front-door access, roster scope, and report blockers are core teacher workflow needs.
- A focused page makes assignment readiness easier to review than the broad intake route.
- White-label tenants need one governed assignment path that covers MiniStar, partner front-door pilots, and closed local companion drafts without creating separate shortcut workflows.

Guardrails:

- The route is review-only and cannot schedule a live class.
- Private assignment link activation, roster binding, progress streams, report export, live classroom launch, and real learner data collection remain blocked.
- Generated-package assignment handoff remains evidence-only until rollout, policy, persistence, reporting, rollback, and target-language gates pass.
- Active route and assignment-rollout verification must protect the route.

Verification:

- `npm.cmd run verify:assignment-rollout`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
