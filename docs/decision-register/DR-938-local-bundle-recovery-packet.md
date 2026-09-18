# DR-938: Local Bundle Recovery Packet

## Decision

Use a provider-neutral, review-only recovery packet beneath provider approval
evidence for local white-label packages.

## Required Evidence

- SHA-256 backup manifest and schema reference
- Raw learner audio and transcript exclusion
- Restore source, rehearsal, rollback, and cross-tenant block
- Export policy with learner-data, raw-media, and credential exclusion
- Retention policy, scope, and deletion gate

## Required Blocks

Backup, restore, and export execution, package writes, student promotion, and
route mutation remain blocked until later provider and operational approval.

## Evidence

- `packages/content-model/src/localBundleRecoveryPacket.ts`
- `apps/web/src/data/sampleLocalBundleRecoveryPacket.ts`
- `apps/web/src/features/persistence/LocalBundleRecoveryPacketPanel.tsx`
- `scripts/verify-local-bundle-recovery-packet.mjs`
