# Partner Pilot Requirements Intake Checks

Status: active scaffold

## Required Coverage

- `/teacher/pilot/requirements/sample-publisher` renders as a tenant-scoped partner pilot requirements intake.
- The page states demo-ready, not classroom-ready.
- The route shows source PDF/text files, audio, music, video, posters, images, game pathway scope, QR/front-door entry, learner data, reports, deployment, package tier, optional AI Tutor/speech scoring, and outside prototype timing.
- The route links to source review, media library, activity hub, front door, policy handoff, reporting, deployment, entitlements, and game readiness evidence.
- The active route verifier must expect 88 active routes.

## Forbidden Behavior

- No upload button.
- No live file picker write.
- No policy acceptance.
- No live storage write.
- No report export.
- No classroom launch.
- No local package activation.
- No premium AI Tutor activation.
- No microphone request.
- No Z.ai source handoff request.

## Commands

```powershell
npm run verify:pilot-requirements
npm run verify:routes
npm run verify:foundation
```
