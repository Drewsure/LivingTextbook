# Z.ai Human Handoff Signal Checks

Status: Active foundation check

## Purpose

Keep the timing for Z.ai and outside prototype handoff explicit.

## Required Surface

`/teacher/game-readiness`, `/teacher/prototypes/ministar`, and `/teacher/prototypes/sample-publisher` must show:

- Human handoff signal
- Current human action
- Controlled candidate evidence intake open
- No broad Z.ai source handoff requested
- No Phaser import requested yet
- No archive upload requested yet
- No pull request requested yet
- No app patch requested yet

## Standing Rule

Codex may now ask for one named candidate's evidence package because the
foundation intake gate is open. This does not authorize source import. Ask for
fixture replay, event/scoring replay, target-language audio, mobile/accessibility
capture, and wrapper notes before requesting any archive, branch merge, or
route work.

## Verification

Run:

```powershell
npm.cmd run verify:prototype-review
npm.cmd run verify:review-keys
npm.cmd run typecheck --workspace @living-textbook/web
npm.cmd run build --workspace @living-textbook/web
npm.cmd run verify:routes
```
