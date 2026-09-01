# DR-543: Route Graduation Gate

Status: Accepted

Date: 2026-09-02

Decision: Add a review-only route graduation gate to `/teacher/intake`.

## Rationale

- Local scaffold routes prove rendering, not classroom readiness.
- Route graduation needs one shared product rule before student assignment, pilot launch, printed QR permanence, or local companion packaging.
- The route must require evidence across tenant boundaries, audio, progress events, reports, assignments, school policy, backend storage, QR aliases, rollback, and local fallback.

## Guardrails

- Scaffold is not production.
- No route graduation action.
- No production QR mutation.
- No live classroom launch.
- No live learner data.
- No report export.
- No support-language-only progress.
- No direct media file target.

## Verification

- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
