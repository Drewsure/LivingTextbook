# DR-940: Local Export And Retention Dry-Run

## Decision

Use a provider-neutral dry-run classification before any local package
exporter, file copier, or retention deletion worker is designed.

## Required Invariants

- Reviewed content, route, game, and media manifests are metadata references.
- Learner progress is policy-required.
- Raw learner audio, transcripts, and credentials are excluded.
- Retention is tenant-package-session scoped and deletion remains blocked.
- `sideEffect` is `none`; execution and mutation flags remain false.

## Evidence

- `packages/content-model/src/localBundleExportRetentionDryRun.ts`
- `apps/web/src/data/sampleLocalBundleExportRetentionDryRun.ts`
- `apps/web/src/features/persistence/LocalBundleExportRetentionDryRunPanel.tsx`
- `scripts/verify-local-bundle-export-retention-dry-run.mjs`
