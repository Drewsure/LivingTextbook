# Build Session: Audio Status Accessibility

## Goal

Make the shared learning-audio contract understandable to assistive
technology across the canonical game family and teacher surfaces.

## Change

Shared audio controls now use stable IDs and polite, atomic status regions for
ready, playing, and unavailable states. The change preserves tap-to-speak,
reviewed media, speech fallback, and the existing scoring/progression owners.

## Verification

- `npm run verify:audio-accessibility`
- Web typecheck
- Production build
- Full foundation gate
