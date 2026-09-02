# PWA Offline Readiness Gate Checks

Status: Active foundation check

## Purpose

Keep the hosted PWA, installable shell, offline cache, local companion, and closed textbook package promises separate.

## Required Surface

`/teacher/intake`, `/local/ministar`, and `/local/sample-publisher` must show:

- PWA and offline readiness
- Hosted PWA first, offline claim later
- Installable shell
- Manifest available
- Service worker not enabled yet
- Cache strategy not approved yet
- Offline media bundle not approved yet
- Rights and versioned manifest required
- Learning audio priority preserved
- Local companion fallback required
- QR alias compatibility required
- No offline-ready claim
- No service worker registration
- No cache mutation
- No media pre-cache
- No local installer export
- No student data offline storage
- No background sync

## Standing Rule

The app may have a manifest and installable shell during foundation, but it may not claim offline-ready status until cache, service worker, media rights, checksums, QR fallback, rollback, local storage, report export, and school policy gates are complete.

## Verification

Run:

```powershell
npm.cmd run verify:local-bundle
npm.cmd run verify:review-keys
npm.cmd run typecheck --workspace @living-textbook/web
npm.cmd run build --workspace @living-textbook/web
npm.cmd run verify:routes
```
