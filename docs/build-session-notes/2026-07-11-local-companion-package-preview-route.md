# 2026-07-11: Local Companion Package Preview Route

## Summary

Added `/local/sample-publisher` as a standalone closed/local companion package preview. The route shows bundle metadata, audio/video asset readiness, local QR fallback, and local deployment preflight blockers.

## Verification

- `npm run verify:foundation`
- `http://127.0.0.1:3000/local/sample-publisher`

## Notes

- This is not an offline-ready app or installer.
- It is a planning and handoff surface for the local companion product path.
