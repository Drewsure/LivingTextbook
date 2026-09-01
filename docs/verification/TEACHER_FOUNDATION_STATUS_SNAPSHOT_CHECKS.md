# Teacher Foundation Status Snapshot Checks

Status: Active foundation check

## Purpose

Keep the main MiniStar teacher page clear about the current build stage.

## Required Surface

`/teacher` must show:

- Foundation status snapshot
- Build stage
- Structure first
- 85 active routes checked
- Tenant boundary visible
- Z.ai intake not yet
- Open foundation control room
- `/teacher/intake`

## Blocked Shortcuts

- No live feature activation
- No classroom launch
- No real learner data
- No report export
- No Z.ai import before the intake alert

## Verification

Run:

```powershell
npm.cmd run verify:review-keys
npm.cmd run typecheck --workspace @living-textbook/web
npm.cmd run build --workspace @living-textbook/web
npm.cmd run verify:routes
```
