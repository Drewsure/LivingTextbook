# Build Session Note: Backend Migration Candidates

Date: 2026-07-09

## Session Fit

This belongs to Sessions 3, 6, and 7 because it turns the vendor-neutral backend schema into ordered implementation candidates without selecting a vendor or writing production migrations.

It is foundation work. It does not choose a backend, create migrations, store real student data, or add premium polish.

## Added

- Backend migration candidate sample data.
- Backend migration plan panel on `/teacher/intake`.
- Contract documentation.
- Focused verification checklist.
- ADR and decision-register entry.

## Product Rule Reinforced

Migration sequence matters. Administrative and release-control records can be designed before student progress storage, while event streams, reports, exports, and local classroom storage remain gated by policy and deployment decisions.

## Local Verification

Pull latest `legacy-source-import`, run typecheck/build, then verify:

- `http://127.0.0.1:3000/teacher/intake`

Use:

- `docs/verification/BACKEND_MIGRATION_CANDIDATES_CHECKS.md`
