# DR-949: Release-Control Evidence In The Safe-Fallback Chain

## Decision

Carry the exact shared release-control evidence from rollback impact review
through safe-fallback planning, fallback preflight, activation preview, and
restoration preview.

## Required Invariants

- Binding id, release gate, tenant, package version, decision, blockers, and
  approvals remain unchanged across every fallback artifact.
- Fallback and restoration evidence cannot authorize QR changes, notifications,
  media replacement, local deactivation, learner-data operations,
  assignments, classroom shutdown, or release mutation.
- Missing or stale inherited evidence is a contract failure, not a local
  fallback.
- Target-language progression and support-language boundaries remain intact in
  all child-facing pause or restoration copy.

## Evidence

- `apps/web/src/data/sampleSchoolRollbackSafeFallbackPlan.ts`
- `apps/web/src/data/sampleSchoolRollbackSafeFallbackPreflight.ts`
- `apps/web/src/data/sampleSchoolRollbackSafeFallbackActivationPreview.ts`
- `apps/web/src/data/sampleSchoolRollbackSafeFallbackRestorationPreview.ts`
- `scripts/verify-release-control-readiness.mjs`
