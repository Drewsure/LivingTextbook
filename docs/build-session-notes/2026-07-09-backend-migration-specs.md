# Build Session Note: Backend Migration Specs

Date: 2026-07-09

## Summary

Added a backend migration specification scaffold that turns migration candidates into vendor-neutral collection/table templates.

## Added

- `apps/web/src/data/sampleBackendMigrationSpecs.ts`
- `apps/web/src/features/persistence/BackendMigrationSpecPanel.tsx`
- `docs/BACKEND_MIGRATION_SPEC_CONTRACT.md`
- `docs/verification/BACKEND_MIGRATION_SPEC_CHECKS.md`
- `docs/decision-register/DR-050-backend-migration-specs.md`
- `docs/adr/0050-backend-migration-specs.md`

## Product Rule

Do not write backend-specific migrations until the specs, privacy policy, deployment profile, retention/export rules, and first pilot backend choice are accepted.
