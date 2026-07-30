# AI Teaching Game Generator Checks

Document type: focused verification supplement  
Status: active scaffold  
Last updated: 2026-07-31

Run `npm run verify:ai-generator` after changing AI authoring, generator requests, activity pathway generation, target-language audio rules, premium AI Tutor plan data, or teacher generator routes.

Confirm:

- The generator creates draft package requests only.
- No direct AI publish is available.
- No live model call is available.
- No student assignment is available from a generated draft.
- No unreviewed activity conversion is available.
- No support-language-only progression is available.
- No API cost without tenant approval is allowed.
- No premium upsell is shown to children.
- Tenant generator coverage is required; a tenant route loading is not enough to call that tenant generator-ready.
- Tenant coverage shows `ai_game_generator_request`, `ai_prompt_package`, `premium_ai_cost_gate`, `ai_generation_request_packet`, `ai_audio_coverage_plan`, `ai_gamification_mapping_plan`, `ai_reward_readiness_gate`, `ai_engine_binding_plan`, `ai_verifier_submission_packet`, `ai_generated_package_manifest`, `ai_generated_publish_readiness_gate`, `ai_generated_draft_payload_preview`, and `ai_draft_correction_queue` lanes.
- Missing generator preview records remain visible and block generator request submission, live model calls, verifier submission, package assembly, route or playlist creation, and student assignment.
- 8 default vocabulary terms remains the canonical unit default.
- 8-12 allowed terms remains the bounded extension range.
- Exactly 2 target sentence structures are required.
- JSON-first draft package payload is required.
- Curated activity pathway is required instead of switch-to-anything.
- Every target-language text needs audio.
- Support language cannot unlock progress.
- Verifier packet required before package review.
- Prompt package preview shows a reviewed template version, input slots, output schema locks, tenant rules, model-use state, usage budget, and cost controls.
- Prompt package preview blocks raw student data, student prompt editing, live model use, voice generation, tenant billing, and student assignment.
- AI generator cost and entitlement gate shows `premium_ai_cost_gate`, `tenant_ai_generation_entitlement`, `usage_budget_ceiling`, `model_rate_card_snapshot`, `voice_generation_separate_package`, `cost_estimate_preview`, and `school_approval_required`.
- AI generator cost and entitlement gate blocks live model billing, teacher self-enablement, voice generation, speech scoring, AI Tutor enablement, and child-facing premium upsell.
- Engine binding preview shows mode catalog bindings, parent engines, scoring profiles, audio requirements, and standard event contracts.
- Engine binding preview blocks generated one-off game code, parent-engine bypass, unmapped modes, unreviewed scoring overrides, and direct student route creation.
- `teacher_draft_package`, `teacher_draft_verifier_submission`, `activity_compatibility_snapshot`, and `package_game_audio_coverage` records are named before package review.
- Draft JSON preview keeps `target_language_progress_trigger` as `target-language-only`.
- Draft JSON preview keeps `support_language_progress_allowed: false`.
- Draft JSON preview blocks copy, verifier submission, publish, playlist creation, and assignment.
- Draft JSON preview calls the shared `validateAiGeneratedDraftPayloadPreview` contract and exposes schema guard blocks and warnings.
- Shared draft payload validation enforces the 8-12 vocabulary range, exactly 2 target sentences, target-language-only progress, support-language and media-only progress blocking, required verifier submission state, required blocked actions, next required records, and target-language audio approval.
- AI draft correction queue converts schema guard output into schema/audio/progress repair lanes with required owner, next record, and student-use effect fields.
- AI draft correction queue blocks auto-fix, live AI regeneration, verifier submission, package assembly, route creation, playlist creation, and student assignment.
- Disabled request builder shows source evidence packet, target level, unit theme, target language, support-language policy, curated mode pathway, audio coverage requirement, and AI package state.
- Disabled request builder blocks generation, API cost estimation, request submission, live prompt dispatch, model billing, route creation, and student assignment.
- Audio coverage planner shows `ai_audio_coverage_plan`, `audio_cue_manifest`, and `package_game_audio_coverage` before generated packages can be reviewed.
- Audio coverage planner enumerates target-language term audio, sentence audio, instruction audio, feedback audio, and critical control audio.
- Audio coverage planner keeps support-language audio support-only and blocks media-only listening from counting toward mastery.
- Audio coverage planner blocks live synthetic voice generation and voice API cost until tenant approval.
- Gamification mapping preview shows accepted events, Star Dust allocation, mastery thresholds, score-profile snapshot, event acceptance map, and collection unlock bindings.
- Gamification mapping preview blocks random reward generation, generated gacha, media-only Star Dust, support-language-only mastery, purchase-like unlocks, and unreviewed score profiles.
- AI reward readiness gate preserves the 1,000 Star Dust unit cap, 75% mastery thresholds, deterministic collection unlocks, accepted learning-event sources, and correction-queue clearance.
- AI reward readiness gate blocks reward publishing, collection inventory writes, generated surprise rewards, Spin Wheel ticket issuance, avatar evolution writes, and student assignment.
- Verifier submission packet preview shows `ai_verifier_submission_packet`, `schema_validation_packet`, `pedagogical_lock_packet`, `audio_coverage_packet`, `engine_binding_packet`, `gamification_mapping_packet`, `activity_compatibility_snapshot`, `media_rights_manifest`, and `teacher_approval_packet`.
- Verifier submission packet preview shows evidence and rejection rules for schema validation, pedagogical lock, target-language progression, audio coverage, engine binding, gamification mapping, media rights, and teacher approval.
- Verifier submission packet preview blocks verifier submission, generated package approval, route creation, playlist creation, assignment creation, and student-ready marking until durable verifier storage, reviewer identity, media evidence, audio approval, approval ledger, and release-control binding exist.
- Generated package manifest preview shows `ai_generated_package_manifest`, `teacher_draft_package`, `teacher_draft_verifier_submission`, `package_game_audio_coverage`, `engine_mode_config_binding`, `collection_unlock_binding`, `activity_compatibility_snapshot`, `media_rights_manifest`, and `teacher_approval_packet`.
- Generated package manifest preview links prompt, draft JSON, audio, engine, gamification, verifier, and review queue records before package assembly.
- Generated package manifest preview blocks package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready marking.
- Generated package manifest storage contract appears in schema draft, migration candidates, migration specs, durable records, and hosted/local adapter plans before live generation is enabled.
- AI generated publish readiness gate shows correction queue clearance, verifier packet approval, manifest completeness, reward readiness, release-control binding, and teacher approval ledger capture before any student route can exist.
- AI generated publish readiness gate allows review/correction work only and blocks route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.
- AI generated publish readiness gate storage contract appears in schema draft, migration candidates, migration specs, durable records, and hosted/local adapter plans before generated package publishing is enabled.
- Mode recommendation preview reuses the activity compatibility matrix.
- Mode recommendation preview shows a recommended generated pathway and blocked conversion guardrails.
- Mode recommendation preview blocks a broad switch panel as the default product promise.
- Optional AI Tutor requests remain premium-gated and disabled until school adoption, privacy, transcript, usage-limit, and cost controls exist.
- `/teacher/generator/sample-publisher` loads as a teacher/admin route.
- `/teacher/generator/ministar` loads as a teacher/admin route and shows missing tenant generator preview records instead of silently inheriting sample-publisher records.
- `/teacher/intake` includes the generator foundation panel.
