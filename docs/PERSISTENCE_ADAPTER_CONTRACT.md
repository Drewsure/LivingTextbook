# Persistence Adapter Contract

Document type: foundation data contract  
Status: active scaffold  
Last updated: 2026-07-02

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

Used for source-controlled reviewed sample data. It is useful for design and sales demos, but it cannot support real teacher reports, route registry changes, partner self-maintenance, or student progress storage.

### Hosted Pilot Adapter

The recommended first pilot path. It should support durable route registry writes, teacher launch-session settings, and progress/media event writes after privacy and policy are accepted.

### Local Classroom Adapter

A future closed deployment path for schools or textbook partners who require a local classroom server or packaged local app. It must support local media bundles, local progress export packages, backup/restore, and year-on-year content updates.

## Core Safety Rules

Every core adapter plan must:

- reject raw learner audio,
- reject learner transcripts,
- require school or tenant policy for student-data writes,
- keep report export policy-gated,
- identify whether it can run offline,
- name the deployment channels it supports,
- keep media/object storage concerns separate from student progress records.

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
- No local installer, sync, backup, or restore workflow exists yet.
- No report export is generated.
- No raw audio or transcript storage is enabled.

## Future Work

1. Choose a first pilot backend only after privacy, reporting, and deployment constraints are accepted.
2. Map hosted adapter write intents into migrations or table designs.
3. Map local adapter write intents into local storage, backup, and export designs.
4. Keep hosted and local paths compatible through this shared contract.
5. Promote only verified adapter implementations into production code.
