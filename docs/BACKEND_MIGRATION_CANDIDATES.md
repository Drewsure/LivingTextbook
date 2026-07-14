# Backend Migration Candidates

Document type: foundation implementation contract  
Status: active scaffold  
Last updated: 2026-07-14

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
4. Upload intake, review, promotion, game asset, label anchor, template rendering, and font accessibility records.
5. Teacher draft review decision, evidence, audit, and verifier submission records.
6. Tenant library item records.
7. Stable QR and route alias registry.
8. Media manifest and rights records.
9. Publish gate and approval ledger records.
10. Teacher launch session and settings records.
11. Progress and media event stream records.
12. Earned collection inventory records.
13. Local classroom export and restore records.

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
- Tenant library item migrations must preserve source lineage, block student-data copies, and block public community publishing.
- Template rendering profile migrations must preserve source template identity, curated compatibility, row/media slot policy, layout constraints, and student-facing rendering blocks.
- Font accessibility profile migrations must preserve approved learner fonts, tenant font packs, multilingual rendering rules, readability/license checks, and student-facing font blocks.
- Every migration candidate needs rollback or export expectations before implementation.

## Non-Goals

- This is not migration SQL.
- This does not choose a backend vendor.
- This does not activate production writes.
- This does not capture real package approvals.
- This does not store real student data.
