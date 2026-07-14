# ADR 0220: Classroom Launch Gate Route

Date: 2026-07-15

## Status

Accepted

## Context

The classroom launch gate is visible on the broad teacher intake page and the teacher dry-run route. A partner or school admin also needs a focused review route that shows the final go/no-go boundary without the rest of the intake surface.

## Decision

Add `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate` as a review-only classroom launch gate workspace.

The route renders the launch gate panel and source-route shortcuts. It does not invite students, create assignments, expose a launch button, collect real learner data, store live progress, export reports, or approve a pilot.

## Consequences

- Admins can review launch blockers without navigating the full intake page.
- Active route verification now checks 41 routes.
- The route remains a hard stop until release-control, evidence, dry-run, policy, and persistence gates pass.
