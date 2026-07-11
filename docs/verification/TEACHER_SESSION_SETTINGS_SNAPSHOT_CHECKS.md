# Teacher Session Settings Snapshot Checks

## Scope

Run after teacher session settings, monitor routes, persistence, microphone, AI Tutor, assist language, background media, or report-export changes.

## Checks

- Confirm `/teacher/sessions/demo-unit-1` shows `Settings snapshot`.
- Confirm `/teacher/sessions/partner-demo-unit-1` shows `Settings snapshot`.
- Confirm the snapshot includes launch code, tenant id, unit key, entry mode, and recommended next modes.
- Confirm assist language has unlock and mastery credit flags set separately from visibility.
- Confirm microphone practice shows teacher approval, persistence, and raw-audio storage flags.
- Confirm background media shows learning-audio priority and non-scoring flags.
- Confirm AI Tutor remains premium-disabled unless a tenant adopts it.
- Confirm reporting excludes raw audio and transcripts in the core scaffold.

## Verification Command

```powershell
npm run verify:foundation
```
