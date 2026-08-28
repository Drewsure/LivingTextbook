# DR-518: Package Writer Assignment Shell Guard Storage Contract

Status: Accepted

Date: 2026-08-28

Decision: Add a backend-neutral storage contract for assignment shell guards.

White-label impact: Positive. Assignment, private link, class roster, progress event, reporting, and launch-gate evidence can be persisted consistently across hosted, installed PWA, desktop, and local-classroom deployments.

Cost impact: Positive. Persisting assignment guard state before live assignment behavior reduces privacy, reporting, roster, and support risk while preserving a low-cost backend selection path.

Constraints:

- `ai_generated_package_writer_assignment_shell_guard` must preserve protected assignment surfaces, assignment safety checks, reporting safety checks, class roster boundaries, progress event taxonomy, launch-gate requirements, school policy requirements, and support-language assignment approval blocks.
- Storage contracts must remain backend-neutral and must not enable assignment writes, private assignment links, roster binding, progress streams, teacher report export, live classroom launch, raw audio/transcript storage, or support-language-only approval.
