# Backend Migration Candidates

Document type: foundation implementation contract  
Status: active scaffold  
Last updated: 2026-07-31

## Purpose

Backend migration candidates define the ordered implementation slices for moving from static demo data to a real first pilot.

They are vendor-neutral. They do not choose Supabase, Firebase, SQLite, Postgres, or a local-first vendor. They name sequence, prerequisites, rollback/export needs, and forbidden shortcuts before production persistence work starts.

## Current UI Surface

Review at:

- `http://127.0.0.1:3000/teacher/intake`

Current files:

- `apps/web/src/data/sampleBackendMigrationCandidates.ts`
- `apps/web/src/features/persistence/BackendMigrationPlanPanel.tsx`
- `apps/web/src/app/teacher/intake/page.tsx`

## Sequencing Rule

Migrate identity-light administrative records first, then route/package release control, then teacher sessions, then event streams, collection inventory, and reports.

Do not store real student progress until policy, retention, export, and access rules are accepted.

## Candidate Migration Order

1. Tenant and feature entitlement records.
2. Package release and reviewed content records.
3. Teacher draft package records.
4. Upload intake, review, promotion, game asset, label anchor, activity compatibility, template rendering, and font accessibility records.
5. Teacher draft review decision, evidence, audit, and verifier submission records.
6. Target-language audio approval records.
7. AI generated package manifest records.
8. Tenant library item records.
9. Stable QR and route alias registry.
10. Media manifest and rights records.
11. Publish gate and approval ledger records.
12. Pilot evidence packet records.
13. Teacher dry-run rehearsal records.
14. Classroom launch gate records.
15. School launch policy gate records.
16. Teacher launch session and settings records.
17. Progress and media event stream records.
18. Earned collection inventory records.
19. Local classroom export and restore records.

## Required Per Candidate

Each candidate must define:

- target entities,
- implementation track,
- readiness status,
- risk,
- purpose,
- prerequisites,
- implementation notes,
- rollback or export needs,
- forbidden shortcuts.

## Standing Rules

- Do not create production migrations before backend choice and policy gates are accepted.
- Migrations must preserve tenant boundaries and release-control records.
- Raw learner audio and transcripts stay out of core storage.
- Hosted and local implementations must use the same record vocabulary.
- Collection inventory must be deterministic, mastery-earned, exportable, and blocked from random pressure or purchase-like unlock paths.
- Teacher draft package migrations must preserve owner, source lineage, visibility, review gates, audio plan state, and direct-assignment blocks.
- AI generated package teacher review packet migrations must preserve teacher decision lanes, ready signals, missing evidence, blocked actions, next records, target-language audio approval, media-rights evidence, teacher approval ledger, release-control binding, and assignment rollout gate needs while blocking approval capture, package assembly, route writes, playlist writes, assignments, local bundles, student-ready markers, and support-language progress.
- Target-language audio approval migrations must preserve cue-level review items, progress boundaries, audio cue manifests, package audio coverage, support-language rules, and blocked voice/API/package actions while blocking audio approval capture, generated voice calls, speech API billing, package audio-complete markers, route creation, playlist creation, assignments, media-only progress, and support-language progress.
- AI generated package manifest migrations must preserve prompt, draft, audio, engine, gamification, verifier, review queue, media-rights, and release-lock lineage while blocking package assembly, route registry writes, media playlist writes, assignments, local bundle writes, and student-ready markers.
- Codex patch approval decision migrations must preserve patch scope, evidence checks, decision options, route safety, rollback, storage, reviewer identity, and patch-action blockers before any app file work can exist.
- Signed approval preflight migrations must preserve reviewer identity, scope locks, approval draft fields, evidence checklists, cannot-approve blockers, and approval-action blockers before signature capture, approve buttons, or patch authorization can exist.
- Patch authorization release lock migrations must preserve release-control locks, narrow authorization scope, forbidden-until-unlocked blockers, release evidence, and patch-action blockers before app file work can exist.
- Patch implementation work order migrations must preserve required-before-work records, allowed future file groups, dry-run verification order, rollback plan, release-lock binding, reviewer identity, and work-order blockers before work order execution, app file writes, tests, routes, scoring, rewards, audio manifests, package promotion, assignments, or support-language progress can exist.
- Patch change set preview migrations must preserve planned file changes, invariant checks, review blockers, next records, linked work order, reviewer identity, and change-set blockers before apply-patch actions, app file writes, generated file writes, tests, routes, scoring, rewards, audio manifests, package promotion, assignments, or support-language progress can exist.
- Tenant library item migrations must preserve source lineage, block student-data copies, and block public community publishing.
- Activity compatibility snapshot migrations must preserve payload shape, allowed activity modes, blocked conversions, target-language trigger policy, printable output policy, and student-facing pathway blocks.
- Template rendering profile migrations must preserve source template identity, curated compatibility, row/media slot policy, layout constraints, and student-facing rendering blocks.
- Font accessibility profile migrations must preserve approved learner fonts, tenant font packs, multilingual rendering rules, readability/license checks, and student-facing font blocks.
- Pilot evidence packet migrations must preserve gate evidence, approval evidence, upload blocks, signed-approval capture blocks, export rules, and local fallback metadata before live evidence collection.
- Teacher dry-run rehearsal migrations must preserve route, game/audio, media/support-language, report, and local fallback checks while blocking student launch, real learner data collection, live progress storage, and report export.
- School launch policy gate migrations must preserve school, publisher, platform, and shared dry-run ownership while blocking policy acceptance workflows, live launch, real learner data, report export, local activation, launch-ready status, and support-language-only progression.
- Every migration candidate needs rollback or export expectations before implementation.

## Non-Goals

- This is not migration SQL.
- This does not choose a backend vendor.
- This does not activate production writes.
- This does not capture real package approvals.
- This does not store real student data.
