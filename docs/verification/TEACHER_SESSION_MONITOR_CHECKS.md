# Teacher Session Monitor Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-10

## Purpose

Verify that the teacher session monitor route presents a single report stream for launch state, target-language entry practice, game unlocks, media engagement, Training Academy recovery, Memory Match completion, Speak It readiness, teacher session settings, lifecycle controls, and report-export readiness without pretending that sample data is production persistence.

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
9. Confirm Training Academy triggers show deterministic thresholds and require persistence before teacher adjustment.
10. Confirm AI Tutor is premium-disabled, not a core session dependency.
11. Confirm progress retention requires persistence, privacy, export, and school access rules.
12. Confirm the page displays the shared settings contract result as either `Safety valid` or `Safety review`.
13. Confirm the safety contract does not treat demo-only persistence gaps as safety failures.
14. Confirm persistence warnings are visible for demo-local approval, background media enablement, teacher-adjustable Training Academy thresholds, demo-only reporting, or disabled export when those gaps apply.
15. Confirm the shared contract file exists at `packages/content-model/src/sessionSettings.ts`.
16. Confirm the settings contract document exists at `docs/TEACHER_SESSION_SETTINGS_CONTRACT.md`.
17. Confirm the page shows a `Session lifecycle controls` section.
18. Confirm lifecycle controls include open session, lock new entries, resume entries, end session, and export report.
19. Confirm lifecycle controls require teacher role and mark export as requiring accepted policy.
20. Confirm lifecycle control warnings are shown as persistence/policy gaps, not active production controls.
21. Confirm the page shows a `Report export readiness` section.
22. Confirm report export is blocked by policy or persistence in the scaffold, not shown as production-ready.
23. Confirm report export allowed formats include `csv-summary` and `json-event-stream`.
24. Confirm report export included scopes list teacher summary, student progress, event stream, media engagement, Training Academy recovery, and speech-practice summary.
25. Confirm the core export exclusions name raw learner audio and learner transcripts.
26. Confirm report export safety passes while export blockers remain visible.
27. Confirm the event stream includes target-language entry practice completion.
28. Confirm English audio heard, support taps, and support unlock metrics are visible.
29. Confirm route guidance listens are visible as support metrics, not mastery progress.
30. Confirm support-language taps do not appear as unlock triggers.
31. Confirm the language engagement rule says English audio can support progression while support-language taps are reportable support only.
32. Confirm game unlock, media, recovery, game completion, and Speak It readiness events appear in one report stream.
33. Confirm the dedicated media engagement section reports media starts, pauses, completions, and background media by asset.
34. Confirm media engagement is described as report-only support activity, not mastery or unlock activity.
33. Confirm assigned game path shows audio-covered count and marks each assigned mode as audio-covered or needing audio review.
34. Confirm microphone/speech scoring remains marked as disabled or record/replay-only in the core sample.
35. Confirm the page reuses tenant branding for MiniStar and the sample publisher.
36. Confirm the route contract for `/teacher/sessions/[launchCode]` is active scaffold, not future-only, and includes `TeacherSessionControlAction[]` and `TeacherReportExportPlan`.
39. Confirm no real student identity, transcript, raw audio storage, cloud speech scoring, or live report export is implied.

## Acceptance Standard

The route should make the future teacher reporting surface tangible while preserving the current foundation rule: no production student monitoring before persistence, privacy, retention, access, and export rules exist.

Safety failures block classroom use. Persistence and policy warnings are expected in the scaffold and must become implementation tasks before a real pilot.

Use `docs/verification/TEACHER_REPORT_EXPORT_CHECKS.md` for the focused export checklist.
