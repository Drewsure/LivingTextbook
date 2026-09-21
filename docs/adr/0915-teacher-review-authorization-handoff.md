# ADR 0915: Teacher Review Authorization Handoff

## Decision

Place the existing tenant-scoped teacher operations session control directly
on the teacher launch monitor before the hosted event review panel. Reuse the
same session-change event and authorization cookie; do not create a second
teacher login or a client-held access token.

## Required Invariants

- The launch monitor requires the same school-approved review session as the
  persistence workbench.
- Session scope must match the launch tenant.
- Sign-in and sign-out trigger review-panel refresh only.
- The session cannot control student gameplay, expose raw learner audio or
  transcripts, or write persistence.

## Evidence

- `apps/web/src/app/teacher/sessions/[launchCode]/page.tsx`
- `apps/web/src/features/persistence/TeacherOperationsAccessPanel.tsx`
- `apps/web/src/features/persistence/HostedProgressEventReviewPanel.tsx`
- `apps/web/src/features/persistence/teacherOperationsSessionEvents.ts`
