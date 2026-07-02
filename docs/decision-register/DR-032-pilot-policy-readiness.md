# DR-032: Pilot Policy Readiness

Status: Accepted  
Date: 2026-07-02

## Decision

Define pilot policy readiness before enabling real student-data storage, teacher report export, local deployment storage, raw audio storage, transcript storage, or premium AI Tutor features.

## White-Label Impact

Strongly positive. Different schools, publishers, and local deployments can adopt different policy requirements without changing the core platform.

## Cost Impact

Positive. Policy gates avoid expensive rework and support issues caused by storing data before access, retention, export, and deletion rules are known.

## Constraints

- Policy is separate from backend choice.
- Student progress storage requires accepted policy.
- Teacher report export requires accepted policy.
- Core policy does not accept raw learner audio storage.
- Core policy does not accept learner transcript storage.
- AI Tutor and speech scoring remain premium-only and require separate policy.
- Local deployment requires backup, restore, update, export, and device ownership policy.

## Verification

Use `docs/verification/PILOT_POLICY_CHECKS.md` and verify:

- `http://127.0.0.1:3000/teacher/intake`

## Related Files

- `packages/content-model/src/pilotPolicy.ts`
- `apps/web/src/data/samplePilotPolicyPlan.ts`
- `apps/web/src/features/policy/PilotPolicyReadinessPanel.tsx`
- `docs/adr/0031-pilot-policy-readiness.md`
