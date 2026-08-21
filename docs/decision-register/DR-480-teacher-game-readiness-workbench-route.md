# DR-480: Teacher Game Readiness Workbench Route

Date: 2026-08-21

Status: Accepted

## Decision

Add a focused teacher/admin route at `/teacher/game-readiness` that gathers the game-only foundation panels for parent engines, active replay evidence, curated game offers, settings profiles, backend settings contracts, and outside prototype assignment gates.

## Rationale

The main `/teacher/intake` page is intentionally comprehensive, but it has become too broad for practical game architecture review. A focused workbench gives Codex, future reviewers, and eventual Z.ai/Phaser intake a clear place to inspect game readiness without enabling live prototype import, student launch, settings persistence, upload, scoring, or publish behavior.

## Impact

- `/teacher/game-readiness` now renders a review-only game architecture workbench.
- `/teacher` and the app shell link to the workbench.
- The active route matrix and verification list include the workbench.
- Active route verification requires the workbench to preserve parent-engine, replay, game-offer, settings, backend-contract, Z.ai gate, Phaser-gate, and no-live-handoff markers.

## Constraints

- No outside prototype is imported or approved from this route.
- No Phaser wrapper is enabled from this route.
- No game settings are saved from this route.
- No student launch, assignment, scoring, upload, storage write, or publish action is added.
- Z.ai prototype intake still waits for the Codex integration gate.

## Verification

- `node --check scripts\verify-active-routes.mjs`
- `node --check scripts\verify-ai-game-generator.mjs`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
