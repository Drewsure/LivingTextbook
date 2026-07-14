# DR-219: Classroom Launch Gate Storage Contract

Date: 2026-07-15

## Decision

Add the backend-neutral storage contract for classroom launch gates.

## Rationale

The classroom launch gate must not remain a UI-only safety rule. Hosted and closed/local deployments need the same record vocabulary before live classroom launch, launch buttons, real learner data collection, report export, or launch-ready status changes are implemented.

## Standard

- The record category is `classroom-launch-gate`.
- The backend entity is `classroom_launch_gate`.
- The migration candidate is `m034-classroom-launch-gate-records`.
- The migration spec is `spec-classroom-launch-gate`.
- Hosted and local write intents must preserve classroom launch gate state.
- The record must block live classroom launch, launch without policy, launch without persistence, real learner data collection, and report export.
