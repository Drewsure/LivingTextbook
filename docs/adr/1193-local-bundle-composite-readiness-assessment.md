# ADR 1193: Local Bundle Composite Readiness Assessment

## Status

Accepted

## Context

The closed local companion path now has separate contracts for manifest
validation, tenant-scoped read-only resolution, media evidence, review
handoff, persistence admission, deployment preflight, and release control.
Those contracts are useful individually, but an exporter or partner review
could still receive inconsistent conclusions if each surface derives its own
readiness decision.

## Decision

Add one shared `assessLocalBundleReadiness` contract that reconciles all of
those inputs into a single review-only decision:

- `blocked` when any identity, resolver, asset, persistence, deployment, or
  release blocker remains;
- `review-ready` when the reviewed evidence is internally consistent but the
  manifest is not an offline-ready candidate;
- `offline-ready-candidate` only when the final manifest says offline-ready and
  all evidence gates pass.

The assessment always keeps export, offline activation, and student-facing
promotion disabled. It is an evidence decision, not an installer or backend
activation API.

## Consequences

- Local companion review has one auditable admission result.
- Tenant and bundle identity drift fails closed before a package can appear
  ready.
- Route readiness is based on actual read-only resolver results, not merely a
  non-empty route list.
- The same result can drive the preview panel, future exporter preflight, and
  local/hosted handoff records.
- A future production exporter must still add signed package, checksum,
  installer, backup, restore, policy, and activation controls.

## Evidence

- `packages/content-model/src/localBundleReadinessAssessment.ts`
- `apps/web/src/data/localBundleReadinessAssessment.ts`
- `apps/web/src/features/deployment/LocalBundleReadinessAssessmentPanel.tsx`
- `scripts/verify-local-bundle-readiness-assessment.mjs`
- `npm run verify:local-bundle`
