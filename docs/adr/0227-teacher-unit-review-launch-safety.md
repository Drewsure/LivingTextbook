# ADR 0227: Teacher Unit Review Launch Safety

Date: 2026-07-15

## Status

Accepted

## Context

Teacher unit review routes summarize package evidence, activity paths, route readiness, and pilot blockers. This is the page most likely to become a future assignment launch surface, so it needs the same launch-safety boundary before live assignment behavior exists.

## Decision

Add a launch-safety card to teacher unit review routes.

The card states that assignment stays review-only, that no live classroom launch is available, that no production student accounts exist, that real learner data remains blocked, and that report export remains blocked.

## Consequences

- Teacher unit review routes now align with direct launch, front-door, private assignment, teacher session, and report package boundaries.
- `npm run verify:launch-safety` covers teacher unit review routes.
- This does not enable live assignment, launch buttons, report export, account creation, or real learner data collection.
