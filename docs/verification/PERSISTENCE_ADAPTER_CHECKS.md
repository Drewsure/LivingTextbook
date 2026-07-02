# Persistence Adapter Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-02

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
8. Confirm hosted write intents include route registry, teacher launch-session settings, and progress/media events.
9. Confirm local write intents include local media bundle manifests and local progress export packages.
10. Confirm student-data write intents require school or tenant policy.
11. Confirm core write intents reject raw learner audio.
12. Confirm core write intents reject learner transcripts.
13. Confirm export-capable intents are policy gated.
14. Confirm local-classroom intents show offline support.
15. Confirm handoff steps are visible for each adapter plan.
16. Confirm the shared contract exists at `packages/content-model/src/persistenceAdapter.ts`.
17. Confirm the sample data exists at `apps/web/src/data/samplePersistenceAdapterPlan.ts`.
18. Confirm the UI panel exists at `apps/web/src/features/persistence/PersistenceAdapterReadinessPanel.tsx`.
19. Confirm typecheck passes after pulling latest.
20. Confirm production build passes after pulling latest.

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

## Non-Goals

- This scaffold does not choose Supabase, Firebase, SQLite, Postgres, or any other backend.
- This scaffold does not write real student data.
- This scaffold does not implement offline sync, backup, restore, or report export.
