# DR-137: Teacher Session Settings Snapshot

## Decision

Add a machine-readable settings snapshot to teacher session monitor routes.

## Reason

Teacher settings must eventually persist across devices. A visible snapshot makes the future launch-session record concrete while keeping demo-local state honest and separate from live classroom persistence.

## Standard

- `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1` show `Settings snapshot`.
- The snapshot includes audio, assist-language, microphone, background-media, Training Academy, AI Tutor, and reporting settings.
- The snapshot includes safety errors, persistence warnings, control warnings, and report export blockers.
- The snapshot must not include raw learner audio, transcripts, or private student identity.
- Assist language, background media, and support events must remain non-scoring in the persisted shape.
