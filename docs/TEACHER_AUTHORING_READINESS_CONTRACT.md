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
- `apps/web/src/data/sampleTeacherDraftPackage.ts`

Panel:

- `apps/web/src/features/content-intake/TeacherAuthoringReadinessPanel.tsx`
- `apps/web/src/features/content-intake/TeacherDraftPackagePreviewPanel.tsx`
- `apps/web/src/features/content-intake/TeacherDraftAudioCoveragePreview.tsx`
- `apps/web/src/features/content-intake/TeacherDraftLocalEditPreview.tsx`
- `apps/web/src/features/content-intake/TeacherDraftReviewHandoffPreview.tsx`

Route:

- `/teacher/intake`
- `/teacher/authoring/draft-sample-publisher-l1-u1`

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

## Teacher Draft Preview Route

The current scaffold includes one teacher-only draft package preview route:

- `http://127.0.0.1:3000/teacher/authoring/draft-sample-publisher-l1-u1`

This route is not a live editor. It shows the shape of a draft package, source lineage, blocked actions, requested activity path, audio-review requirements, and review gates.

The route also includes a local-only edit preview. It can validate draft shape in the browser, but it cannot save, publish, assign, or regenerate audio.

The route includes a draft audio coverage preview. It must keep term audio, sentence audio, and instruction audio visible before student use.

The route includes a draft review handoff preview. It shows the schema, source lineage, audio coverage, rights/version, route/activity, and approval packets that a future submit-for-review workflow must carry, while keeping review submission blocked until durable storage, ownership, verifier workflow, audio regeneration, and package approval exist.

The backend-neutral storage contract includes `teacher_draft_review_handoff` records. Hosted and local adapters must preserve the same packet sections and must keep live review submission blocked until the real verifier and package approval workflow exists.

The route must continue to show:

- `Teacher draft package`
- `Draft only`
- `Local edit preview`
- `Draft audio coverage preview`
- `Draft review handoff preview`
- `Review packet blocked`
- `Schema validation packet`
- `Source lineage packet`
- `Audio coverage packet`
- `Rights and version packet`
- `Route and activity packet`
- `Approval packet`
- `Draft persistence required`
- `No student assignment`
- `Term audio`
- `Sentence audio`
- `Instruction audio`
- `Save draft blocked`
- `Submit for review blocked`
- `Student assignment blocked`
- `Review before assignment`
- `Audio before students`
- `Audio regeneration required`
- `No direct publish`

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
- Local edit previews do not save, publish, assign, or regenerate audio.
- Draft audio coverage must be reviewed before student use.
- Draft review handoff previews do not submit; they summarize review requirements only.
- Teacher edits must preserve package source and lineage.
- Support language cannot become the progression trigger.
- Teacher-created printables must not imply automatic digital mastery.
- Teacher authoring must not overwrite original reviewed packages.
- AI may suggest structure, but cannot publish student-facing content by itself.

## Follow-Up

Promote teacher authoring from planning data to durable records after authentication, ownership, package versioning, and persistence are selected.
