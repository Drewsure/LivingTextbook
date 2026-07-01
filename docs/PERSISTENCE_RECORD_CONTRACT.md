# Persistence Record Contract

Document type: foundation data contract  
Status: active scaffold  
Last updated: 2026-07-01

## Purpose

The durable record map defines what must become persisted before Living Textbook can move from static demo flows to a real school, publisher, or textbook partner pilot.

This contract does not choose a backend. It names the records so that Supabase, Firebase, SQLite, Postgres, local classroom storage, or another option can be compared against the same requirements.

## Current Route

Review at:

- `http://127.0.0.1:3000/teacher/intake`

## Shared Contract

The shared contract lives in:

- `packages/content-model/src/persistenceRecords.ts`

It defines:

- `DurableRecordContract`
- `PersistenceRecordCategory`
- `PersistenceRecordReadiness`
- `PersistenceStorageTier`
- `validateDurableRecordContracts`
- `getDurableRecordReadinessWarnings`

## Record Families

The scaffold currently tracks:

- Tenant configuration records.
- Reviewed content package records.
- QR and route registry records.
- Teacher launch session and settings records.
- Progress and media event stream records.
- Media manifest and rights records.
- Deployment profile records.
- Report export and retention policy records.

## Safety Rules

- Core persistence must not store raw learner audio.
- Core persistence must not store learner transcripts.
- Student-data records require privacy, retention, export, access-control, and school/parent policy before pilot use.
- Teacher session settings belong with launch-session records.
- Local/closed deployment capable records must preserve a local classroom store path.

## Pilot Warnings

Warnings are expected in scaffold mode. They identify the remaining decisions before real pilots:

- which records must move from static/demo to durable storage,
- which student-data records require school policy,
- which media-rights records require hosted object storage or local bundle manifest rules.

## Non-Goals

- No backend vendor is selected here.
- No real student event storage is activated here.
- No AI Tutor usage, transcript storage, cloud speech scoring, or raw audio upload is activated here.
- No authentication or billing layer is implemented here.
