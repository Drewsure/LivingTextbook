# DR-918: Package Readiness Backend Mapping

## Decision

Map package-readiness persistence into a provider-neutral schema entity,
migration candidate, and migration specification before any hosted or local
storage provider is selected.

## Included

- `package_readiness_reconciliation`
- `m106-package-readiness-reconciliation-records`
- `spec-package-readiness-reconciliation`
- Tenant, package, release-candidate, and reconciliation-revision scope.
- Seven evidence-lane references and explicit progression authority.
- Shared hosted/local metadata parity.

## Excluded

Provider credentials, migration execution, storage writes, package promotion,
route/playlist/assignment writes, local bundle writes, student activation, raw
learner audio, transcripts, and student data.

See ADR 0846 and
`docs/verification/PACKAGE_READINESS_BACKEND_MAPPING_CHECKS.md`.
