# 2026-08-11 Local Bundle Activity Hub Fallbacks

## Summary

Added curated activity hub route awareness to local companion package planning manifests.

## Changes

- Added `activity-hub` as a local bundle route target type.
- Added MiniStar and sample publisher launch, activity hub, and media playlist fallback routes.
- Updated local flashcard and Memory Match paths to use dedicated game routes where available.
- Strengthened local bundle readiness verification for activity hub fallback paths.

## Boundaries

- No local bundle exporter.
- No offline-ready status.
- No installer/update flow.
- No local report persistence.
- No media-rights or checksum bypass.

## Verification Target

Run local bundle readiness, typecheck, production build, and full foundation verification.
