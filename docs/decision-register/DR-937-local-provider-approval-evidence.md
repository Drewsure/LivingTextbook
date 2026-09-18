# DR-937: Local Provider Approval Evidence

## Decision

Use a review-only evidence packet before selecting or activating a local or
hosted handoff provider.

## Required Evidence

- Tenant isolation and cross-tenant rejection
- Retention and deletion policy
- Export policy and learner-data boundary
- Backup manifest and checksum
- Restore rehearsal and rollback
- Child-safe local fallback and printed QR behavior
- Raw learner audio/transcript exclusion

## Required Blocks

Provider activation, package writes, student promotion, and learner-data export
remain blocked until the evidence is accepted by the appropriate school,
publisher, and platform review process.

## Evidence

- `packages/content-model/src/localBundleProviderApproval.ts`
- `apps/web/src/data/sampleLocalBundleProviderApproval.ts`
- `apps/web/src/features/persistence/LocalBundleProviderApprovalPanel.tsx`
- `scripts/verify-local-bundle-provider-approval.mjs`
