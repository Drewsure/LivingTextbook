# Build Session Note: Teacher Assignment Readiness

Date: 2026-07-02

## Work Completed

Added a teacher assignment readiness contract and admin surface:

- `packages/content-model/src/teacherAssignment.ts`
- `apps/web/src/data/sampleTeacherAssignmentPlans.ts`
- `apps/web/src/features/teacher/TeacherAssignmentReadinessPanel.tsx`
- `/teacher/intake` now renders the assignment panel after pilot and unit package readiness gates.

## Why This Matters

A reviewed package should not automatically become a live classroom assignment. The assignment contract is the bridge between reviewed content and a class launch. It makes teacher controls, access mode, QR/front-door behavior, report export, microphone practice, AI Tutor, local fallback, and pilot blockers explicit.

## Guardrails Preserved

- Target-language audio is core.
- Assist language is optional support and never satisfies progression gates.
- Local microphone record/replay remains teacher-optional and no-upload.
- Report export remains blocked until persistence and policy are accepted.
- AI Tutor and cloud speech scoring remain premium-disabled in core assignment plans.
- Closed/local companion work remains visible without becoming the first pilot cost center.

## Verification

After pulling the branch locally, run typecheck/build and verify:

- `docs/verification/TEACHER_ASSIGNMENT_READINESS_CHECKS.md`
- `http://127.0.0.1:3000/teacher/intake`
