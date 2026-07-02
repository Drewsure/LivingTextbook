# Pilot Policy Contract

Document type: foundation policy contract  
Status: active scaffold  
Last updated: 2026-07-02

## Purpose

The pilot policy contract defines which school or tenant policy decisions must be accepted before Living Textbook stores real student progress, exports teacher reports, uses local classroom storage, or enables premium AI/speech features.

Policy is intentionally separate from backend choice. A database can store data only after the policy allows that data to exist.

## Shared Contract

The shared contract lives in:

- `packages/content-model/src/pilotPolicy.ts`

It defines:

- `PilotPolicyPlan`
- `PilotPolicyRequirement`
- `PilotPolicyRequirementCategory`
- `PilotPolicyRequirementStatus`
- `PilotPolicyReadiness`
- `validatePilotPolicyPlan`
- `getPilotPolicyWarnings`

## Current UI Surface

The current scaffold renders at:

- `http://127.0.0.1:3000/teacher/intake`

It shows policy requirements for:

- student progress retention,
- teacher report export,
- raw learner audio storage,
- learner transcript storage,
- media rights and bundles,
- local deployment backup/update rules,
- optional AI Tutor premium policy.

## Core Rules

- Student progress storage requires school or tenant policy.
- Teacher report export requires school or tenant policy.
- Core pilot policy does not accept raw learner audio storage.
- Core pilot policy does not accept learner transcript storage.
- AI Tutor and speech scoring remain premium-only and require separate policy.
- Local classroom deployment requires backup, restore, update, export, and device ownership policy.

## Current Non-Goals

- No legal template is generated.
- No production privacy policy is accepted.
- No live student data is stored.
- No report export is generated.
- No raw audio, transcript, AI Tutor, or speech-scoring policy is active.

## Future Work

1. Convert accepted tenant/school policies into durable policy records.
2. Connect policy records to launch-session settings and report export readiness.
3. Require policy acceptance before any production student-data write path.
4. Add local deployment backup/export policy before closed classroom installs.
5. Keep policy requirements tenant-configurable for future schools and publishers.
