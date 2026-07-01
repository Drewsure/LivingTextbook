# ADR-0026: Teacher Session Settings Contract

Status: Accepted  
Date: 2026-07-01

## Context

Teacher-led classroom launch is a core Living Textbook path. The platform now needs visible controls for audio requirements, assist language, microphone practice, background media, AI Tutor entitlement, reporting/retention, and lifecycle commands before students enter from a QR code, front-door code, or launch route.

Those controls cannot live as one-off display text in the teacher monitor. They must become a shared contract that can later move into persisted `LaunchSession` records without changing the teacher and student route concepts.

## Decision

Add a shared `TeacherSessionSettings` and `TeacherSessionControlAction` contract under `packages/content-model/src/sessionSettings.ts` and render its current sample state in the teacher session monitor.

The contract separates:

- safety errors that block classroom use,
- persistence and policy warnings that are acceptable in scaffold mode but must be resolved before pilots,
- teacher-visible setting and lifecycle cards that communicate readiness without implying a production backend.

## Consequences

Positive:

- Keeps teacher controls white-label and tenant-configurable.
- Makes microphone approval, AI Tutor entitlement, reporting, retention, lock/end session behavior, and report export visible before backend selection.
- Preserves the rule that assist language supports comprehension but cannot unlock games or award mastery.
- Gives future persistence work a named target instead of scattered UI state.

Tradeoffs:

- The monitor now shows some warnings that are expected in scaffold mode.
- Build verification must distinguish safety failures from ordinary persistence or policy gaps.
- A future backend implementation must map these fields into durable launch/session records.
- Lifecycle commands remain non-mutating until real persistence and teacher authentication exist.

## Implementation Notes

- `validateTeacherSessionSettings` checks rules that should fail a classroom session.
- `getTeacherSessionPersistenceWarnings` checks work still required before real pilots.
- `validateTeacherSessionControlActions` checks lifecycle command safety.
- `getTeacherSessionControlWarnings` reports lifecycle persistence and policy gaps.
- Raw audio and transcript storage remain disabled in the scaffold.
- AI Tutor remains optional premium/enterprise and is not a core session dependency.
- Report export requires accepted school or tenant policy.

## Related Documents

- `docs/TEACHER_SESSION_SETTINGS_CONTRACT.md`
- `docs/verification/TEACHER_SESSION_MONITOR_CHECKS.md`
- `docs/DECISION_REGISTER.md`
