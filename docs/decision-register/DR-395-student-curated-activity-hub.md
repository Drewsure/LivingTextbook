# DR-395: Student Curated Activity Hub

Date: 2026-08-11

Status: Accepted

## Decision

Add student activity hub routes at `/activities/demo-unit-1` and `/activities/partner-demo-unit-1` to show reviewed unit activities without exposing a switch-to-anything template panel.

## Rationale

The platform should help teachers and students navigate a curated pathway: launch, flashcards, Match Up, Memory Match, Balloon Pop, Quiz, Sentence Builder, Speak It, Training Academy, media, and print. That is different from promising that any teacher content can instantly become any activity.

The activity hub makes the reviewed route pathway visible while preserving the white-label rule that compatibility and conversion choices are pre-reviewed.

## Impact

- MiniStar and sample publisher now have student-safe activity hub routes.
- Teacher launch shortcuts, partner demo shortcuts, teacher unit review contexts, active route matrix, package readiness checks, and route verification include the activity hubs.
- The active route count is now 69 checked routes after dedicated Match Up, Balloon Pop, True or False, and Type Answer activity routes.
- The hub provides a natural future target for assignment links and stable QR aliases without giving students teacher/admin controls.

## Constraints

- The hub is a student route, not a teacher authoring surface.
- The hub cannot create activities, switch templates, publish packages, promote uploaded files, or change assignments.
- Media and print remain support-only and cannot unlock mastery.
- Target-language activity remains the progress trigger.

## Verification

- `npm.cmd run verify:package-readiness`
- `npm.cmd run verify:ai-generator`
- `npm.cmd run typecheck --workspace @living-textbook/web`
- `npm.cmd run build --workspace @living-textbook/web`
- `npm.cmd run verify:routes`
