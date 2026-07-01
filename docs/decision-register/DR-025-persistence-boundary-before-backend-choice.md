# DR-025: Persistence Boundary Before Backend Choice

Date: 2026-07-01  
Status: Accepted  
Related ADR: `docs/adr/0024-persistence-boundary-before-backend-choice.md`

## Decision

The project will define persistence boundaries before selecting a production backend. Static sample data and local state remain acceptable for the current scaffold, but route registry, launch sessions, content packages, progress/media events, media manifests, and deployment profile records must become durable before real pilots.

## Rationale

This keeps the platform cost-efficient and white-label flexible. A hosted managed database is likely the fastest first pilot path, but closed/local deployments must remain possible for textbook partners who need local media packages and controlled distribution.

## Implementation Notes

- Added `samplePersistenceBoundaries` and `samplePersistenceStrategyOptions`.
- Added `PersistenceBoundaryPanel`.
- Wired the persistence review panel into `http://127.0.0.1:3000/teacher/intake`.
- Updated `/teacher/intake` route contract to include `PersistenceBoundary[]` and `PersistenceStrategyOption[]`.
- Added focused verification in `docs/verification/PERSISTENCE_BOUNDARY_CHECKS.md`.

## Follow-Up

- Choose the first pilot backend only after route, session, progress, media, and reporting requirements are verified.
- Define privacy, retention, export, and access-control rules for student progress data.
- Move teacher microphone approval and other classroom toggles into persisted launch/session settings before classroom testing.
- Preserve a local-first storage path for closed textbook companion deployments.
