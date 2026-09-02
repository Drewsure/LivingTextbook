# 2026-09-03: Media Bundle Integrity Gate

## Build Slice

Added a review-only media bundle integrity gate to teacher intake and local companion preview routes.

## Why

White-label textbook companions need reliable audio, music, video, poster, image, and future game asset packaging across yearly editions.

## Guardrails

- No package-size approval.
- No checksum-free bundle.
- No direct folder activation.
- No uncompressed video handoff.
- No media-only progress.
- No background music overriding learning audio.
- No offline-ready claim.
- No local installer export.

## Verification

- `npm.cmd run verify:local-bundle`
- `npm.cmd run verify:review-keys`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
