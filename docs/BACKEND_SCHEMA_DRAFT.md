# Backend Schema Draft

Document type: foundation data contract  
Status: active scaffold  
Last updated: 2026-07-10

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
- Package game/audio coverage
- Route alias and QR registry
- Media manifest and rights
- Teacher launch session
- Progress and media event
- Package publish gate
- Package approval ledger

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
- Support language never unlocks target-language progression.
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
