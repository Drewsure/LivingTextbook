# Pilot Readiness Dashboard Checks

Status: active scaffold

## Required Coverage

- `/teacher/pilot` renders as a review-only pilot readiness command view.
- The page states: demo-ready, not classroom-ready.
- The dashboard shows source/media evidence, school policy, persistence, teacher reports, deployment choice, hard blocks, launch gates, evidence packets, and package publish gates.
- The route links back to `/partner-demo`, `/teacher/deployment`, `/teacher/intake`, `/teacher/sessions/partner-demo-unit-1`, the dry-run workspace, and the classroom launch gate.
- The active route verifier must expect 87 active routes.

## Forbidden Behavior

- No live upload input.
- No live service call.
- No microphone request.
- No service worker registration.
- No cache mutation.
- No launch-now action.

## Commands

```powershell
npm run verify:pilot
npm run verify:routes
npm run verify:foundation
```
