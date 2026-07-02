# Build Session Note: Assignment-Aware Student Routes

Date: 2026-07-02

## Work Completed

Connected sample teacher assignment plans to the student launch and Speak It routes.

Files changed:

- `apps/web/src/data/sampleTeacherAssignmentPlans.ts`
- `apps/web/src/data/sampleLaunchResolver.ts`
- `apps/web/src/features/student/components/TeacherAssignmentSettingsCard.tsx`
- `apps/web/src/features/student/StudentLaunchFlow.tsx`
- `apps/web/src/features/game-shell/speaking/SpeakItDemoFlow.tsx`
- `apps/web/src/app/launch/[code]/page.tsx`
- `apps/web/src/app/speak/[code]/page.tsx`

## Why This Matters

Assignment controls now reach the actual student routes instead of living only in admin panels. Students see a compact session settings card that reinforces the key classroom rules:

- English practice unlocks the next activity.
- Support language is support only.
- Microphone practice is teacher-controlled.
- AI Tutor remains premium off in the foundation route.

## Verification

After pulling the branch locally, run typecheck/build and verify:

- `http://127.0.0.1:3000/launch/demo-unit-1`
- `http://127.0.0.1:3000/speak/demo-unit-1`
- `http://127.0.0.1:3000/launch/partner-demo-unit-1`
- `http://127.0.0.1:3000/speak/partner-demo-unit-1`
- `docs/verification/TEACHER_ASSIGNMENT_READINESS_CHECKS.md`
