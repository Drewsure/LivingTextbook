# Teacher Session Settings Contract

Document type: foundation data contract  
Status: active scaffold  
Last updated: 2026-07-01

## Purpose

Teacher session settings define the classroom-level controls that must eventually be persisted with a `LaunchSession`. They are not tenant branding and they are not game content. They are the rules a teacher or school applies to a live classroom session before students enter from a QR code, front-door code, or launch route.

The current implementation is a scaffold used by:

- `http://127.0.0.1:3000/teacher/sessions/demo-unit-1`
- `http://127.0.0.1:3000/teacher/sessions/partner-demo-unit-1`

## Shared Contract

The shared contract lives in:

- `packages/content-model/src/sessionSettings.ts`

It currently defines:

- `TeacherSessionSettings`
- `TeacherSessionSetting`
- `SessionSettingReadiness`
- `SessionDataRetentionPolicy`
- `validateTeacherSessionSettings`
- `getTeacherSessionPersistenceWarnings`

## Settings Covered

### Learner Text Audio

Learner-facing audio is required for student-ready sessions. Vocabulary, target sentences, instructions, feedback, and critical controls must remain audio-supported.

### Assist Language

Assist language can support comprehension, but it must not:

- unlock games,
- award mastery,
- replace target-language engagement,
- satisfy unit completion.

### Microphone Practice

Core microphone practice remains local record/replay unless a tenant adopts a premium speech package. Teacher approval must become a persisted launch-session setting before classroom use.

### Background Media

Background media is optional and teacher-controlled. It must not replace comprehension audio, and games must remain usable when background media is disabled.

### AI Tutor

AI Tutor remains optional, premium/enterprise, and disabled for core sessions unless explicitly adopted by the tenant or school.

### Reporting And Retention

Progress reporting requires privacy, retention, export, access-control, and school policy decisions before real student data is stored.

## Safety Errors vs Persistence Warnings

`validateTeacherSessionSettings` checks safety rules. These should fail only when the session would violate platform rules, such as allowing support-language mastery credit or enabling speech scoring without AI Tutor.

`getTeacherSessionPersistenceWarnings` checks readiness gaps. These warnings are acceptable in the scaffold, but must be resolved before classroom use. Examples include demo-local microphone approval, background-media enablement, demo-only reporting, and disabled export.

## Current Non-Goals

- No production backend has been selected.
- No real student reports are stored.
- No raw audio or transcript storage is enabled.
- No teacher roster or authentication layer is implemented.
- No premium AI Tutor usage meter is active.

## Future Work

1. Move teacher session settings from sample data into durable launch-session records.
2. Add teacher controls for open, locked, expired, and completed sessions.
3. Add school/tenant policy controls for retention and export.
4. Add local/closed deployment mapping for classroom server and packaged app modes.
5. Keep all changes white-label and tenant-configurable.
