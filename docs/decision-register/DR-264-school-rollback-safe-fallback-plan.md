# DR-264: School Rollback Safe Fallback Plan

## Decision

Add a read-only safe fallback plan for school rollback and route-pause scenarios.

## Why

Printed QR codes and local companion packages need safe student and teacher messages before rollback can affect routes. This prevents a future rushed redirect from exposing private policy details, learner data, or confusing children.

## Guardrails

- No production QR redirect mutation.
- No live notification.
- No classroom shutdown workflow.
- No learner-data disclosure.
- No report export.
- No media replacement.
- No local bundle deactivation.
- No student reassignment.

## Verification

`npm run verify:release-control` and active route verification must confirm the safe fallback plan is visible and blocked.
