# DR-310: AI Generated Package Promotion Checklist Storage Contract

Date: 2026-07-31

## Decision

Preserve AI generated package promotion checklist records in the backend schema, migration specs, durable record plan, persistence boundaries, and hosted/local adapter plans before generated package promotion exists.

## Rationale

The promotion checklist is the bridge from generated draft to future playable package. It must be more than UI text: hosted and local implementations need to preserve the evidence that proves lineage, correction, audio, verifier, manifest, reward, release, approval, and assignment rollout requirements have been reviewed.

## Hard Boundaries

- No generated package promotion without the checklist record.
- No generated route registry write from the checklist.
- No generated playlist write from the checklist.
- No generated assignment write from the checklist.
- No local companion bundle write from the checklist.
- No student-ready marker from the checklist.
- No support-language-only promotion.

## Required Stored References

- `ai_generator_lineage_map_id`
- `ai_draft_correction_queue_id`
- `package_game_audio_coverage_id`
- `ai_verifier_submission_packet_id`
- `ai_generated_package_manifest_id`
- `ai_reward_readiness_gate_id`
- `package_publish_gate_id`
- `package_approval_ledger_id`
- `teacher_assignment_rollout_gate_id`

## White-Label Impact

This keeps generated-package promotion tenant-safe. MiniStar can require English target-language audio with Japanese support-only review, while future publishers can configure their own target language, assist language, media, and approval rules without changing the core storage contract.
