# Operating Note OW-053: Assignment Curriculum-Level Alignment

## Context

Teacher assignments sit upstream of QR entry, private links, reporting, and
classroom rollout. A plan that lists a future-level game can create a promise
that conflicts with the reviewed unit offer map even when the student route
itself is correctly gated.

## Procedure

When creating or changing an assignment plan:

1. Declare the curriculum level for the package.
2. Check each target mode against its shared supported-level contract.
3. Keep `audioCoveredGameModes` aligned with the target list.
4. Keep teacher-only and premium controls explicit; they must not become
   ordinary student-completion evidence.
5. Run assignment rollout, assignment runtime, runtime behavior, and web
   typecheck checks.

## Resolution

`TeacherAssignmentPlan` now requires `curriculumLevel` and rejects modes that
are unsupported at that level. The three Level 1 sample assignments no longer
list Sentence Builder, while later-level assignment data can opt into it by
declaring a supported level.
