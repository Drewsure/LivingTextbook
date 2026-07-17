# Teacher Assignment Rollout Contract

Document type: implementation contract

Status: active scaffold

## Purpose

Teacher assignment rollout separates these stages:

1. A package exists.
2. A teacher assignment is drafted.
3. A class/session rollout is safe to schedule.
4. A real pilot can begin.

This protects the product from treating demo routes or package drafts as classroom-ready pilots too early.

## Current Rollout States

- `demo-preview`
- `blocked`
- `ready-to-schedule`
- `pilot-ready`

## Current Gate Types

- Package review.
- Launch route.
- Progress persistence.
- Report policy.
- Stable front door.
- Media rights.
- Learner code grouping.
- Local bundle.
- Local storage.
- QR fallback.

## Required Rules

- Demo preview may be usable for guided walkthroughs.
- Real pilot scheduling requires media rights, persistence, route permanence, teacher approval, and report policy as appropriate.
- Local/closed companion rollout stays visible but does not become the first pilot cost center.
- Cost-bearing premium features remain disabled unless tenant/school policy adopts them.

## Storage Contract

The backend-neutral record is `teacher_assignment_rollout_gate` / `teacher-assignment-rollout-gate`. Hosted and local implementations must preserve rollout status, gate summary, gate evidence, blockers, and teacher-visible scheduling rules.

This record must not schedule a class, launch students, collect real learner data, or export teacher reports by itself. Those actions remain blocked until classroom launch, school policy, persistence, reporting, route, media, and privacy gates are separately accepted.

## Acceptance Criteria

- `/teacher/intake` shows assignment rollout after assignment readiness.
- MiniStar demo rollout is demo-preview, not production-ready.
- Sample publisher rollout is blocked by media rights and route/reporting gaps.
- Local companion rollout is blocked by local bundle/storage policy.
- `/teacher/intake` shows `teacher_assignment_rollout_gate`, `Teacher assignment rollout gate record`, and `teacher-assignment-rollout-gate-record` in the backend storage readiness inventory.
