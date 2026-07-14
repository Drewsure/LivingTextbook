# 2026-07-14: Template Rendering And Font Storage Contract

## What Changed

- Added backend-neutral schema entities for `template_rendering_profile` and `font_accessibility_profile`.
- Added migration candidates and migration specs for both profile types.
- Added hosted and local persistence adapter write intents.
- Added durable record contracts and backend-storage verifier checks.
- Added active route verification for visibility on `/teacher/intake`.

## Guardrails

- Cross-game template reuse is curated and reviewed, not a switch-to-anything promise.
- Font controls are tenant-approved and license/readability reviewed, not arbitrary teacher uploads.
- Student-facing rendering and font use remain blocked until profile, compatibility, language, layout, media, and release gates pass.

## Verification

- `npm run verify:backend-storage`
- `npm run verify:foundation`

