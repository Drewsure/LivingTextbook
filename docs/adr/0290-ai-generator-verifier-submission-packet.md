# ADR 0290: AI Generator Verifier Submission Packet

Status: Accepted  
Date: 2026-07-31

## Decision

Add a review-only verifier submission packet preview to `/teacher/generator/sample-publisher`.

Generated game packages must show the full preflight evidence bundle before they can move toward teacher approval, including schema validation, pedagogical lock, target-language progression, audio coverage, engine binding, gamification mapping, activity compatibility, media rights, and teacher approval checks.

## Rationale

The generator should save teacher time without quietly turning AI output into live classroom material. A visible verifier packet makes the review burden explicit and keeps the white-label product credible for schools, publishers, and local/closed deployments.

## Consequences

- Generated drafts must name `ai_verifier_submission_packet`, `schema_validation_packet`, `pedagogical_lock_packet`, `audio_coverage_packet`, `engine_binding_packet`, `gamification_mapping_packet`, `activity_compatibility_snapshot`, `media_rights_manifest`, and `teacher_approval_packet`.
- Verifier submission, generated package approval, route creation, playlist creation, assignment creation, and student-ready marking remain blocked until durable verifier storage, reviewer identity, media evidence attachments, audio cue approval, approval ledger binding, and release-control binding exist.
- The AI generator route now shows evidence and rejection rules before future live verifier workflows are designed.
