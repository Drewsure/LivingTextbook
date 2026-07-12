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

## Current Pilot Specs

- Tenant entitlement store.
- Package release store.
- Teacher draft package store.
- Package game/audio coverage snapshot.
- Permanent QR alias store.
- Progress event stream.
- Earned collection inventory.
- Teacher report package boundary.
- Publisher maintenance change request.
- Local companion handoff checklist.
- Local companion release gate.

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
- Specs do not imply that production storage is ready.
- The progress event stream is visibly policy-blocked.
- The earned collection inventory is visibly policy-blocked and rejects random pressure or purchase-like ownership.
- Future backend work can map these specs to Supabase, Firebase, SQLite/local, or another store without changing product vocabulary.
