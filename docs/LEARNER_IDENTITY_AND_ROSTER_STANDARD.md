# Learner Identity And Roster Standard

This standard extends `docs/PRINCIPLES_AND_STANDARDS.md` for any work involving learner identity, user codes, teacher reports, front-door entry, microphone practice, AI Tutor, or school records.

## Standing Rule

Living Textbook must support classroom reporting without forcing full student accounts in the foundation product and without quietly collecting personal data.

The default foundation identity is a coded learner slot.

## Allowed Foundation Identity

Allowed before production policy and persistence are selected:

- anonymous practice sessions,
- teacher-issued learner codes,
- textbook or classroom user codes,
- launch-code scoped session ids,
- progress-summary counts,
- demo-only report previews.

## Deferred Until Policy And Persistence

Do not store or present these as default foundation roster fields:

- real learner names,
- family contact information,
- school roster ids,
- parent accounts,
- raw microphone audio,
- speech transcripts,
- AI Tutor chat transcripts,
- payment or premium usage records.

These may become available only after tenant policy, school consent rules, persistence, retention, export, and access-control decisions are accepted.

## Teacher Reports

Teacher reports may show coded learner slots and progress summaries. A report must not imply that the platform has production-grade accounts, durable school history, or personally identified learners until the persistence and policy gates are complete.

## Front-Door Entry

Front-door routes may ask for an entry code and a user code. The user code is a roster slot for reporting, not a login account. It should be validated against the tenant or launch-code roster plan when one exists.

## Speech And AI Tutor

Microphone replay, speech matching, Voice Tutor, and AI Tutor features must not add raw audio or transcripts to the roster by default. Any premium speech/tutor report must use a separate policy and cost-control contract.

## Local Or Closed Deployment

A local app can avoid hosted accounts, but it still needs a roster standard. Local storage must define backup, restore, report export, data removal, and year-on-year update behavior before real partner use.

## Current Files

- `packages/content-model/src/classRoster.ts`
- `apps/web/src/data/sampleClassRosterPlans.ts`
- `apps/web/src/features/teacher/ClassRosterReadinessPanel.tsx`
- `apps/web/src/features/teacher/TeacherSessionRosterIdentityCard.tsx`
- `docs/CLASS_ROSTER_CONTRACT.md`
- `docs/verification/CLASS_ROSTER_READINESS_CHECKS.md`
