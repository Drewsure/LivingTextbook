# Persistence Boundary Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-01

## Purpose

Verify that the platform distinguishes demo-local state from records that must become durable before a real classroom or partner pilot. This keeps the build cost-efficient while preventing the product from pretending static sample data is production reporting.

## Routes

Verify at:

- `http://127.0.0.1:3000/teacher/intake`

## Required Checks

1. Confirm the teacher/admin intake route renders a `Persistence boundary` section.
2. Confirm the section states that the current app can prove flow with static sample data and local state.
3. Confirm the section names records that must become durable before pilot work:
   - tenant configuration,
   - reviewed content packages,
   - front-door/permanent QR registry,
   - teacher launch sessions,
   - progress/media event stream,
   - media manifest and rights records,
   - deployment profile records.
4. Confirm the progress/media event stream is marked as requiring policy, not only backend storage.
5. Confirm teacher launch sessions mention teacher toggles and microphone approval as future persisted session records.
6. Confirm media manifest records mention rights status and local bundle paths.
7. Confirm backend strategy options show static demo data, hosted managed database, and local-first classroom store.
8. Confirm hosted managed database is marked as the likely first pilot fit.
9. Confirm local-first storage remains visible for closed/local companion deployments.
10. Confirm the page renders a `Durable record map` section.
11. Confirm the durable record map includes teacher launch session and settings as a launch-session record.
12. Confirm the durable record map includes progress/media event stream and report export/retention policy records.
13. Confirm the durable record map states that raw learner audio and transcripts are not stored in the core persistence scaffold.
14. Confirm student-data records require school policy before pilot use.
15. Confirm media-rights records include hosted object storage or local bundle manifest decisions.
16. Confirm the route contract for `/teacher/intake` includes `PersistenceBoundary[]`, `PersistenceStrategyOption[]`, `DurableRecordContract[]`, `durableRecordErrors[]`, and `durableRecordWarnings[]`.

## Acceptance Standard

A reviewer should be able to see which parts of the app are currently safe as static/demo data and which parts require persistence, privacy, retention, export, and deployment decisions before real student use.

The durable record map should make backend selection easier, not premature. It should define records and safety boundaries without choosing Supabase, Firebase, SQLite, Postgres, or any other vendor yet.

## Non-Goals

- This scaffold does not choose Supabase, Firebase, SQLite, Postgres, or any other backend.
- This scaffold does not store real student progress.
- This scaffold does not activate authentication, billing, or AI Tutor usage tracking.
- This scaffold does not store raw learner audio or learner transcripts.
