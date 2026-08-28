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
- Generated handoff evidence.

## Required Rules

- Demo preview may be usable for guided walkthroughs.
- Real pilot scheduling requires media rights, persistence, route permanence, teacher approval, and report policy as appropriate.
- Local/closed companion rollout stays visible but does not become the first pilot cost center.
- Cost-bearing premium features remain disabled unless tenant/school policy adopts them.
- AI-generated packages can enter rollout planning only through review-only assignment handoff evidence packets.
- Assignment handoff evidence does not schedule classes, activate private links, bind rosters, start progress streams, export reports, launch classrooms, or store raw learner audio/transcripts.
- Rollout summaries must show generated-package evidence counts before detailed plan review.

## Storage Contract

The backend-neutral record is `teacher_assignment_rollout_gate` / `teacher-assignment-rollout-gate`. Hosted and local implementations must preserve rollout status, gate summary, gate evidence, generated-package handoff source evidence packet ids, generated package policy note, blockers, and teacher-visible scheduling rules.

This record must not schedule a class, launch students, collect real learner data, export teacher reports, or activate generated-package assignment handoff by itself. Those actions remain blocked until classroom launch, school policy, persistence, reporting, route, media, roster, rollback, and privacy gates are separately accepted.

## Acceptance Criteria

- `/teacher/intake` shows assignment rollout after assignment readiness.
- MiniStar demo rollout is demo-preview, not production-ready.
- Sample publisher rollout is blocked by media rights and route/reporting gaps.
- Local companion rollout is blocked by local bundle/storage policy.
- `/teacher/intake` shows `teacher_assignment_rollout_gate`, `Teacher assignment rollout gate record`, and `teacher-assignment-rollout-gate-record` in the backend storage readiness inventory.
- `/teacher/intake` shows generated-package handoff evidence as review-only under assignment rollout.
- `/teacher/intake` summarizes generated-package evidence counts at the top of assignment rollout.
- Backend schema drafts and migration specs preserve `source_evidence_packet_ids`, `generated_package_policy_note`, and `generated_package_handoff_allowed` for rollout gates.
