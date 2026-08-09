# DR-358: AI Generated Package Writer Preflight

Decision: Show review-only generated package writer preflights on tenant generator routes after assembly dry runs.

Rationale: Before the platform ever writes generated package JSON or related route/media/local/assignment artifacts, reviewers need a visible target map for the future writer and its evidence requirements.

Cost impact: Positive. The preflight reduces rework by exposing missing policy, approval, media, local, assignment, and rollback records before engineering a writer.

Scope:

- Package JSON writer target.
- Route registry writer target.
- Media playlist writer target.
- Local companion writer target.
- Assignment shell writer target.
- Rollback map writer target.

Boundaries:

- No package writer execution.
- No package JSON commit.
- No route registry mutation.
- No media playlist creation.
- No local bundle packaging.
- No assignment activation.
- No student-ready marker.
- No support-language-only package writer.
