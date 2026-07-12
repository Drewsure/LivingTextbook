# Teacher Authoring Readiness Contract

Document type: foundation product contract

Related:

- `docs/AI_AUTHORING_VERIFIER_HANDOFF.md`
- `docs/PRIVATE_TENANT_LIBRARY_CONTRACT.md`
- `docs/ACTIVITY_PATHWAY_COMPATIBILITY_MATRIX.md`
- `docs/PRINTABLE_OUTPUT_READINESS_CONTRACT.md`

## Purpose

Teacher authoring should eventually feel fast, but fast authoring must create drafts only.

No teacher draft, AI suggestion, copied package, activity pathway change, printable output, or translation becomes student-facing until review, audio, rights, route, and package gates pass.

## Current Sample

Sample data:

- `apps/web/src/data/sampleTeacherAuthoringReadiness.ts`

Panel:

- `apps/web/src/features/content-intake/TeacherAuthoringReadinessPanel.tsx`

Route:

- `/teacher/intake`

Verifier:

- `npm run verify:teacher-authoring`

## Current Authoring Lanes

Planned:

- Quick draft from reviewed source
- Copy and edit reviewed package
- Activity pathway edit
- Printable authoring

Blocked:

- Direct AI publish

## Student Assignment Rule

Fast authoring creates draft packages only.

Student assignment requires:

- reviewed package data,
- target-language progression rules,
- audio coverage,
- route readiness,
- media rights where media is used,
- package version record,
- teacher or tenant approval.

## Standing Rules

- Direct draft assignment is blocked.
- Direct AI publish is blocked.
- Teacher edits must preserve package source and lineage.
- Support language cannot become the progression trigger.
- Teacher-created printables must not imply automatic digital mastery.
- Teacher authoring must not overwrite original reviewed packages.
- AI may suggest structure, but cannot publish student-facing content by itself.

## Follow-Up

Promote teacher authoring from planning data to durable records after authentication, ownership, package versioning, and persistence are selected.
