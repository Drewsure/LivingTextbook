# 2026-09-03: Local Preview Offline Readiness Parity

## Build Slice

Rendered the shared PWA/offline readiness gate on the MiniStar and sample-publisher local companion preview routes.

## Why

Local preview routes are likely to be used in partner conversations. They need to show the same offline promise boundary as the central teacher intake page.

## Guardrails

- No offline-ready installer claim.
- No service worker registration.
- No cache mutation.
- No media pre-cache.
- No local package activation.
- No student data offline storage.
- No report export.

## Verification

- `npm.cmd run verify:routes`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
