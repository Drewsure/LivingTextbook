# Voice Tutor Package Verification Checks

Use this checklist after pulling `legacy-source-import` when reviewing the premium speech-layer readiness surface.

## Dashboard Checks

On `/`:

1. Confirm the dashboard includes a `Voice Tutor` package/readiness panel.
2. Confirm the panel shows the premium speech layer as planned or disabled when MiniStar AI Tutor entitlement is off.
3. Confirm the panel lists capability counts without requiring microphone access.
4. Confirm capability cards show replaceable processing preferences such as browser, local-first, hybrid, or server-verified.
5. Confirm no student route is blocked by Voice Tutor being disabled.

## Package Entitlement Workbench Checks

On `/teacher/entitlements`:

1. Confirm the route shows `Voice Tutor and speech scoring` as an optional paid package.
2. Confirm the `Voice Tutor` panel appears without requesting microphone permission.
3. Confirm `No speech API billing` is visible.
4. Confirm `No raw audio storage` and `No transcript storage` are visible.
5. Confirm the route keeps Voice Tutor tied to tenant/school approval instead of a student-facing upgrade prompt.

## Student Flow Checks

On `/launch/demo-unit-1`:

1. Confirm no microphone permission prompt appears.
2. Confirm flashcards still require target-language engagement before completion.
3. Confirm Memory Match unlocks and plays without AI Tutor or Voice Tutor.
4. Confirm Training Academy remains deterministic and core-package.
5. Confirm no speech-to-text, pronunciation scoring, model call, or transcript storage is required.

## White-Label And Cost Checks

- Voice Tutor must remain optional premium or enterprise capability.
- Vocal Image is product inspiration only, not a platform dependency.
- Open-source speech candidates require license, privacy, and integration review before import.
- Tenants must be able to disable Voice Tutor fully.
- Future active prototypes must start with browser record/replay before speech scoring or conversation.
- Raw audio and transcripts must not be stored by default.
