# ADR 0268: School Rollback Safe Fallback Activation Preview

## Status

Accepted.

## Context

The safe fallback preflight defines what must be reviewed before any fallback behavior can move beyond planning. The next risk is ambiguity: teams may assume that a completed checklist means a live fallback action can exist.

## Decision

Add a review-only `Future safe fallback activation record preview` beside the safe fallback preflight on school/admin review routes.

The preview names the minimum future activation fields, not-activated markers, blocked actions, and review rules. It cannot activate fallback behavior, mutate releases or QR routes, send notifications, shut down classrooms, replace media, deactivate local bundles, export reports, or reassign students.

## Consequences

- School and publisher stakeholders can see the future record shape before implementation.
- Activation remains blocked even when fallback copy and preflight lanes are visible.
- Future backend work has a clearer target if a policy-approved activation workflow is ever built.
