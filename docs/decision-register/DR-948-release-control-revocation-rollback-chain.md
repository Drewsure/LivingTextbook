# DR-948: Release-Control Evidence In The Revocation And Rollback Chain

## Decision

Carry the exact shared release-control evidence from the acceptance-record
preview through the revocation/rollback plan into the rollback impact matrix.

## Required Invariants

- Binding id, release gate, tenant, package version, decision, blockers, and
  approvals remain unchanged across the chain.
- Rollback evidence cannot authorize revocation, release mutation, QR changes,
  learner-data deletion, media replacement, local deactivation, or premium
  entitlement changes.
- Stale or missing inherited evidence is a contract failure, not a local
  fallback.
- Safe fallback planning remains separate from live route or package changes.

## Evidence

- `apps/web/src/data/sampleSchoolPolicyRevocationRollbackPlan.ts`
- `apps/web/src/data/sampleSchoolPolicyRollbackImpactMatrix.ts`
- `apps/web/src/features/pilot/SchoolPolicyRevocationRollbackPanel.tsx`
- `scripts/verify-release-control-readiness.mjs`
