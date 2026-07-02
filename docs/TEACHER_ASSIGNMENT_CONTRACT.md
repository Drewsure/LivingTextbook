# Teacher Assignment Contract

This contract defines the bridge between a reviewed content package and a real class launch.

## Purpose

A content package is not automatically classroom-ready. A teacher assignment must decide:

- which tenant package is assigned,
- which launch code or front-door route students use,
- whether entry and user codes are required,
- which game modes are available,
- which support controls are enabled,
- which controls require teacher approval,
- which controls require school or tenant policy,
- which premium controls remain disabled,
- and what must be completed before a real pilot.

## Core Types

The shared contract lives in:

- `packages/content-model/src/teacherAssignment.ts`

Primary types:

- `TeacherAssignmentPlan`
- `TeacherAssignmentAccessPlan`
- `TeacherAssignmentControlPlan`
- `TeacherAssignmentReadiness`
- `TeacherAssignmentControlStatus`

## Readiness States

- `demo-ready`: safe for a controlled demo, not proof of live persistence.
- `requires-persistence`: needs durable launch sessions, route registry, progress events, or report storage before pilot use.
- `requires-policy`: needs school or tenant policy acceptance before pilot use.
- `ready-for-pilot`: no required-before-pilot blockers remain.

## Control States

- `enabled`: core-safe and active.
- `disabled`: inactive in this assignment.
- `teacher-optional`: teacher can enable it for the session.
- `policy-blocked`: blocked until school or tenant policy is accepted.
- `premium-disabled`: optional paid package, not part of the core assignment.

## Required Standards

- Target-language audio support is core and should be enabled for student-facing assignments.
- Assist language is optional support only and must not unlock progression.
- Local microphone record/replay may be teacher-optional when it does not upload audio or store transcripts.
- Cloud speech scoring, AI Tutor, raw learner audio storage, and transcript storage are premium or policy-gated features.
- Teacher report export is blocked until progress persistence and report policy are accepted.
- Printed QR or permanent QR assignments must not depend on temporary local development URLs.
- Local/closed deployment must include backup, update, rights, storage, and export policy before live use.

## Verification

See:

- `docs/verification/TEACHER_ASSIGNMENT_READINESS_CHECKS.md`
