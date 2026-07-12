# Teacher Authoring Readiness Checks

## Scope

Run after teacher authoring, draft, copy/edit, AI authoring, activity pathway edit, printable authoring, library, or package versioning changes.

## Checks

- Confirm `npm run verify:teacher-authoring` passes.
- Confirm `/teacher/intake` shows `Teacher authoring readiness`.
- Confirm quick draft, copy/edit, activity pathway edit, and printable authoring remain planned.
- Confirm direct AI publish remains blocked.
- Confirm fast authoring creates draft packages only.
- Confirm student assignment remains blocked until reviewed package, audio, route, rights, version, and approval gates are satisfied.
- Confirm AI handoff docs still state that AI cannot publish student-facing content by itself.

## Verification Command

```powershell
npm run verify:foundation
```
