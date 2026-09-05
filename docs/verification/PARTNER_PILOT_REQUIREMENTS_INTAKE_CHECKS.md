# Partner Pilot Requirements Intake Checks

Status: active scaffold

## Required Coverage

- `/teacher/pilot/requirements/sample-publisher` renders as a tenant-scoped partner pilot requirements intake.
- The page states demo-ready, not classroom-ready.
- The route shows source PDF/text files, audio, music, video, posters, images, game pathway scope, QR/front-door entry, learner data, reports, deployment, package tier, optional AI Tutor/speech scoring, and outside prototype timing.
- The route links to source review, media library, activity hub, front door, policy handoff, reporting, deployment, entitlements, and game readiness evidence.
- The route shows an evidence traceability map from each partner requirement to current signal, blocked-until condition, pilot dependency, and evidence route.
- The trace map includes source extraction evidence, media rights and playlist evidence, curated activity pathway evidence, QR and front-door entry evidence, learner data policy evidence, teacher report and export evidence, deployment decision evidence, premium AI Tutor and speech evidence, and Z.ai/outside prototype evidence.
- The route shows a first partner pilot meeting agenda with source package, multimedia rights, activity pathway, QR/front-door, learner data policy, reporting, deployment, premium AI, and outside prototype discussion sections.
- The agenda shows questions to ask, evidence to request, decisions not made here, and meeting actions still blocked.
- The route shows a first partner pilot follow-up packet preview with requested evidence, school decisions, demo links, packet blockers, and the next evidence gate.
- Each follow-up packet item identifies an owner, review route, and reason.
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
- No file collection during the meeting route.
- No signed policy acceptance from meeting notes.
- No storage vendor selection from verbal agreement.
- No local app promise before media bundle integrity.
- No follow-up email, downloadable packet, attachment storage, or release-state mutation.

## Commands

```powershell
npm run verify:pilot-requirements
npm run verify:routes
npm run verify:foundation
```
