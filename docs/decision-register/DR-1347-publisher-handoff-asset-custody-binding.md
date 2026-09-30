# DR-1347: Publisher Handoff Asset Custody Binding

## Decision

The verified local-package handoff must expose and validate the assembly's
approved asset source scope and copied-asset count. Package-scoped promotion
is the intended saleable-pilot path; legacy flat-root assembly remains named
compatibility evidence only.

## Boundaries

The receipt remains metadata-only. It cannot expose raw publisher bytes,
learner records, credentials, QR mutation, hosted activation, or student
writes.

## Evidence

- `packages/content-model/src/localPilotPackageHandoff.ts`
- `apps/web/src/server/delivery/localPilotPackageRuntimeReader.ts`
- `scripts/verify-local-pilot-package-assembler-behavior.mjs`
- ADR 1348
