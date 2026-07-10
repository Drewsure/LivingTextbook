# Teacher Session Settings Contract

Document type: foundation data contract  
Status: active scaffold  
Last updated: 2026-07-02

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
- `TeacherSessionControlAction`
- `TeacherReportExportPlan`
- `SessionSettingReadiness`
- `TeacherSessionControlReadiness`
- `TeacherReportExportReadiness`
- `TeacherReportExportFormat`
- `TeacherReportExportScope`
- `SessionDataRetentionPolicy`
- `validateTeacherSessionSettings`
- `getTeacherSessionPersistenceWarnings`
- `validateTeacherSessionControlActions`
- `getTeacherSessionControlWarnings`
- `createTeacherReportExportPlan`
- `validateTeacherReportExportPlan`
- `getTeacherReportExportWarnings`

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

### Training Academy Recovery

Training Academy recovery triggers are deterministic, teacher-visible session settings. The foundation defaults are:

- repeated missed checks: 2,
- low completion reward threshold: 120 Star Dust or below,
- high attempt ratio threshold: 2.25x or higher.

Teachers may later adjust thresholds, but those settings must be persisted with the launch session before classroom use. Recovery rewards must stay deterministic and smaller than primary game rewards.

### AI Tutor

AI Tutor remains optional, premium/enterprise, and disabled for core sessions unless explicitly adopted by the tenant or school.

### Reporting And Retention

Progress reporting requires privacy, retention, export, access-control, and school policy decisions before real student data is stored.

### Report Export

Report export is a policy-bound package, not a raw database dump. The scaffolded export contract can describe allowed formats and scopes, but export remains blocked until persistence and school or tenant policy are accepted.

Core report export must exclude:

- raw learner audio,
- learner transcripts.

A future premium transcript or speech-scoring package may add separate export policy, but that must not become part of the core teacher report by default.

## Lifecycle Controls Covered

Teacher session lifecycle actions are scaffolded as contract data, not live production commands. The current action set includes:

- open session,
- lock new entries,
- resume entries,
- end session,
- export report.

Every lifecycle action must require a teacher role before classroom use. Report export must also require accepted school or tenant policy.

## Safety Errors vs Persistence Warnings

`validateTeacherSessionSettings` checks safety rules. These should fail only when the session would violate platform rules, such as allowing support-language mastery credit or enabling speech scoring without AI Tutor.

`getTeacherSessionPersistenceWarnings` checks readiness gaps. These warnings are acceptable in the scaffold, but must be resolved before classroom use. Examples include demo-local microphone approval, background-media enablement, teacher-adjustable Training Academy thresholds, demo-only reporting, and disabled export.

`validateTeacherSessionControlActions` checks lifecycle command safety. `getTeacherSessionControlWarnings` identifies lifecycle actions that still need persistence or policy work before pilot use.

`validateTeacherReportExportPlan` checks report-export safety. `getTeacherReportExportWarnings` identifies policy, persistence, and retention blockers before a real export is allowed.

## Current Non-Goals

- No production backend has been selected.
- No real student reports are stored.
- No live report export is generated.
- No raw audio or transcript storage is enabled.
- No teacher roster or authentication layer is implemented.
- No premium AI Tutor usage meter is active.
- No lifecycle command mutates live session state yet.

## Future Work

1. Move teacher session settings from sample data into durable launch-session records.
2. Add teacher controls for open, locked, expired, and completed sessions.
3. Add school/tenant policy controls for retention and export.
4. Add local/closed deployment mapping for classroom server and packaged app modes.
5. Connect approved export plans to real report generation after persistence is selected.
6. Add teacher-editable Training Academy threshold controls after persistence exists.
7. Keep all changes white-label and tenant-configurable.
