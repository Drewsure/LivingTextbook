# ADR 0226: Launch Safety Boundary Verifier

Date: 2026-07-15

## Status

Accepted

## Context

Launch safety copy now appears on direct student routes, front-door routes, private assignment links, teacher session monitors, and report package previews. These checks were present in the active route verifier, but the product rule deserves a focused command because it protects live classroom launch, real learner data, production accounts, and report export boundaries.

## Decision

Add `npm run verify:launch-safety` and include it in `npm run verify:foundation`.

The verifier checks source files and active route expectations for controlled-practice cards, session launch gate boundary panels, no-live-classroom-launch markers, no-production-account markers, real-learner-data blockers, and report-export blockers.

## Consequences

- Future route work has a dedicated launch-safety gate.
- `/teacher/intake` now exposes the launch-safety verifier as part of the foundation verification surface.
- This does not add live launch, account creation, report export, or learner data collection behavior.
