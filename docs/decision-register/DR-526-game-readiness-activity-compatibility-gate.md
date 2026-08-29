# DR-526: Game Readiness Activity Compatibility Gate

Status: Accepted

Date: 2026-08-29

## Decision

Show the reviewed activity pathway compatibility matrix on `/teacher/game-readiness`.

## White-Label Impact

Positive. Tenants and publishers can see which activities are offered, planned, premium, teacher-review, or blocked without assuming every textbook payload can be switched into every game.

## Cost Impact

Positive. Curated compatibility rules reduce expensive rework from unsupported conversions, unsafe public-library assumptions, unreviewed printables, or outside prototypes that do not fit the parent-engine model.

## Constraints

- `/teacher/game-readiness` remains review-only and cannot launch students, publish games, import prototypes, write routes, assign work, or save compatibility records.
- Compatibility decisions must preserve target-language progression, learner audio coverage, standard reporting, and support-language boundaries.
- Z.ai, Phaser, and outside prototype work must follow the compatibility matrix before Codex considers integration review.
