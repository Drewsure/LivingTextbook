# ADR 0270: School Rollback Safe Fallback Restoration Preview

## Status

Accepted.

## Context

The platform now has a review-only chain for safe fallback planning, preflight, and future activation. A complete safety model also needs a restoration view: if a future fallback were activated, schools must understand what would be required to restore normal route, media, local package, report, and assignment behavior.

## Decision

Add a review-only `Future safe fallback restoration record preview` beside the activation preview on school/admin review routes.

The preview names minimum restoration fields, not-restored markers, blocked actions, and review rules. It cannot restore routes, mutate QR targets, send notifications, restart classrooms, restore local bundles, replace media, export reports, or reassign students.

## Consequences

- School and publisher stakeholders can inspect future restoration responsibilities before implementation.
- Fallback activation is not treated as complete without a restoration plan.
- Future backend work has a clearer target if a policy-approved restoration workflow is ever built.
