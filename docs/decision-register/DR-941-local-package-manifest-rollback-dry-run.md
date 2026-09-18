# DR-941: Local Package Manifest And Rollback Dry-Run

## Decision

Use one tenant-scoped package manifest and rollback dry-run before local bundle
activation or provider implementation.

## Required Invariants

- Content, media, route, game, and reporting artifact classes are present.
- Paths are safe relative paths; direct files and traversal are rejected.
- Current/fallback versions, checksum state, stable QR fallback, and six
  rollback impact domains are visible.
- Activation, mutation, replacement, deletion, and rollback execution remain
  blocked with no side effect.

## Evidence

- `packages/content-model/src/localBundlePackageManifestRollbackDryRun.ts`
- `apps/web/src/data/sampleLocalBundlePackageManifestRollbackDryRun.ts`
- `apps/web/src/features/persistence/LocalBundlePackageManifestRollbackDryRunPanel.tsx`
- `scripts/verify-local-bundle-package-manifest-rollback-dry-run.mjs`
