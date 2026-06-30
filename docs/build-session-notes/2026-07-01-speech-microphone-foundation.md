# Build Session Note: Speech Microphone Foundation

Date: 2026-07-01

## Scope

Expanded the `Speak It` foundation slice from audio-led self-confirmation into optional browser-local microphone practice.

## Implemented

- Reusable `MicrophonePracticeControl` in `apps/web/src/features/audio/`.
- Local record, stop, replay, and clear controls.
- No microphone prompt until `Record` is tapped.
- No upload, transcript, scoring, AI Tutor call, or raw audio persistence.
- Speak It prompt events now include local microphone-practice metadata.
- `I said it` remains the progress/completion trigger.
- Speak It docs, ADRs, future requirement, and verification checklist updated.

## Route

[http://127.0.0.1:3000/speak/demo-unit-1](http://127.0.0.1:3000/speak/demo-unit-1)

## Next Verification

After pulling `legacy-source-import`, run:

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

Then verify `docs/verification/SPEAK_IT_CORE_CHECKS.md`.
