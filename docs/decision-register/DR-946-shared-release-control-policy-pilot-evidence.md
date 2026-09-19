# DR-946: Shared Release-Control Policy And Pilot Evidence

## Decision

Use one derived release-control evidence contract in both the school-policy
acceptance preflight and the controlled-pilot handoff package.

## Required Invariants

- The binding id, release gate, tenant, package version, decision, blockers,
  approvals, and blocked actions must remain traceable in both surfaces.
- Promotion, student-facing use, local activation, and side effects remain
  false or absent; this is evidence, not permission.
- Missing or malformed evidence invalidates a pilot handoff rather than being
  silently replaced by a panel-local summary.
- School policy acceptance, live launch, assignments, learner data, reports,
  uploads, and release-state mutation remain blocked.

## Evidence

- `packages/content-model/src/releaseControlEvidence.ts`
- `apps/web/src/data/sampleSchoolPolicyAcceptancePreflight.ts`
- `apps/web/src/data/samplePilotHandoffPackage.ts`
- `scripts/verify-release-control-readiness.mjs`
