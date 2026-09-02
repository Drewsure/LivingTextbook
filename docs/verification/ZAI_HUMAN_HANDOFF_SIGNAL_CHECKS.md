# Z.ai Human Handoff Signal Checks

Status: Active foundation check

## Purpose

Keep the timing for Z.ai and outside prototype handoff explicit.

## Required Surface

`/teacher/game-readiness`, `/teacher/prototypes/ministar`, and `/teacher/prototypes/sample-publisher` must show:

- Human handoff signal
- Current human action
- Not needed yet
- No Z.ai source handoff requested yet
- No Phaser import requested yet
- No archive upload requested yet
- No pull request requested yet
- No app patch requested yet

## Standing Rule

Codex will ask for specific Z.ai branches, archives, demo links, or fixture folders only after the intake alert changes from not-ready to ready-for-review.

## Verification

Run:

```powershell
npm.cmd run verify:prototype-review
npm.cmd run verify:review-keys
npm.cmd run typecheck --workspace @living-textbook/web
npm.cmd run build --workspace @living-textbook/web
npm.cmd run verify:routes
```
