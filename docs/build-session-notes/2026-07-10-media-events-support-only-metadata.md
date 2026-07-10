# 2026-07-10: Media Events Support-Only Metadata

## Summary

Updated local media progress event factories so media playback and background media events explicitly carry support-only metadata: no progression unlock, no mastery credit, and zero Star Dust.

## Verification

- `npm run verify:foundation`
- `http://127.0.0.1:3000/media/playlist-ministar-l1-u1-greetings`
- `http://127.0.0.1:3000/media/playlist-sample-publisher-l1-u1-routines`

