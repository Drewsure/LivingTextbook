# DR-522: Assignment Rollout Generated Evidence Summary

Status: Accepted

Decision: Add a generated-package evidence count to the assignment rollout summary metrics.

White-label impact: Positive. Teachers and tenant admins get a clearer rollout readiness scan across generated and non-generated package paths.

Cost impact: Positive. The summary improves review usability without adding workflow complexity, live writes, or new infrastructure.

Constraints:

- The metric is informational only.
- It cannot schedule classes, activate assignments, approve evidence, or write storage.
- Detailed source evidence packet ids remain visible inside each rollout plan.

ADR: `docs/adr/0451-assignment-rollout-generated-evidence-summary.md`
