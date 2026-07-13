# Persistence Boundary Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-09

## Purpose

Verify that the platform distinguishes demo-local state from records that must become durable before a real classroom or partner pilot. This keeps the build cost-efficient while preventing the product from pretending static sample data is production reporting or production release approval.

## Routes

Verify at:

- `http://127.0.0.1:3000/teacher/intake`

## Required Checks

1. Confirm the teacher/admin intake route renders a `Persistence boundary` section.
2. Confirm the section states that the current app can prove flow with static sample data and local state.
3. Confirm the section names records that must become durable before pilot work:
   - tenant configuration,
   - reviewed content packages,
   - teacher draft packages,
   - teacher draft review handoff packets,
   - front-door/permanent QR registry,
   - teacher launch sessions,
   - progress/media event stream,
   - media manifest and rights records,
   - deployment profile records,
   - package release candidate records,
   - package publish gate records,
   - package approval ledger records.
4. Confirm the progress/media event stream is marked as requiring policy, not only backend storage.
5. Confirm teacher launch sessions mention teacher toggles and microphone approval as future persisted session records.
6. Confirm media manifest records mention rights status and local bundle paths.
7. Confirm package publish gates mention release-blocking gates, owners, evidence, and next steps.
8. Confirm package approval ledgers mention sign-off owner, approver identity, timestamp, evidence links, blockers, and release candidate.
9. Confirm backend strategy options show static demo data, hosted managed database, and local-first classroom store.
10. Confirm hosted managed database is marked as the likely first pilot fit.
11. Confirm local-first storage remains visible for closed/local companion deployments.
12. Confirm the page renders a `Durable record map` section.
13. Confirm the durable record map includes teacher launch session and settings as a launch-session record.
14. Confirm the durable record map includes progress/media event stream and report export/retention policy records.
15. Confirm the durable record map includes package release candidate, package publish gate, and package approval ledger records.
16. Confirm the durable record map states that raw learner audio and transcripts are not stored in the core persistence scaffold.
17. Confirm student-data records require school policy before pilot use.
18. Confirm media-rights records include hosted object storage or local bundle manifest decisions.
19. Confirm progress-event durable records preserve event effect taxonomy and require a passed event acceptance gate.
20. Confirm teacher draft review handoff records preserve packet sections and block live review submission.
21. Confirm teacher report package durable records preserve event acceptance summaries.
22. Confirm package approval ledgers remain policy-required before real signatures are stored.
23. Confirm the page renders a `Persistence adapter readiness` section.
24. Confirm the adapter readiness section shows static demo, hosted pilot, and local classroom adapter plans.
25. Confirm hosted pilot is marked as the recommended first pilot path.
26. Confirm local classroom remains visible for closed/offline companion deployments.
27. Confirm adapter write intents reject raw learner audio and learner transcripts.
28. Confirm export-capable adapter intents remain policy gated.
29. Confirm package release candidate records distinguish demo-visible from pilot-ready state.
30. Confirm the route contract for `/teacher/intake` includes `PersistenceBoundary[]`, `PersistenceStrategyOption[]`, `DurableRecordContract[]`, `PersistenceAdapterPlan[]`, validation errors, and readiness warnings.

## Acceptance Standard

A reviewer should be able to see which parts of the app are currently safe as static/demo data and which parts require persistence, privacy, retention, export, release approval, and deployment decisions before real student use.

The durable record map and adapter readiness map should make backend selection easier, not premature. They should define records, write intents, approval ledgers, release gates, and safety boundaries without choosing Supabase, Firebase, SQLite, Postgres, or any other vendor yet.

## Non-Goals

- This scaffold does not choose Supabase, Firebase, SQLite, Postgres, or any other backend.
- This scaffold does not store real student progress.
- This scaffold does not capture real package approvals.
- This scaffold does not activate authentication, billing, or AI Tutor usage tracking.
- This scaffold does not store raw learner audio or learner transcripts.
- This scaffold does not implement offline sync, backup, restore, or live report export.

Use `docs/verification/PERSISTENCE_ADAPTER_CHECKS.md` for the focused adapter checklist.
