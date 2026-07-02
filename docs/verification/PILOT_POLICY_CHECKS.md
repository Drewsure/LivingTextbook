# Pilot Policy Verification Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-02

## Purpose

Verify that the teacher/admin intake route shows policy gates before real student data, report export, local deployment, raw audio, transcripts, or premium AI Tutor features are enabled.

## Route

Verify at:

- `http://127.0.0.1:3000/teacher/intake`

## Required Checks

1. Confirm the page renders a `Pilot policy readiness` section.
2. Confirm policy is described as separate from backend choice.
3. Confirm student progress retention is marked as needed before pilot use.
4. Confirm teacher report export policy is marked as needed before export.
5. Confirm raw learner audio storage is not applicable to the core pilot.
6. Confirm learner transcript storage is premium-only, not core.
7. Confirm media rights and bundle policy is listed.
8. Confirm local deployment backup and update policy is listed.
9. Confirm AI Tutor policy is premium-only.
10. Confirm current blockers mention student progress storage, teacher report export, and local deployment where applicable.
11. Confirm the policy safety section says core policy does not accept raw learner audio or transcript storage by default.
12. Confirm the shared contract exists at `packages/content-model/src/pilotPolicy.ts`.
13. Confirm the sample data exists at `apps/web/src/data/samplePilotPolicyPlan.ts`.
14. Confirm the UI panel exists at `apps/web/src/features/policy/PilotPolicyReadinessPanel.tsx`.
15. Confirm typecheck passes after pulling latest.
16. Confirm production build passes after pulling latest.

## Expected Commands

```powershell
cd "D:\LIVING TEXTBOOOK PROJECT\LivingTextbook"
git pull --ff-only
npm run typecheck --workspace @living-textbook/web
npm run build --workspace @living-textbook/web
npm run dev --workspace @living-textbook/web -- --hostname 127.0.0.1 --port 3000
```

## Acceptance Standard

A future pilot cannot activate student-data writes, report export, local storage, raw audio, transcript storage, or premium AI Tutor without the relevant policy gate being visible and accepted.
