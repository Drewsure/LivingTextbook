# Foundation Workstream Index Checks

Status: Active foundation check

## Purpose

Keep the main teacher/admin foundation route readable as more review gates are added.

## Required Surface

`/teacher/intake` must show:

- Foundation workstream index
- Visible build map
- Current build focus
- Route and QR safety
- Content intake and uploads
- Game engine readiness
- Audio, media, and language
- Teacher operations and reporting
- Pilot, policy, and evidence
- Backend, persistence, and local companion
- Future Z.ai intake alert

## Blocked Shortcuts

- No live feature activation
- No student data collection
- No public community library
- No unmanaged asset adoption
- No direct AI publish
- No Z.ai import before the intake alert

## Verification

Run:

```powershell
npm.cmd run verify:review-keys
npm.cmd run typecheck --workspace @living-textbook/web
npm.cmd run build --workspace @living-textbook/web
npm.cmd run verify:routes
```
