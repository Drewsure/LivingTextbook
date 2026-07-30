# AI Teaching Game Generator Contract

Document type: implementation contract  
Status: active scaffold  
Last updated: 2026-07-31

## Purpose

The AI teaching game generator is a teacher/admin authoring aid for the white-label Living Textbook platform. It helps convert reviewed source material into structured game-package drafts.

It does not create production game code, publish routes, assign student work, or call a live model in the foundation scaffold.

## Core Rule

AI teaching game generator creates draft package requests, verifier packets, audio-coverage plans, activity pathway proposals, media-needs notes, and teacher launch copy.

The generator cannot bypass source review, package review, target-language audio coverage, media rights, activity compatibility, teacher approval, package publish gates, launch safety, or school policy gates.

## Tenant Coverage Rule

A tenant generator route loading is not enough to call that tenant generator-ready.

Each tenant request must show request-specific generator record coverage for `ai_game_generator_request`, `ai_prompt_package`, `premium_ai_cost_gate`, `ai_generation_request_packet`, `ai_audio_coverage_plan`, `ai_gamification_mapping_plan`, `ai_reward_readiness_gate`, `ai_engine_binding_plan`, `ai_verifier_submission_packet`, `ai_generated_package_manifest`, `ai_generated_publish_readiness_gate`, `ai_generated_draft_payload_preview`, and `ai_draft_correction_queue`.

Missing generator preview records must stay visible and must block generator request submission, live model calls, verifier submission, package assembly, route or playlist creation, and student assignment. Partial tenant-level builder records are allowed as scaffolds only; they must be upgraded to request-specific bindings before live workflows exist.

The backend-neutral storage contract is `ai_generator_tenant_coverage_gate` / `ai-generator-tenant-coverage-gate`. Hosted and local adapters must preserve tenant-specific covered, partial, and missing record lanes while blocking generator request submission, live model calls, verifier submission, package assembly, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.

The MiniStar Level 1 greetings generator seed may include tenant-specific prompt package, cost gate, disabled request builder, audio coverage, gamification mapping, reward readiness, engine binding, Draft JSON preview, and derived correction queue records. That seed does not make MiniStar generator-ready until verifier submission, generated package manifest, publish readiness, audio approval, media-rights, and teacher approval records also exist and pass review.

## Required Output Rules

- 8 default vocabulary terms.
- 8-12 allowed terms when a reviewed unit genuinely requires extension.
- Exactly 2 target sentence structures.
- JSON-first draft package payload.
- Curated activity pathway rather than switch-to-anything.
- Every target-language text needs audio.
- Support language cannot unlock progress.
- Teacher Launch Protocol required.
- Verifier packet required before package review.

## Required Draft Records

- `teacher_draft_package`
- `teacher_draft_verifier_submission`
- `activity_compatibility_snapshot`
- `package_game_audio_coverage`
- `media_playlist_binding` when media is part of the request.
- `ai_tutor_entitlement_packet` when optional AI Tutor is part of the request.

## Draft Payload Preview Rule

The teacher generator route may show a Draft JSON preview so reviewers can understand the output shape. The preview must preserve `target_language_progress_trigger`, `support_language_progress_allowed: false`, `teacher_draft_verifier_submission`, and blocked actions for copy, verifier submission, publish, playlist creation, and assignment until storage and review workflows exist.

## Draft Payload Validation Rule

AI-generated draft payloads must pass the shared `validateAiGeneratedDraftPayload` / `validateAiGeneratedDraftPayloadPreview` contract before review, persistence, verifier submission, package assembly, route creation, playlist creation, or student assignment can be considered.

The validator must enforce the 8-12 vocabulary range, exactly 2 target sentences, `target_language_progress_trigger: target-language-only`, `support_language_progress_allowed: false`, `media_only_progress_allowed: false`, teacher draft verifier submission, blocked draft actions, next required records, and target-language audio approval. The generator route must show schema guard blocks and warnings while the preview remains draft-only.

## Draft Correction Queue Rule

Schema guard output must be converted into a teacher/admin correction queue before generated drafts can enter real review. The queue must show schema/audio/progress repair lanes, required owners, next records, student-use effects, validation block counts, and review warning counts.

The correction queue must not offer auto-fix, live AI regeneration, verifier submission, package assembly, route creation, playlist creation, or student assignment.

## Request Builder Rule

The teacher generator route may show a disabled request-builder form for source evidence packet, target level, unit theme, target language, assist-language policy, curated mode pathway, audio coverage requirement, and AI package state. The form must keep generation, API cost estimation, request submission, live prompt dispatch, model billing, route creation, and student assignment blocked until the premium AI package, persistence, verifier, and approval workflows exist.

## Prompt Package Rule

Future AI generation must run from reviewed, versioned, tenant-scoped prompt packages. A prompt package must name its template version, input slots, output schema locks, tenant brand rules, model-use state, usage budget, and cost controls. It must block raw student data, student prompt editing, live model use, voice generation, tenant billing, and student assignment until the tenant has approved the correct AI package and storage/review controls exist.

## Cost And Entitlement Gate Rule

Future AI generation must pass a `premium_ai_cost_gate` before any model call, voice generation, speech scoring, AI Tutor activation, or billing action exists. The gate must name tenant AI generation entitlement, usage budget ceiling, model rate-card snapshot, voice-generation package separation, cost estimate preview, and school approval requirements. Teachers cannot self-enable premium AI, and children must never see premium upsell copy.

## Engine Binding Rule

Generated activity proposals must bind to the existing game mode catalog, parent engines, scoring profiles, and standard event contract. The generator may propose payload mappings and mode configs, but it must not generate standalone game code, bypass parent engines, override scoring profiles without review, or promote Z.ai/outside prototypes into production without an integration plan.

## Mode Recommendation Rule

Generator mode recommendations must reuse the reviewed activity compatibility matrix. The generator can recommend a tight pathway for a unit, but it must not produce a broad switch panel or unsupported conversions. Blocked conversions stay visible with their payload-fit and compatibility-rule reasons.

## Audio Coverage Planner Rule

Generated game requests must produce an `ai_audio_coverage_plan` before review. The plan must enumerate target-language term audio, sentence audio, instruction audio, feedback audio, and critical control audio; name the `audio_cue_manifest` and `package_game_audio_coverage` records; keep support-language audio support-only; and block background music or video sound from counting toward mastery. Live synthetic voice generation and voice API cost remain blocked until a tenant approves the premium package and storage/review controls exist.

## Gamification Mapping Rule

Generated game requests must produce an `ai_gamification_mapping_plan` before review. The plan must name accepted game events, Star Dust allocation lanes, mastery thresholds, `game_scoring_profile_snapshot`, `progress_event_acceptance_map`, and `collection_unlock_binding` records. AI generation cannot create random rewards, generated gacha, purchase-like unlocks, support-language-only mastery, media-only Star Dust, or unreviewed score profiles.

## Reward Readiness Gate Rule

Generated game requests must pass an `ai_reward_readiness_gate` before any reward publishing, collection inventory write, Spin Wheel ticket issuance, avatar evolution write, or student assignment exists.

The gate must preserve the 1,000 Star Dust unit cap, 75% mastery thresholds, deterministic collection unlocks, accepted learning-event sources, correction-queue clearance, `game_scoring_profile_snapshot`, `progress_event_acceptance_map`, `collection_unlock_binding`, and `earned_collection_inventory` records. Generated surprise rewards remain blocked.

The backend-neutral storage contract is `ai_reward_readiness_gate` / `ai-reward-readiness-gate`. Hosted and local adapters must preserve deterministic reward checks while blocking reward publishing, collection inventory writes, generated surprise rewards, Spin Wheel ticket issuance, avatar evolution writes, and student assignment.

## Verifier Submission Packet Rule

Generated game requests must produce an `ai_verifier_submission_packet` before teacher approval. The packet must include schema validation, pedagogical lock, target-language progression, audio coverage, engine binding, gamification mapping, activity compatibility, media-rights, and teacher-approval checks.

Verifier submission, generated package approval, route creation, playlist creation, assignment creation, and student-ready marking remain blocked until durable verifier storage, reviewer identity, media evidence attachments, audio cue approval, approval ledger binding, and release-control binding exist.

## Review Queue Integration Rule

Generated draft packages must enter the standard teacher draft review queue as read-only queue items. They must show source lineage, verifier packet requirements, target-language audio blockers, media-rights blockers, engine/gamification checks, blocked route and playlist creation, blocked assignment, and blocked approval. The queue must not give AI drafts a shortcut around the same review and approval gates used for teacher-created drafts.

## Generated Package Manifest Rule

Generated draft packages must produce an `ai_generated_package_manifest` before package assembly exists. The manifest must link the prompt package, Draft JSON preview, audio coverage plan, engine binding plan, gamification mapping plan, verifier submission packet, and review queue item. It must name the package records needed for future storage and keep package assembly, route registry writes, media playlist writes, assignment writes, local bundle writes, and student-ready marking blocked.

The manifest must also have a backend-neutral storage contract before live generation. Hosted and local adapters must preserve prompt, draft JSON, audio, engine, gamification, verifier, review queue, media-rights, and release-lock lineage while blocking package assembly, route registry writes, media playlist writes, assignments, local bundle writes, and student-ready markers.

## Generated Publish Readiness Gate Rule

Generated packages must show an `ai_generated_publish_readiness_gate` before any generated package can become a student-facing route.

The gate must gather correction queue status, verifier packet approval, manifest completeness, reward readiness, release-control binding, and teacher approval ledger capture. It may allow review and correction work, but route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers remain blocked.

The backend-neutral storage contract is `ai_generated_publish_readiness_gate` / `ai-generated-publish-readiness-gate`. Hosted and local adapters must preserve correction queue clearance, verifier packet approval, manifest completeness, reward readiness, release-control binding, and teacher approval ledger capture while blocking route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.

## Blocked Actions

- No direct AI publish.
- No live model call.
- No student assignment.
- No unreviewed activity conversion.
- No support-language-only progression.
- No generated media prompt as production artwork.
- No API cost without tenant approval.
- No premium upsell shown to children.

## White-Label Position

MiniStar is a reference tenant. Other publishers can define their own curriculum, target language, support language, media policy, avatar family, reward naming, visual blacklist, and premium AI package state.

Japanese can be a target language in a future tenant if the content and game payloads are built around Japanese as the target-language trigger. That is different from Japanese assist language inside MiniStar English units.

## Verification

Run:

```powershell
npm run verify:ai-generator
```

The foundation hard gate also includes this check through:

```powershell
npm run verify:foundation
```
