# DR-309: AI Generated Package Promotion Checklist

Date: 2026-07-31

## Decision

Expose a review-only AI generated package promotion checklist on teacher generator routes.

## Rationale

The generator foundation has many necessary records, but partners and future agents need one visible pathway from generated draft to real playable package. The checklist makes the required records clear without enabling live generation, publishing, assignment, or student-ready actions.

## Hard Boundaries

- No promote generated package button.
- No generated route registry write.
- No generated playlist write.
- No generated assignment write.
- No local companion bundle write.
- No student-ready marker from the promotion checklist.
- No Japanese support-language promotion for MiniStar.

## Required Records Before Future Promotion

- `ai_generator_lineage_map`
- `ai_draft_correction_queue`
- `package_game_audio_coverage`
- `ai_verifier_submission_packet`
- `ai_generated_package_manifest`
- `ai_reward_readiness_gate`
- `package_publish_gate`
- `package_approval_ledger`
- `teacher_assignment_rollout_gate`
- `class_roster_plan`

## White-Label Impact

This makes generated package promotion explainable for MiniStar and future publisher tenants while preserving tenant-specific target language, assist language, media, reward, and approval rules.
