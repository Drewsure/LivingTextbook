# Persistence Adapter Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-09

## Purpose

Verify that the teacher/admin intake route shows a backend-agnostic storage handoff map before any production backend, local store, or vendor is chosen.

## Route

Verify at:

- `http://127.0.0.1:3000/teacher/intake`

## Required Checks

1. Confirm the page renders a `Persistence adapter readiness` section.
2. Confirm the section says storage remains replaceable and no vendor is chosen.
3. Confirm the adapter map safety contract passes.
4. Confirm the scaffold warns that static demo data cannot support real reports or QR registry changes.
5. Confirm the page shows a `Static demo adapter` plan.
6. Confirm the page shows a `Hosted pilot adapter` plan marked as the first pilot fit.
7. Confirm the page shows a `Local classroom adapter` plan for closed deployments.
8. Confirm hosted write intents include route registry, teacher launch-session settings, progress/media events, package game/audio coverage snapshots, package publish gates, and package approval ledgers.
9. Confirm local write intents include local media bundle manifests, local package game/audio coverage snapshots, local progress export packages, local package publish gates, and local package approval ledgers.
10. Confirm student-data write intents require school or tenant policy.
11. Confirm package approval ledger write intents require policy before real signatures are stored.
12. Confirm package publish gate write intents are required before pilot release.
13. Confirm core write intents reject raw learner audio.
14. Confirm core write intents reject learner transcripts.
15. Confirm export-capable intents are policy gated.
16. Confirm local-classroom intents show offline support.
17. Confirm local-classroom handoff steps mention backup/restore and release-control export or restore.
18. Confirm hosted handoff steps mention migration/table mapping and release-gate validation before publish status changes.
19. Confirm handoff steps are visible for each adapter plan.
20. Confirm the shared contract exists at `packages/content-model/src/persistenceAdapter.ts`.
21. Confirm the sample data exists at `apps/web/src/data/samplePersistenceAdapterPlan.ts`.
22. Confirm the UI panel exists at `apps/web/src/features/persistence/PersistenceAdapterReadinessPanel.tsx`.
23. Confirm typecheck passes after pulling latest.
24. Confirm production build passes after pulling latest.

## Expected Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Acceptance Standard

A future engineer should understand what hosted or local storage must support before pilot implementation starts, without being pushed into a specific backend vendor.

The adapter map must include release-control writes as first-class pilot requirements, not later admin decoration.

## Non-Goals

- This scaffold does not choose Supabase, Firebase, SQLite, Postgres, or any other backend.
- This scaffold does not write real student data.
- This scaffold does not implement package approval signatures.
- This scaffold does not implement offline sync, backup, restore, or report export.
