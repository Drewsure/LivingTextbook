# Backend Migration Specification Contract

Document type: implementation contract

Status: active scaffold

Related:

- `docs/BACKEND_SCHEMA_DRAFT.md`
- `docs/BACKEND_MIGRATION_CANDIDATES.md`
- `docs/PERSISTENCE_RECORD_CONTRACT.md`
- `docs/PERSISTENCE_ADAPTER_CONTRACT.md`

## Purpose

The backend migration specification layer turns vendor-neutral backend candidates into concrete collection/table-style templates without choosing a backend vendor too early.

This is a bridge between product architecture and implementation. It names the records that the first pilot will need, but it does not create production migrations yet.

## Required Rules

- Specs must stay vendor-neutral until the backend decision is made.
- Specs must preserve white-label tenant boundaries.
- Specs must name primary keys, tenant scope, retention, export, local fallback, and policy blockers.
- Specs must not store raw learner audio.
- Specs must not store raw AI Tutor transcripts.
- Specs must not store unreviewed PDF material as student-facing content.
- Specs must support hosted and local-classroom vocabulary where practical.
- Progress events remain policy-blocked until student identity, retention, consent, and reporting policy are accepted.
- Earned collection inventory remains policy-blocked until student identity, export, retention, and reward catalog rules are accepted.
- Teacher draft package specs must preserve owner, source lineage, visibility, review gates, audio plan state, and direct-assignment blocks before draft packages can become student-facing releases.
- AI generated package manifest specs must preserve prompt, draft JSON, audio, engine, gamification, verifier, review queue, media-rights, and release-lock lineage while blocking package assembly, route registry writes, media playlist writes, assignments, local bundle writes, and student-ready markers.
- Codex patch approval decision specs must preserve patch scope, evidence checks, decision options, route safety, rollback, storage verification, reviewer identity, and blocked-action flags before any future patch execution or app file work.
- AI prototype patch implementation work order specs must preserve release-lock binding, signed approval acceptance, required-before-work records, allowed future file groups, dry-run verification order, rollback plan, storage verification, reviewer identity, and blocked-action flags before any work order execution, patch work, test execution, route mutation, scoring/reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress.
- AI prototype patch change set preview specs must preserve linked work order, planned file changes, invariant checks, review blockers, next records, storage verification, reviewer identity, and blocked-action flags before any apply-patch action, app file write, generated file write, test execution, route mutation, scoring/reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress.
- Tenant library item specs must preserve source lineage, block student-data copies, and block public community publishing before copy/edit, school sharing, search, or public-community work begins.
- Activity compatibility snapshot specs must preserve payload shape, allowed activity modes, blocked conversions, target-language trigger policy, printable output policy, and student-facing pathway blocks before extra conversions or teacher pathway changes go live.
- Template rendering profile specs must preserve source templates, curated game-family compatibility, row/media slot policy, layout constraints, and student-facing rendering blocks before any cross-game upload pattern or printable rendering goes live.
- Font accessibility profile specs must preserve approved learner fonts, tenant font packs, multilingual rendering rules, readability checks, licensing, and student-facing font blocks before any tenant font control goes live.
- Pilot evidence packet specs must preserve gate evidence, approval evidence, upload blocks, signed-approval capture blocks, retention, export, and local fallback before live evidence upload or approval capture goes live.
- Teacher dry-run rehearsal specs must preserve teacher-only route, game/audio, media/support-language, report, and local fallback checks before live classroom launch.
- School launch policy gate specs must preserve school, publisher, platform, and shared dry-run ownership while blocking policy acceptance workflows, live launch, real learner data, report export, local activation, launch-ready status, and support-language-only progression.

## Current Pilot Specs

- Tenant entitlement store.
- Package release store.
- Teacher draft package store.
- AI generated package manifest store.
- Tenant library item store.
- Activity compatibility snapshot store.
- Template rendering profile store.
- Font accessibility profile store.
- Package game/audio coverage snapshot.
- Permanent QR alias store.
- Progress event stream.
- Earned collection inventory.
- Teacher report package boundary.
- Publisher maintenance change request.
- Local companion handoff checklist.
- Local companion release gate.
- Pilot evidence packet.
- Teacher dry-run rehearsal.
- Classroom launch gate.
- School launch policy gate.

## Implementation Gate

Before real backend migrations are written, the project must confirm:

- Which backend is used for the first hosted pilot.
- Which deployment profile is active.
- Whether local classroom fallback is in scope for the pilot.
- Student identity model.
- Reporting retention length.
- Export and deletion expectations.
- Media rights and package release policy.
- AI Tutor and microphone entitlements.

## Acceptance Criteria

- `/teacher/intake` shows the migration specs beside schema and migration candidates.
- Each spec names field shape, indexes, retention, export, local fallback, and policy blockers.
- Signed approval preflight specs must block signature capture, approve buttons, patch authorization, app file writes, route mutation, scoring/reward mutation, package promotion, assignments, and support-language progress.
- Patch authorization release lock specs must block patch authorization, app file writes, route mutation, scoring/reward mutation, package promotion, assignments, and support-language progress.
- Patch implementation work order specs must block work order execution, app file writes, test execution, route mutation, scoring/reward mutation, package promotion, assignments, and support-language progress.
- Patch change set preview specs must block apply-patch actions, app file writes, generated file writes, test execution, route mutation, scoring/reward mutation, package promotion, assignments, and support-language progress.
- Specs do not imply that production storage is ready.
- The progress event stream is visibly policy-blocked.
- The earned collection inventory is visibly policy-blocked and rejects random pressure or purchase-like ownership.
- Future backend work can map these specs to Supabase, Firebase, SQLite/local, or another store without changing product vocabulary.
