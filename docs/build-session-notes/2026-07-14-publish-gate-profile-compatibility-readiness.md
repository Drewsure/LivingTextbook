# 2026-07-14: Publish Gate Profile Compatibility Readiness

## What Changed

- Added a release-blocking gate for activity compatibility and rendering profiles.
- Updated release-control verification.
- Updated publish gate documentation and focused checks.

## Guardrails

- No pilot release without reviewed activity compatibility snapshots.
- No pilot release without reviewed template rendering and font accessibility profiles.
- No switch-to-anything panel.
- No unchecked printable or puzzle conversion.
- No unapproved tenant or teacher font use.

## Verification

- `npm run verify:release-control`
- `npm run verify:foundation`

