# DR-939: Local Recovery Evidence Reconciliation

## Decision

Reconcile provider approval and local recovery evidence through a single
provider-neutral, review-only boundary.

## Required Invariants

- Tenant, bundle, and package identity match exactly.
- Open evidence is classified as `needs-evidence`, not approval.
- Identity or validation drift is classified as `mismatch`.
- All unresolved checks, lanes, and blocked actions remain visible.
- `executionAllowed` is false and `sideEffect` is `none`.

## Evidence

- `packages/content-model/src/localBundleRecoveryReconciliation.ts`
- `apps/web/src/data/sampleLocalBundleRecoveryReconciliation.ts`
- `apps/web/src/features/persistence/LocalBundleRecoveryReconciliationPanel.tsx`
- `scripts/verify-local-bundle-recovery-reconciliation.mjs`
