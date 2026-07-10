# 2026-07-10: Teacher Training Recovery Trigger Settings

## Work Completed

- Added Training Academy recovery trigger thresholds to teacher session settings.
- Added validation for threshold sanity and deterministic recovery rewards.
- Added persistence warning for teacher-adjustable demo-local thresholds.
- Displayed Training Academy trigger thresholds in teacher session monitor settings.

## Verification

- Run typecheck/build.
- Check `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`.
- Check `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`.

