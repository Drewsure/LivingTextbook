# Teacher Authoring Readiness Checks

## Scope

Run after teacher authoring, draft, copy/edit, AI authoring, activity pathway edit, printable authoring, library, or package versioning changes.

## Checks

- Confirm `npm run verify:teacher-authoring` passes.
- Confirm `/teacher/intake` shows `Teacher authoring readiness`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Teacher draft package`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Local edit preview`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Draft audio coverage preview`, `Term audio`, `Sentence audio`, and `Instruction audio`.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows `Draft review handoff preview`, `Review packet blocked`, `Schema validation packet`, `Audio coverage packet`, and `Draft persistence required`.
- Confirm the local edit preview shows `Save draft blocked`, `Submit for review blocked`, `Student assignment blocked`, and `Audio regeneration required`.
- Confirm the draft route shows `Draft only`, `Student assignment blocked`, `Review before assignment`, `Audio before students`, and `No direct publish`.
- Confirm quick draft, copy/edit, activity pathway edit, and printable authoring remain planned.
- Confirm direct AI publish remains blocked.
- Confirm fast authoring creates draft packages only.
- Confirm student assignment remains blocked until reviewed package, audio, route, rights, version, and approval gates are satisfied.
- Confirm AI handoff docs still state that AI cannot publish student-facing content by itself.

## Verification Command

```powershell
npm run verify:foundation
```
