# DR-523: Assignment Rollout Generated Evidence Storage Revision

Date: 2026-08-28

## Decision

Revise teacher assignment rollout gate storage to preserve generated-package handoff source evidence packet ids, generated package policy notes, and a blocked generated-package handoff field.

## Rationale

Generated packages need to move through the same rollout lane as teacher-reviewed packages. Preserving the generated evidence fields inside `teacher_assignment_rollout_gate` prevents a parallel workflow while keeping source evidence visible for review, export, and local companion planning.

## Guardrails

- `source_evidence_packet_ids`, `generated_package_policy_note`, and `generated_package_handoff_allowed` must remain in backend schema drafts and migration specs.
- Hosted and local write intents must preserve generated-package handoff evidence.
- `generated_package_handoff_allowed` remains false until assignment rollout, launch, school policy, roster, reporting, rollback, privacy, and support-language gates pass.
- Generated-package evidence cannot schedule classes, activate private links, bind rosters, start progress streams, export reports, launch classrooms, store raw learner audio/transcripts, or bypass target-language progress rules.

## Verification

`npm run verify:backend-storage`, `npm run verify:assignment-rollout`, `npm run typecheck --workspace @living-textbook/web`, `npm run build --workspace @living-textbook/web`, and `npm run verify:routes` must pass after this change.

ADR: `docs/adr/0452-assignment-rollout-generated-evidence-storage-revision.md`
