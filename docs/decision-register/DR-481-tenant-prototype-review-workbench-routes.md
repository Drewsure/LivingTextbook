# DR-481: Tenant Prototype Review Workbench Routes

Date: 2026-08-21

Status: Accepted

## Decision

Add tenant-scoped prototype review routes at `/teacher/prototypes/sample-publisher` and `/teacher/prototypes/ministar`.

## Rationale

The project already has strong AI/Z.ai prototype handoff, return-review, wrapper, replay, and patch-gate records, but those records were embedded inside the broader AI generator route. Focused prototype review routes make future Z.ai and Phaser discussions easier without allowing returned prototype code to bypass Codex integration review.

## Impact

- Sample publisher and MiniStar now have focused prototype review workbenches.
- `/teacher/game-readiness` links to both prototype review routes.
- The active route matrix and verification list include both prototype routes.
- Active route verification now expects 78 checked routes and protects the no-live-handoff, no-app-write, fixture replay, event replay, audio coverage, scoring replay, mobile/accessibility, Codex decision, patch gate, and MiniStar hiragana/support-only markers.

## Constraints

- No prototype upload or import exists.
- No Z.ai output is approved by these routes.
- No Phaser wrapper is enabled.
- No app file write, route creation, scoring mutation, audio manifest mutation, package promotion, assignment, storage write, or student-facing preview is enabled.
- MiniStar Japanese support remains hiragana-only at Foundation/Bronze/Plus and cannot trigger progress.

## Verification

- `node --check scripts\verify-active-routes.mjs`
- `node --check scripts\verify-ai-game-generator.mjs`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
