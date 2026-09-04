# 2026-09-05: Partner Pilot Requirements Intake

## Summary

Added a tenant-scoped Partner pilot requirements intake at `/teacher/pilot/requirements/sample-publisher`.

## Build Notes

- The intake covers source PDF/text files, audio, music, video, posters, images, game pathway scope, QR/front-door entry, learner data, reports, deployment, package tier, optional AI Tutor/speech scoring, and outside prototype timing.
- It keeps hosted PWA as the recommended first pilot path for cost control.
- It blocks upload buttons, file picker writes, policy acceptance, live storage writes, report export, classroom launch, local package activation, premium AI Tutor activation, microphone prompts, and Z.ai source handoff requests.
- `npm run verify:pilot-requirements` was added to the foundation gate.

## View

`http://127.0.0.1:3000/teacher/pilot/requirements/sample-publisher`
