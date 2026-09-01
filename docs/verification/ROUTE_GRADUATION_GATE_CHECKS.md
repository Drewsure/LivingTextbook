# Route Graduation Gate Checks

Status: Active foundation check

## Purpose

Prevent active local scaffold routes from being mistaken for student-ready, pilot-ready, production QR-backed, or local companion-ready routes.

## Required Surface

`/teacher/intake` must show:

- Route graduation gate
- Scaffold is not production
- Scaffold route
- Student-ready route
- Pilot-ready route
- Production QR route
- Route helper contract
- Tenant navigation boundary
- Target-language audio coverage
- Standard progress events
- Teacher report boundary
- Private assignment gate
- School policy acceptance
- Backend storage selection
- QR alias and rollback plan
- Local companion fallback

## Blocked Actions

- No route graduation action
- No production QR mutation
- No live classroom launch
- No live learner data
- No report export
- No support-language-only progress
- No direct media file target

## Verification

Run:

```powershell
npm.cmd run verify:review-keys
npm.cmd run typecheck --workspace @living-textbook/web
npm.cmd run build --workspace @living-textbook/web
npm.cmd run verify:routes
```
