# Backend Schema Draft

Document type: foundation data contract  
Status: active scaffold  
Last updated: 2026-07-31

## Purpose

The backend schema draft names the vendor-neutral storage shapes required for the first real Living Textbook pilot.

It is not a migration file and it does not choose Supabase, Firebase, SQLite, Postgres, or a custom local store. It is the comparison layer that lets backend candidates be judged against the same records.

## Current UI Surface

Review at:

- `http://127.0.0.1:3000/teacher/intake`

Current files:

- `apps/web/src/data/sampleBackendSchemaDraft.ts`
- `apps/web/src/features/persistence/BackendSchemaDraftPanel.tsx`
- `apps/web/src/app/teacher/intake/page.tsx`

## Draft Entities

The current draft includes:

- Tenant
- Package release
- Teacher draft package
- Teacher draft review handoff
- Teacher draft verifier submission
- AI generated package manifest
- Upload intake asset
- Upload review decision
- Upload promotion gate
- Game asset manifest
- Label anchor record
- Activity compatibility snapshot
- Template rendering profile
- Font accessibility profile
- Teacher draft reviewer decision
- Teacher draft review evidence
- Teacher draft review audit
- Tenant library item
- Package game/audio coverage
- Route alias and QR registry
- Media manifest and rights
- Teacher launch session
- Progress and media event
- Earned collection inventory
- Teacher report package boundary
- Package release candidate
- Publisher maintenance change request
- Local companion handoff checklist
- Local companion release gate
- Package publish gate
- Package approval ledger
- Pilot evidence packet
- Teacher dry-run rehearsal
- Classroom launch gate
- School launch policy gate

## Required Fields Per Entity

Each entity should name:

- purpose,
- status,
- deployment fit,
- fields,
- relationships,
- indexes,
- forbidden fields,
- migration note.

## Standing Schema Rules

- Every record belongs to a tenant or a tenant-owned package release.
- Raw learner audio and transcripts stay out of core schema.
- Media files live in object storage or local bundles; schema stores manifests and rights metadata.
- Package game/audio coverage stores release metadata only, not raw audio files or learner recordings.
- Earned collection inventory stores deterministic mastery-earned ownership only; random reward pressure and paid gacha-like ownership are forbidden.
- Teacher draft packages preserve owner, source lineage, visibility, draft payload, requested activity path, review gates, audio plan state, and direct-assignment blocks before becoming package releases.
- AI generated package manifests preserve prompt package, draft JSON, audio coverage, engine binding, gamification mapping, verifier packet, review queue, media-rights, and release-lock lineage before generated drafts can move toward package assembly.
- AI generated package manifests block package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready markers until review, approval ledger, and release-control gates pass.
- Codex patch approval decisions preserve patch scope, test readiness, harness planning, route safety, rollback, storage verification, reviewer identity, evidence checks, decision options, and blocked patch actions before any app file work can exist.
- Tenant library items preserve source lineage, block student-data copies, and block public community publishing for v1.
- Activity compatibility snapshots preserve payload shape, allowed activity modes, blocked conversions, target-language trigger policy, printable output policy, and student-facing pathway blocks before extra conversions or pathway changes go live.
- Template rendering profiles preserve source templates, compatible game families, row/media slot policies, layout constraints, and student-facing rendering blocks before cross-game upload patterns or printables go live.
- Font accessibility profiles preserve approved learner fonts, tenant font packs, multilingual rendering rules, readability checks, license status, and student-facing font blocks before font controls go live.
- Progress events and collection inventory must preserve support-only boundaries so assist language, media, or route guidance cannot unlock mastery.
- Teacher dry-run rehearsal records preserve route, game/audio, media/support-language, report, and local fallback checks while blocking real learner data, live progress, report export, and student launch.
- School launch policy gate records preserve school, publisher, platform, and shared dry-run ownership while blocking policy acceptance workflows, live launch, real learner data, report export, local activation, launch-ready status, and support-language-only progression.
- Support language never unlocks target-language progression.
- Signed approval preflight records preserve reviewer identity, scope locks, approval draft fields, evidence checklists, cannot-approve blockers, and approval-action blockers before any signature capture or patch authorization exists.
- Patch authorization release lock records preserve release-control locks, narrow authorization scope, forbidden-until-unlocked blockers, release evidence, and patch-action blockers before app file work can exist.
- AI Tutor and speech scoring stay premium-gated and disabled unless tenant policy accepts them.
- Local and hosted implementations must preserve the same record vocabulary.

## First Pilot Backend Fit

A backend candidate is not pilot-suitable unless it can store these records, enforce tenant boundaries, preserve release control, support teacher reports, and keep raw learner audio and transcripts out of core storage.

## Non-Goals

- No migration SQL is created here.
- No backend vendor is selected here.
- No authentication model is implemented here.
- No production student data is stored here.
- No real package approval signatures are captured here.
