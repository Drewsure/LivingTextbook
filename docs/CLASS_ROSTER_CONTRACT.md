# Class Roster Contract

The class roster layer defines how Living Textbook recognizes learners for teacher reports, QR launches, entry-code flows, and local or hosted pilots. It is not a full authentication system and it must not become a quiet place for collecting personal data before the tenant has accepted policy, persistence, and reporting rules.

Related standard: `docs/LEARNER_IDENTITY_AND_ROSTER_STANDARD.md`.

## Purpose

- Support teacher-led QR onboarding and student self-progression from day one.
- Allow teacher-visible progress summaries without requiring full accounts in the foundation slice.
- Keep the white-label product flexible for schools, textbook publishers, and closed/local deployments.
- Prevent names, family contact, raw microphone audio, and speech transcripts from becoming default roster fields.

## Identity Modes

- `anonymous-practice`: suitable for quick demos and teacher preview, but not durable history.
- `teacher-issued-code`: preferred foundation path for QR and entry-code classrooms.
- `school-roster-id`: future school integration path; requires policy and persistence.
- `family-managed`: future family account path; requires policy, persistence, and consent rules.

## Allowed Foundation Data

The foundation roster may use:

- teacher-issued learner codes,
- temporary learner slots,
- session progress summaries,
- package and launch-code references,
- export readiness flags.

The foundation roster must not store:

- real learner names,
- family contact information,
- raw microphone audio,
- speech transcripts,
- payment or premium usage records.

## Reporting Boundary

Teacher reports can show progress summaries and completion events in the current scaffold. Durable year-on-year history requires the persistence adapter decision and retention policy. Export behavior must be tenant-specific and must be reviewed before a pilot is promised.

## Microphone And AI Tutor Boundary

Microphone practice can remain local replay only. Raw audio and transcripts are not roster fields. Any future AI Tutor or speech-matching report must use a separate premium policy, cost-control, and retention contract before it can be assigned to students.

## Local/Closed Deployment Boundary

Closed local deployments still need a roster contract. A local app may avoid hosted accounts, but it still needs backup, restore, teacher export, update, and data-removal procedures before it can support a real textbook partner.

## Storage Contract

Class roster persistence uses the backend-neutral `class_roster_plan` schema entity and `class-roster-plan` persistence category. The record stores only coded learner slots, roster readiness, launch/package binding, identity mode, data boundaries, progress-summary allowance, and pilot blockers.

The storage contract intentionally blocks real learner names, family contact, raw microphone audio, learner transcripts, production account creation, and live report export until school policy, persistence, retention, and reporting rules are accepted. Hosted and closed/local deployments must use the same vocabulary so white-label partners can move between deployment models without changing the privacy boundary.

## Current Implementation

- Shared model: `packages/content-model/src/classRoster.ts`
- Sample plans: `apps/web/src/data/sampleClassRosterPlans.ts`
- Backend schema entity: `class_roster_plan`
- Persistence category: `class-roster-plan`
- Durable record: `class-roster-plan-record`
- Review panel: `apps/web/src/features/teacher/ClassRosterReadinessPanel.tsx`
- Teacher session card: `apps/web/src/features/teacher/TeacherSessionRosterIdentityCard.tsx`
- Teacher intake route: `/teacher/intake`
- Teacher session routes: `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1`
- Front-door routes: `/enter/ministar` and `/enter/sample-publisher`

## Acceptance Rule

A roster plan cannot be treated as pilot-ready until:

- no validation errors remain,
- the selected identity mode matches the tenant deployment model,
- persistence and retention rules are accepted,
- report export rules are accepted,
- microphone and AI Tutor data are explicitly outside the core roster unless a premium policy says otherwise.
- the `class_roster_plan` storage contract is visible on `/teacher/intake` and passes backend storage verification.
