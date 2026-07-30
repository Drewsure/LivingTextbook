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
- `apps/web/src/features/content-intake/TeacherDraftContentEntryWorkbenchPreview.tsx`
- `apps/web/src/features/content-intake/TeacherDraftLocalEditPreview.tsx`
- `apps/web/src/features/content-intake/TeacherDraftReviewHandoffPreview.tsx`
- `apps/web/src/features/content-intake/TeacherDraftReviewQueuePanel.tsx`

Route:

- `/teacher/intake`
- `/teacher/authoring/draft-sample-publisher-l1-u1`
- `/teacher/review`

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

The route includes a disabled content-entry workbench preview. It shows the future teacher authoring surface for activity title, instruction, single/double sided cards, row front/back values, formatting tools, row audio cues, image upload positions, reorder, duplicate, delete, add item, flip tiles, AI draft help, cross-game upload guidance, approved font/rendering controls, profile binding preview, item limits, and Done. It cannot save, upload, publish, assign, switch templates, or route Done to students.

The content-entry workbench must show the reviewed-profile dependency before live template or font controls are enabled. It must keep `template_rendering_profile`, `font_accessibility_profile`, `Student-facing rendering blocked`, and `Student-facing font blocked` visible until profile review and release gates pass.

The route includes a draft audio coverage preview. It must keep term audio, sentence audio, and instruction audio visible before student use.

The route includes a draft review handoff preview. It shows the schema, source lineage, audio coverage, rights/version, route/activity, and approval packets that a future submit-for-review workflow must carry, while keeping review submission blocked until durable storage, ownership, verifier workflow, audio regeneration, and package approval exist.

The backend-neutral storage contract includes `teacher_draft_review_handoff` records. Hosted and local adapters must preserve the same packet sections and must keep live review submission blocked until the real verifier and package approval workflow exists.

The review queue route is a read-only workbench preview. It shows draft handoff queue items, packet sections, blockers, allowed actions, and next steps without enabling live verifier submission, package approval, direct AI publish, or student assignment.

AI-generated draft packages must enter this same review queue as read-only items. They must show source lineage, verifier packet requirements, blocked route/playlist/assignment actions, target-language audio blockers, media-rights blockers, engine/gamification checks, and teacher approval blockers before any generated package can move toward approval.

The review queue route includes a verifier submission preflight. It shows schema, audio, support-language, route, and evidence checks that a future verifier workflow must pass, while keeping automatic verifier submission blocked.

The backend-neutral storage contract includes `teacher_draft_verifier_submission` records. Hosted and local adapters must preserve verifier preflight checks and block automatic verifier submission until workflow, identity, evidence, and approval policy exist.

The review queue route includes reviewer decision previews. `Return for edits`, `Needs audio`, and `Ready for approval` are visible as future outcomes only. Their actions remain disabled until reviewer identity, evidence storage, verifier workflow, package approval, and release-control policy exist.

The backend-neutral storage contract includes `teacher_draft_review_decision` records. Hosted and local adapters must preserve reviewer evidence requirements and block package state changes until identity, evidence, verifier, approval, and release-control rules pass.

The review queue route includes a review evidence packet preview. It lists the proof a future reviewer decision must carry, while file upload, signature capture, and evidence storage remain blocked.

The backend-neutral storage contract includes `teacher_draft_review_evidence` records. Hosted and local adapters must preserve evidence packet metadata and block uploads until reviewer identity, storage, retention, rights, and approval policy exist.

The review queue route includes a review audit trail preview. It shows the future sequence of handoff, reviewer decision, evidence, and approval-ledger events without allowing live state transitions, approvals, publishing, uploads, or student assignment.

The backend-neutral storage contract includes `teacher_draft_review_audit` records. Hosted and local adapters must preserve review audit events and block audit-driven state changes until identity, evidence, approval ledger, and release-control policy exist.

The route must continue to show:

- `Teacher draft package`
- `Draft only`
- `Local edit preview`
- `Draft content-entry workbench preview`
- `Activity title`
- `+ Instruction`
- `Generate With AI blocked`
- `Flip tiles preview`
- `Cross-game upload guide`
- `Approved learner font`
- `Tenant font pack`
- `Hiragana-safe font`
- `Font rendering gate`
- `Profile binding preview`
- `template_rendering_profile: template-profile-flip-tiles-cross-game-v1`
- `font_accessibility_profile: font-profile-young-learner-ja-safe-v1`
- `Student-facing rendering blocked`
- `Student-facing font blocked`
- `Single sided`
- `Double sided`
- `min 2 max 50`
- `Audio cue required`
- `Image upload blocked`
- `No live file picker`
- `No Done-to-student route`
- `No template switch without compatibility check`
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

The review queue route must continue to show:

- `Teacher draft review queue`
- `Review workbench preview`
- `Review handoff packet`
- `AI-generated daily routines draft preview`
- `Source lineage`
- `AI verifier submission packet`
- `AI verifier submission packet required`
- `Create route from AI draft`
- `Create playlist from AI draft`
- `Verifier submission blocked`
- `Package approval blocked`
- `Student assignment blocked`
- `No live approval`
- `No direct AI publish`
- `Verifier submission preflight`
- `Verifier submission still blocked`
- `Schema packet ready`
- `Audio regeneration pending`
- `Support language support-only`
- `Route compatibility ready`
- `Review evidence pending`
- `No automatic verifier submit`
- `Reviewer decision preview`
- `Decision actions disabled`
- `Return for edits`
- `Needs audio`
- `Ready for approval`
- `Approval still blocked`
- `Approver identity required`
- `Review evidence packet preview`
- `Evidence upload blocked`
- `Reviewer identity evidence`
- `Evidence storage required`
- `No file upload in foundation preview`
- `Review audit trail preview`
- `Audit trail storage required`
- `Handoff packet created`
- `Reviewer decision drafted`
- `Evidence packet blocked`
- `Approval ledger blocked`
- `No live state transition`

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
- Content-entry workbench previews do not save, upload, switch templates, publish, assign, render printables, activate profile bindings, or route Done to students.
- Font/rendering controls are tenant-approved configuration only; they cannot bypass readability, licensing, accessibility, language, or template-layout review.
- Draft audio coverage must be reviewed before student use.
- Draft review handoff previews do not submit; they summarize review requirements only.
- Review queue previews do not approve, submit, publish, or assign.
- Verifier preflight previews do not submit to verifier or promote draft state.
- Reviewer decision previews do not change package state.
- Evidence packet previews do not upload, sign, approve, publish, or assign.
- Review audit trail previews do not change package state, approve, publish, upload evidence, or assign students.
- Teacher edits must preserve package source and lineage.
- Support language cannot become the progression trigger.
- Teacher-created printables must not imply automatic digital mastery.
- Teacher authoring must not overwrite original reviewed packages.
- AI may suggest structure, but cannot publish student-facing content by itself.

## Follow-Up

Promote teacher authoring from planning data to durable records after authentication, ownership, package versioning, and persistence are selected.
