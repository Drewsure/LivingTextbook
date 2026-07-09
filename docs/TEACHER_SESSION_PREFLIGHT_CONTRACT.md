# Teacher Session Preflight Contract

Document type: implementation contract

Status: active scaffold

## Purpose

Teacher session preflight is the short readiness gate before a teacher treats a launch session as classroom-ready.

It sits above the detailed teacher monitor and answers one question:

Can this session safely move from demo preview to student pilot use?

## Current Checks

- Settings safety.
- Settings persistence.
- Lifecycle controls.
- Assigned game audio.
- Report export.

## Required Rules

- Safety errors block use.
- Persistence warnings may allow preview, but block real classroom pilot use.
- Report export must remain blocked until school or tenant policy, access, retention, and persistence are accepted.
- Core reports must not include raw learner audio or transcripts.
- Assigned game modes must have reviewed audio coverage or an approved fallback before pilot use.
- Assist language cannot unlock progression or award mastery.
- AI Tutor and cloud speech scoring remain premium and disabled unless explicitly adopted.

## Current Routes

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

## Acceptance Criteria

- The preflight panel appears before the detailed monitor.
- Passing, warning, and blocked counts are visible.
- Demo sessions show warnings for persistence/report policy rather than pretending to be production-ready.
- Assigned game audio coverage is visible before a teacher treats the session as pilot-ready.
- Teacher controls remain mapped but not live backend commands.
