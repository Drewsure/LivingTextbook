# DR-026: Teacher Session Monitor Scaffold

Date: 2026-07-01  
Status: Accepted  
Related ADR: `docs/adr/0025-teacher-session-monitor-scaffold.md`

## Decision

Add an active teacher session monitor scaffold at `/teacher/sessions/[launchCode]` using sample data and the shared event stream.

## Rationale

A white-label pilot needs teacher-visible reporting. Showing the monitor early helps partners understand the product direction, but it must remain clearly sample/local until persistence, privacy, retention, access, and export rules are accepted.

## Implementation Notes

- Added `sampleTeacherSessionMonitor` data resolver.
- Added `TeacherSessionMonitorPanel`.
- Added `http://127.0.0.1:3000/teacher/sessions/demo-unit-1` and partner-compatible launch-code route behavior.
- Added app-shell navigation to the demo session monitor.
- Added sample teacher session settings for learner text audio, assist-language policy, microphone approval, background media, AI Tutor premium-disabled state, and progress retention.
- Reused `FrontDoorTeacherReportPreview` for shared event-stream reporting.
- Updated route contracts to mark `/teacher/sessions/[launchCode]` as active scaffold.
- Added focused verification in `docs/verification/TEACHER_SESSION_MONITOR_CHECKS.md`.

## Follow-Up

- Move launch sessions, teacher settings, and report events into the selected persistence layer before live classroom testing.
- Add teacher controls for open/locked/expired launch sessions once persistence exists.
- Add class-level aggregation only after privacy and access-control rules are accepted.
- Preserve the same route for MiniStar and partner tenants.
