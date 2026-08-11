# 2026-08-11 - AI prototype patch change set preview

Added a review-only AI prototype patch change set preview after patch implementation work orders on tenant generator routes.

What changed:

- Added sample change-set preview data for MiniStar and sample publisher generator requests.
- Added a teacher/admin panel showing planned file changes, invariant checks, review blockers, blocked actions, and next required records.
- Wired the panel into `/teacher/generator/ministar` and `/teacher/generator/sample-publisher`.
- Updated generator verification, route verification, AI generator contract docs, focused checks, build sessions, ADR, and decision-register index.

Standing rule:

Change set preview is not patch execution. App patch writes, generated file writes, tests, Playwright runs, route creation, scoring/reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress stay blocked.
