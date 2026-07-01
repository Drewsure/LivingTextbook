# Teacher Session Monitor Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-01

## Purpose

Verify that the teacher session monitor route presents a single report stream for launch state, target-language entry practice, game unlocks, media engagement, Training Academy recovery, Memory Match completion, Speak It readiness, and teacher session settings without pretending that sample data is production persistence.

## Routes

Verify at:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

## Required Checks

1. Confirm the route renders a teacher session monitor heading.
2. Confirm the page shows launch code, visible student count, report event count, and reward metric.
3. Confirm the page states that the route uses sample data and needs persistence before live reporting.
4. Confirm the page shows a `Session controls to persist` section.
5. Confirm learner text audio is enabled and described as required before student assignment.
6. Confirm assist language is described as support only and cannot unlock games or award mastery.
7. Confirm microphone practice requires persisted teacher approval before classroom use.
8. Confirm background media is optional and teacher-controlled.
9. Confirm AI Tutor is premium-disabled, not a core session dependency.
10. Confirm progress retention requires persistence, privacy, export, and school access rules.
11. Confirm the page displays the shared settings contract result as either `Safety valid` or `Safety review`.
12. Confirm the safety contract does not treat demo-only persistence gaps as safety failures.
13. Confirm persistence warnings are visible for demo-local approval, background media enablement, demo-only reporting, or disabled export when those gaps apply.
14. Confirm the shared contract file exists at `packages/content-model/src/sessionSettings.ts`.
15. Confirm the settings contract document exists at `docs/TEACHER_SESSION_SETTINGS_CONTRACT.md`.
16. Confirm the event stream includes target-language entry practice completion.
17. Confirm support-language taps do not appear as unlock triggers.
18. Confirm game unlock, media, recovery, game completion, and Speak It readiness events appear in one report stream.
19. Confirm microphone/speech scoring remains marked as disabled or record/replay-only in the core sample.
20. Confirm the page reuses tenant branding for MiniStar and the sample publisher.
21. Confirm the route contract for `/teacher/sessions/[launchCode]` is active scaffold, not future-only.
22. Confirm no real student identity, transcript, raw audio storage, or cloud speech scoring is implied.

## Acceptance Standard

The route should make the future teacher reporting surface tangible while preserving the current foundation rule: no production student monitoring before persistence, privacy, retention, access, and export rules exist.

Safety failures block classroom use. Persistence warnings are expected in the scaffold and must become implementation tasks before a real pilot.
