# DR-474: Build Stage Map Panel

Date: 2026-08-21

Status: Accepted

## Decision

Add a read-only build stage map to `/teacher/intake` showing where the platform currently stands across frontend structure, active playable route shell, backend contracts, live pilot readiness, game design timing, and controlled Z.ai/outside prototype intake.

## Rationale

The project has grown enough that build status should be visible inside the app, not only in chat or documentation. A compact teacher/admin map helps future reviews answer whether the platform is still in foundation, backend selection, game design, pilot launch, or outside prototype intake.

## Impact

- `/teacher/intake` now shows `Build stage map` near the top of the review page.
- The panel marks frontend structure and active playable route shell as ready.
- Backend contracts and game design remain review-only.
- Live classroom pilot remains blocked.
- Z.ai intake remains explicitly gated by Codex integration review and does not authorize importing external code.

## Constraints

- This is a visibility panel, not a workflow launcher.
- No live backend write, upload, assignment launch, report export, school policy acceptance, game route creation, or Z.ai import is enabled.
- The route verifier checks the panel markers so the build-stage map cannot disappear from `/teacher/intake` unnoticed.

## Verification

- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
