# Teacher Session Settings Contract Verifier Checks

## Scope

Run after changes to teacher session settings, assist language, microphone practice, background media, Training Academy recovery, AI Tutor, reporting, teacher monitor snapshots, or route verification.

## Automated Command

```powershell
npm run verify:session-settings
```

This command is also included in:

```powershell
npm run verify:foundation
```

## What It Protects

- Learner-facing audio remains required.
- Assist language cannot unlock games or award mastery.
- Enabled assist language cannot remain teacher-only.
- Demo-only sessions cannot store raw audio or transcripts.
- Background media must pause, duck, or mute for learning audio.
- Background media cannot unlock progress or mastery.
- AI Tutor speech scoring cannot run when AI Tutor is disabled.
- Assist-language teacher enablement must appear in the settings snapshot.
- Direct launch contexts must carry teacher session settings.
- Front-door QR/class-code contexts must carry teacher session settings.
- Route verification must preserve the `teacher_enablement_persisted` snapshot field.

## Human Follow-Up

After the command passes, open:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

Confirm the settings snapshot and persistence warnings read clearly for non-technical review.
