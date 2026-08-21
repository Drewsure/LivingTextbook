# ADR-0409: Teacher Game Readiness Workbench Route

Date: 2026-08-21

## Status

Accepted.

## Context

Game architecture review now spans parent engines, active route replay, curated activity pathways, game settings, backend settings contracts, and outside AI prototype boundaries. Keeping all of that visible only inside `/teacher/intake` makes it harder to review the game layer without scanning unrelated policy, upload, storage, and release panels.

## Decision

Create `/teacher/game-readiness` as a focused review-only route for the current game foundation panels. The route is a navigation and evidence workspace, not an implementation switchboard.

## Consequences

- Positive: Game-readiness review gets a stable URL before Phaser wrappers, premium polish, or outside prototype intake.
- Positive: Z.ai work can later be compared against parent-engine and replay expectations without promoting code directly into `apps/web`.
- Constraint: The route must keep live prototype import, settings persistence, student launch, assignment, publish, storage, and upload behavior blocked.

## Verification

See `docs/decision-register/DR-480-teacher-game-readiness-workbench-route.md`.
