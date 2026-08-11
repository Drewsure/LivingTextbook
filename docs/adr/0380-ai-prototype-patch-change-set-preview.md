# 0380. AI prototype patch change set preview

Date: 2026-08-11

## Status

Accepted

## Context

AI prototype patch implementation work orders name future file groups, but reviewers also need to see a file-level change-set preview before any generated or returned prototype can become app file work.

## Decision

Add a review-only AI prototype patch change set preview to tenant generator routes after the implementation work order.

The preview names planned file changes, wrapper boundaries, fixture mapping files, event/audio test files, invariant checks, review blockers, blocked actions, and next required records.

## Consequences

- Future patch work can be reviewed as a narrow file-level plan before code changes exist.
- Patch application, app file writes, generated file writes, tests, Playwright runs, route creation, scoring/reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress remain blocked.
- MiniStar Foundation Japanese remains hiragana-only support while English remains the progress trigger.
