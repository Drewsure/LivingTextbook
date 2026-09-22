# DR-1066: QR Alias Backend Contract Alignment

Decision: require the route-alias schema draft, migration candidate, and
migration spec to carry the same printed identity, release lineage, fallback,
rollback, and learner-data exclusion fields as the shared QR runtime contract.

Required invariants:

- Printed QR identity, current and previous release identity, target/fallback,
  rollback evidence, and mutation-block fields are preserved across all three
  planning layers.
- Migration prerequisites include acceptance of the QR rollback contract and
  release lineage.
- Route-alias storage must never contain raw learner audio or transcripts.
- Alignment evidence does not authorize database migrations, route writes, QR
  redirects, package swaps, local activation, or rollback execution.

Evidence: `apps/web/src/data/sampleBackendSchemaDraft.ts`,
`apps/web/src/data/sampleBackendMigrationCandidates.ts`,
`apps/web/src/data/sampleBackendMigrationSpecs.ts`,
`scripts/verify-qr-alias-backend-alignment.mjs`, and
`docs/adr/0994-qr-alias-backend-contract-alignment.md`.
