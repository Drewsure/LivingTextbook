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
8. Confirm hosted write intents include route registry, upload intake, teacher draft packages, teacher draft review handoff packets, teacher draft verifier submission preflights, teacher draft reviewer decisions, teacher draft review evidence packets, teacher draft review audit trails, teacher launch-session settings, progress/media events, package game/audio coverage snapshots, package release candidate status, package publish gates, and package approval ledgers.
9. Confirm local write intents include local media bundle manifests, local upload intake, local teacher draft packages, local teacher draft review handoff packets, local teacher draft verifier submission preflights, local teacher draft reviewer decisions, local teacher draft review evidence packets, local teacher draft review audit trails, local package game/audio coverage snapshots, local progress export packages, local package release candidate status, local package publish gates, and local package approval ledgers.
10. Confirm package game/audio coverage write intents preserve reviewed game/audio coverage snapshots.
11. Confirm progress-event write intents preserve event effect taxonomy.
12. Confirm progress-event write intents require a passed event acceptance gate.
13. Confirm student-data write intents require school or tenant policy.
14. Confirm teacher draft review handoff write intents preserve packet sections and block live review submission until verifier and approval workflow exists.
15. Confirm teacher draft verifier submission write intents preserve preflight checks and block automatic verifier submission until workflow, identity, evidence, and approval policy exist.
16. Confirm upload intake write intents preserve source lineage and block student-facing uploaded file use until file policy, rights, review, route mapping, audio coverage, and release gates pass.
17. Confirm teacher draft reviewer decision write intents preserve evidence requirements and block state changes until reviewer identity, evidence storage, verifier workflow, and approval policy exist.
18. Confirm teacher draft review evidence write intents preserve evidence packets and block uploads until reviewer identity, storage, retention, rights, and approval policy exist.
19. Confirm teacher draft review audit trail write intents preserve audit events and block audit-driven package state changes until identity, evidence, approval ledger, and release-control policy exist.
20. Confirm package approval ledger write intents require policy before real signatures are stored.
21. Confirm reviewer identity and signature gate write intents preserve identity/signature policy and block approval capture, signature attachment upload, and approval-driven assignment.
22. Confirm school launch policy gate write intents preserve school/publisher/platform/shared ownership while blocking policy acceptance workflows, launch without school policy, learner data, and report export.
23. Confirm package release candidate and package publish gate write intents are required before pilot release.
24. Confirm core write intents reject raw learner audio.
25. Confirm core write intents reject learner transcripts.
26. Confirm export-capable intents are policy gated.
27. Confirm local-classroom intents show offline support.
28. Confirm local-classroom handoff steps mention backup/restore and release-control export or restore.
29. Confirm hosted handoff steps mention migration/table mapping and release-gate validation before publish status changes.
30. Confirm handoff steps are visible for each adapter plan.
31. Confirm the shared contract exists at `packages/content-model/src/persistenceAdapter.ts`.
32. Confirm the sample data exists at `apps/web/src/data/samplePersistenceAdapterPlan.ts`.
33. Confirm the UI panel exists at `apps/web/src/features/persistence/PersistenceAdapterReadinessPanel.tsx`.
34. Confirm typecheck passes after pulling latest.
35. Confirm production build passes after pulling latest.

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
