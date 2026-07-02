# Build Session Note: Persistence Adapter Readiness

Date: 2026-07-02

## What Changed

Added a backend-agnostic persistence adapter readiness contract and surfaced it on `/teacher/intake`.

Files added or updated:

- `packages/content-model/src/persistenceAdapter.ts`
- `packages/content-model/src/index.ts`
- `apps/web/src/data/samplePersistenceAdapterPlan.ts`
- `apps/web/src/features/persistence/PersistenceAdapterReadinessPanel.tsx`
- `apps/web/src/app/teacher/intake/page.tsx`
- `docs/PERSISTENCE_ADAPTER_CONTRACT.md`
- `docs/adr/0030-persistence-adapter-readiness.md`
- `docs/decision-register/DR-031-persistence-adapter-readiness.md`
- `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md`
- `docs/verification/PERSISTENCE_BOUNDARY_CHECKS.md`

## Product Reason

The platform needs to move toward real pilots without choosing a backend too early. The adapter contract names what hosted and local storage must support while keeping vendor choice, cost, and local deployment options open.

## Current State

The teacher/admin intake route now shows:

- static demo adapter,
- hosted pilot adapter,
- local classroom adapter,
- write intents,
- store paths,
- deployment channels,
- offline capability,
- export behavior,
- safety validation,
- readiness warnings,
- handoff steps.

Core adapter rules reject raw learner audio and learner transcripts. Student-data writes require school or tenant policy.

## Verification

After pulling latest:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake`

Use `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md`.
