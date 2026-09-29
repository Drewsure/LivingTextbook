# DR-1014: Source-Review Quarantine Bridge

Status: Accepted

Decision: The tenant source-review workspace must expose the authorized
quarantine metadata review contract as the next operational step after source
submission.

Rationale:

- The saleable pilot needs a coherent publisher workflow from source intake to
  evidence review, not disconnected review pages.
- The existing API already preserves tenant custody and no-payload disclosure.
- Reusing that contract avoids a second storage or approval path.

Consequences:

- A publisher can find scan, rights, evidence, package handoff, and readiness
  contracts from the source-review workspace.
- The page remains review-only and cannot promote an upload or activate a
  learner route.
