# Persistence Record Contract

Document type: foundation data contract  
Status: active scaffold  
Last updated: 2026-07-13

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
- Teacher draft package records.
- Tenant library item records.
- QR and route registry records.
- Teacher launch session and settings records.
- Progress and media event stream records.
- Earned collection inventory records.
- Media manifest and rights records.
- Deployment profile records.
- Report export and retention policy records.
- Evidence packet records.
- Package publish gate records.
- Package approval ledger records.
- Pilot evidence packet records.
- Teacher dry-run rehearsal records.

## Package Release Records

Package publish gates and approval ledgers are now first-class durable records.

A package publish gate records:

- release candidate,
- release-blocking gates,
- gate owner,
- status,
- evidence,
- next step,
- required-before-pilot items,
- not-allowed-yet items.

A package approval ledger records:

- release candidate,
- sign-off role,
- owner,
- approver identity when persistence exists,
- timestamp when persistence exists,
- evidence links,
- cannot-approve-while blockers,
- rollback or replacement relationship when releases are superseded.

These records protect the platform from treating a controlled demo as a real pilot. They also support white-label yearly textbook maintenance because publishers need auditable releases for content, media, games, QR, reports, policy, deployment, and platform review.

## Teacher Dry-Run Records

Teacher dry-run rehearsal records preserve route checks, game/audio checks, media/support-language checks, report/policy checks, and local fallback checks before classroom launch.

They are release-control evidence, not student progress records. They must block student launch, real learner data collection, live progress storage, report export, raw learner audio, and learner transcripts.

## Safety Rules

- Core persistence must not store raw learner audio.
- Core persistence must not store learner transcripts.
- Student-data records require privacy, retention, export, access-control, and school/parent policy before pilot use.
- Teacher session settings belong with launch-session records.
- Earned collection inventory must preserve deterministic mastery-earned unlock rules.
- Earned collection inventory must reject random reward pressure, paid gacha-like ownership, and support-only unlocks.
- Package approval ledgers require approver identity and policy rules before real sign-offs are stored.
- Package publish gates must not mark a package pilot-publishable while release-blocking items remain open.
- Evidence packet records must preserve packet status, required evidence, missing evidence, blocked live actions, and handoff rules while blocking evidence upload, signed approval capture, promotion, and student-facing use.
- Teacher dry-run rehearsal records must not launch students, collect real learner data, store live progress, or export reports.
- Teacher draft packages must preserve owner, source lineage, visibility, draft payload, requested activity path, review gates, audio plan state, and direct-assignment blocks before becoming package releases.
- Tenant library items must preserve source lineage, block student-data copies, and block public community publishing before live library reuse, copy/edit, school sharing, or search work begins.
- Local/closed deployment capable records must preserve a local classroom store path.

## Pilot Warnings

Warnings are expected in scaffold mode. They identify the remaining decisions before real pilots:

- which records must move from static/demo to durable storage,
- which student-data records require school policy,
- which media-rights records require hosted object storage or local bundle manifest rules,
- which package release gates require evidence-backed storage,
- which approval ledgers require approver identity, timestamp, and policy rules.

## Non-Goals

- No backend vendor is selected here.
- No real student event storage is activated here.
- No real package approvals are captured here.
- No AI Tutor usage, transcript storage, cloud speech scoring, or raw audio upload is activated here.
- No authentication or billing layer is implemented here.
