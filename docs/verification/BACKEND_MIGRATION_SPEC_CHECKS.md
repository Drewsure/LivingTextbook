# Backend Migration Specification Checks

Run these checks when backend migration specs change.

## Required Local Checks

- `npm run typecheck --workspace @living-textbook/web`
- `npm run build --workspace @living-textbook/web`

## Browser Checks

Open:

- `http://127.0.0.1:3000/teacher/intake`

Confirm:

- The page loads without a runtime error.
- The backend migration specifications panel appears after migration candidates.
- The panel says the specs are vendor-neutral/no vendor lock.
- Tenant entitlement, package release, teacher draft review handoff, AI generated package manifest, package game/audio coverage snapshot, permanent QR alias, package release candidate, and progress event stream specs are visible.
- Teacher draft review handoff includes `schema_validation_packet`, `audio_coverage_packet`, `route_activity_packet`, and `live_review_submission_allowed`.
- AI generated package manifest includes `prompt_package_id`, `draft_preview_id`, `audio_coverage_plan_id`, `engine_binding_plan_id`, `gamification_mapping_id`, `verifier_submission_packet_id`, `review_queue_item_id`, `release_locks`, and blocked write booleans.
- Progress event stream is marked policy-blocked.
- Progress event stream includes `event_effect`, `taxonomy_version`, and `event_acceptance_gate_id`.
- Teacher report package boundary includes `event_acceptance_summary` and `settings_context_summary`.
- Each spec names fields, indexes, retention, export, local fallback, and policy blockers.
- Package release candidate status is derived from gate and ledger state and cannot be manually overridden.

## Product Checks

- No spec creates a real backend dependency.
- No spec stores raw learner audio.
- No spec stores raw AI Tutor transcripts.
- No spec stores unreviewed PDF source as student-facing content.
- No spec allows support-only events to drive mastery, Star Dust, or unlock calculations.
- No spec allows review handoff packets to submit, assign, or publish without verifier and approval workflow.
- No spec allows AI generated package manifests to assemble packages, write routes, create playlists, assign students, write local bundles, or mark content student-ready without review and release-control gates.
- No spec allows progress event writes before the related launch-session event acceptance gate passes.
- No spec allows report package export to hide blocked or demo-only event acceptance status.
- Tenant and package records preserve white-label boundaries.
- Local fallback language remains visible where relevant.
