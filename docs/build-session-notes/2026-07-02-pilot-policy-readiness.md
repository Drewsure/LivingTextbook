# Build Session Note: Pilot Policy Readiness

Date: 2026-07-02

## What Changed

Added a pilot policy readiness contract and surfaced it on `/teacher/intake`.

Files added or updated:

- `packages/content-model/src/pilotPolicy.ts`
- `apps/web/src/data/samplePilotPolicyPlan.ts`
- `apps/web/src/features/policy/PilotPolicyReadinessPanel.tsx`
- `apps/web/src/app/teacher/intake/page.tsx`
- `docs/PILOT_POLICY_CONTRACT.md`
- `docs/adr/0031-pilot-policy-readiness.md`
- `docs/decision-register/DR-032-pilot-policy-readiness.md`
- `docs/verification/PILOT_POLICY_CHECKS.md`

## Product Reason

Before the platform stores student progress, exports teacher reports, supports closed local deployments, or enables premium AI/speech features, it needs visible school/tenant policy gates.

## Current State

The teacher/admin intake route now shows policy readiness for:

- student progress retention,
- teacher report export,
- raw learner audio storage,
- learner transcript storage,
- media rights and bundles,
- local deployment backup/update rules,
- AI Tutor premium policy.

Raw audio and transcript storage remain disabled by default in the core pilot policy.

## Verification

After pulling latest:

```powershell
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
```

Then verify:

- `http://127.0.0.1:3000/teacher/intake`

Use `docs/verification/PILOT_POLICY_CHECKS.md`.
