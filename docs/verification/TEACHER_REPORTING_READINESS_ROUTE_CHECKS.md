# Teacher Reporting Readiness Route Checks

## Scope

Run after changes to teacher reporting, class roster identity, report package boundaries, event acceptance, support-only signals, report export, AI Tutor reporting, microphone reporting, or active route verification.

## Route

- `http://127.0.0.1:3000/teacher/reporting`

## Required Page Signals

- The route is labeled `Teacher reporting readiness workbench`.
- The route shows `No report export`.
- The route shows `No real learner data`.
- The route shows `No raw learner audio`.
- The route shows `Teacher-visible summary`.
- The route exposes `Report package boundary`.
- The route exposes `Event acceptance gate`.
- The route exposes `Class roster identity boundary`.
- The route shows `Teacher reports without premature accounts`.
- The route names `Support-only signals`.
- The route names `Excluded sensitive fields`.
- The route names raw learner audio, learner transcripts, ungated AI Tutor state, private identifiers, and support-language taps as blocked or support-only.

## Automated Verification

Run:

```powershell
npm run verify:routes
```

The active route verifier must expect 87 active routes.
