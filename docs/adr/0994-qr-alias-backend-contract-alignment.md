# ADR 0994: QR Alias Backend Contract Alignment

## Decision

Keep the future `route_alias` backend record aligned with the shared QR alias
runtime contract across the schema draft, migration candidate, and migration
spec before provider selection or migration execution.

## Why

Printed QR identity and release lineage are safety-critical. If one planning
layer omits fallback or rollback fields, a later backend implementation can
appear complete while losing the ability to recover safely or prove tenant
isolation.

## Boundary

The alignment verifier is planning evidence only. It cannot select a provider,
write a database, mutate routes or redirects, swap packages, activate local
bundles, or execute rollback.

## Evidence

- `apps/web/src/data/sampleBackendSchemaDraft.ts`
- `apps/web/src/data/sampleBackendMigrationCandidates.ts`
- `apps/web/src/data/sampleBackendMigrationSpecs.ts`
- `scripts/verify-qr-alias-backend-alignment.mjs`
- `docs/verification/QR_ALIAS_BACKEND_ALIGNMENT_CHECKS.md`
