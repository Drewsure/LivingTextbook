# Teacher Session Settings Workbench Route Checks

## Scope

Run after changes to teacher session settings, microphone practice, background media, AI Tutor package gates, assist-language policy, report export, launch-session settings persistence, or active route verification.

## Route

- `http://127.0.0.1:3000/teacher/session-settings`

## Required Page Signals

- The route is labeled `Teacher session settings workbench`.
- The route is review-only and shows `No setting save`.
- The route shows `No live classroom launch`.
- The route states `Target-language-only progress`.
- The route states support language cannot unlock progress.
- The route shows learner audio priority.
- The route shows `teacher_enablement_persisted`.
- The route shows microphone approval, raw-audio exclusion, transcript blocking, report policy blocking, and AI Tutor optional paid package behavior.
- The route exposes the session settings review packet.

## Blocked Behavior

- No live setting save.
- No student event storage.
- No raw microphone audio upload.
- No transcript storage in the core tier.
- No support-language progress.
- No background-media mastery.
- No AI Tutor activation.
- No report export.

## Automated Verification

Run:

```powershell
npm run verify:session-settings
npm run verify:routes
```
