# DR-292: AI-Generated Package Manifest Preview

Status: Accepted  
Date: 2026-07-31

Decision: Add a review-only AI-generated package manifest preview to `/teacher/generator/sample-publisher`.

White-label impact: Strongly positive. Tenants can eventually receive generated package bundles while the platform keeps tenant rules, media rights, review, and release-control evidence visible.

Cost impact: Positive. A single manifest target reduces future backend and local-bundle integration cost by preventing scattered generator outputs.

Constraints:

- The manifest must link prompt, draft JSON, audio, engine, gamification, verifier, and review queue evidence.
- The manifest must name required storage records, including `ai_generated_package_manifest`, `teacher_draft_package`, `teacher_draft_verifier_submission`, `package_game_audio_coverage`, `engine_mode_config_binding`, `collection_unlock_binding`, `activity_compatibility_snapshot`, `media_rights_manifest`, and `teacher_approval_packet`.
- Package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready marking remain blocked.
- This decision is recorded in `docs/adr/0292-ai-generated-package-manifest-preview.md`.
