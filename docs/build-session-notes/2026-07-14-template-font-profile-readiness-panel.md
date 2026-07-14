# 2026-07-14: Template And Font Profile Readiness Panel

## What Changed

- Added `sampleTemplateRenderingFontProfiles`.
- Added `TemplateRenderingFontProfilePanel`.
- Rendered the panel on `/teacher/intake`.
- Updated upload and route verifiers to require the profile readiness surface.

## Guardrails

- Student-facing rendering remains blocked.
- Student-facing font use remains blocked.
- No live template switching, font uploads, printable rendering, tenant theme editing, or file-picker behavior is introduced.

## Verification

- `npm run verify:upload-channels`
- `npm run verify:foundation`

