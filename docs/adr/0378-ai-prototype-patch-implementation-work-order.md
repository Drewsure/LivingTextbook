# 0378. AI prototype patch implementation work order

## Status

Accepted

## Context

Patch authorization release locks now make the final no-file-work boundary visible. The next risk is allowing a future patch to begin without a narrow work order that names file groups, dry-run verification, rollback proof, and support-language boundaries.

## Decision

Add a review-only AI prototype patch implementation work order to tenant generator routes after the patch authorization release lock.

The work order must show required-before-work records, allowed future file groups, dry-run verification order, rollback plan, blocked actions, and next required records. It cannot execute work, write files, generate patches, run tests, invoke Playwright, mutate routes, promote packages, assign students, or trigger support-language progress.

## Consequences

- Future Codex patch work has a tighter pre-implementation scope.
- White-label tenants can review the same work-order structure for hosted or closed-local deployments.
- This does not implement a patch writer, test runner, route mutation, or package promotion workflow.
