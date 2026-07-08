# Persistence Adapter Contract

Document type: foundation data contract  
Status: active scaffold  
Last updated: 2026-07-09

## Purpose

The persistence adapter contract defines what future hosted, local classroom, or packaged-app storage must be able to write before Living Textbook becomes a real school or partner pilot.

This contract deliberately does not choose Supabase, Firebase, SQLite, Postgres, or any other vendor. It names write intents, safety limits, deployment fit, and handoff steps so backend choice remains replaceable.

## Shared Contract

The shared contract lives in:

- `packages/content-model/src/persistenceAdapter.ts`

It defines:

- `PersistenceAdapterPlan`
- `PersistenceWriteIntent`
- `PersistenceAdapterMode`
- `PersistenceWriteReadiness`
- `validatePersistenceAdapterPlan`
- `getPersistenceAdapterWarnings`

## Adapter Modes

### Static Demo Adapter

Used for source-controlled reviewed sample data. It is useful for design and sales demos, but it cannot support real teacher reports, route registry changes, partner self-maintenance, release-gate mutation, approval ledgers, or student progress storage.

### Hosted Pilot Adapter

The recommended first pilot path. It should support durable route registry writes, teacher launch-session settings, progress/media event writes, package publish gates, and package approval ledgers after privacy, release-control, and policy requirements are accepted.

### Local Classroom Adapter

A future closed deployment path for schools or textbook partners who require a local classroom server or packaged local app. It must support local media bundles, local progress export packages, package publish gates, package approval ledgers, backup/restore, and year-on-year content updates.

## Core Safety Rules

Every core adapter plan must:

- reject raw learner audio,
- reject learner transcripts,
- require school or tenant policy for student-data writes,
- require policy for approval ledgers before real sign-offs are stored,
- keep report and approval export policy-gated,
- identify whether it can run offline,
- name the deployment channels it supports,
- keep media/object storage concerns separate from student progress records,
- keep approval evidence storage separate from raw student progress records.

## Required Hosted Pilot Write Intents

The hosted pilot path should support:

- route registry entries,
- teacher launch-session settings,
- progress and media events,
- package publish gates,
- package approval ledgers.

Package publish gates are backend-required before a package can be marked pilot-publishable. Package approval ledgers remain policy-required until approver identity, timestamp, evidence, export, and rollback rules are accepted.

## Required Local Classroom Write Intents

The local/closed deployment path should support:

- local media bundle manifests,
- local progress export packages,
- local package publish gates,
- local package approval ledgers.

Local approval records need backup, restore, export, approver identity, timestamp, and policy rules before a closed deployment captures real sign-offs.

## Current UI Surface

The current scaffold renders at:

- `http://127.0.0.1:3000/teacher/intake`

It shows:

- static demo adapter,
- hosted pilot adapter,
- local classroom adapter,
- write intents,
- readiness warnings,
- safety validation,
- handoff steps.

## Current Non-Goals

- No production backend is selected.
- No real student progress is stored.
- No live route registry mutation exists.
- No real package approval signature is stored.
- No local installer, sync, backup, or restore workflow exists yet.
- No report or approval export is generated.
- No raw audio or transcript storage is enabled.

## Future Work

1. Choose a first pilot backend only after privacy, reporting, release-control, and deployment constraints are accepted.
2. Map hosted adapter write intents into migrations or table designs.
3. Map local adapter write intents into local storage, backup, and export designs.
4. Keep hosted and local paths compatible through this shared contract.
5. Promote only verified adapter implementations into production code.
