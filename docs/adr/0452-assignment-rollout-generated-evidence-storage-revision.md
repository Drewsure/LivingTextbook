# ADR 0452: Assignment Rollout Generated Evidence Storage Revision

Date: 2026-08-28

Status: accepted

## Context

Generated-package assignment handoff evidence is now visible inside the existing teacher assignment rollout preview. The original rollout storage contract preserved rollout status, gate evidence, blockers, and scheduling rules, but did not explicitly preserve generated-package handoff source ids or the teacher-visible generated package policy note.

## Decision

Revise `teacher_assignment_rollout_gate` / `teacher-assignment-rollout-gate` storage to preserve:

- `source_evidence_packet_ids`
- `generated_package_policy_note`
- `generated_package_handoff_allowed`

`generated_package_handoff_allowed` remains false until assignment rollout, classroom launch, school policy, roster, reporting, rollback, privacy, target-language, and support-language boundary gates pass.

## Consequences

- Generated packages enter the same assignment rollout gate as ordinary reviewed packages.
- Hosted and local storage adapters must preserve generated handoff evidence without creating a parallel generated assignment workflow.
- Source evidence packet ids cannot schedule classes, activate private links, bind rosters, start progress streams, export reports, launch classrooms, store raw learner audio/transcripts, or bypass school policy.
