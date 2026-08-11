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

The backend-neutral storage contract for the route rollup is `ai_generator_review_summary` / `ai-generator-review-summary`. Hosted and local adapters must preserve section readiness, primary blockers, next required records, source record links, and blocked actions while blocking live generation, app patch generation, package assembly, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.

The backend-neutral storage contract for the human review order is `ai_generator_reviewer_runbook` / `ai-generator-reviewer-runbook`. Hosted and local adapters must preserve review order, standing rules, evidence lanes, required record ids, target-language trigger rules, assist-language support rules, and blocked shortcuts while blocking live generation, app patch generation, package assembly, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.

## Generator Responsibility Matrix

Teacher generator routes must show a review-only responsibility matrix before detailed generator panels. The matrix separates teacher/school review, Codex architecture and integration, outside AI builder/Z.ai prototype work, verifier checks, and platform admin entitlement/storage/release duties.

Codex owns architecture, schema discipline, parent-engine integration, route safety, verification, and final app review. Outside AI builders may create isolated prototypes from strict briefs only; they cannot write app files, create routes, override scoring, write rewards, create playlists, assemble packages, or assign students. The verifier layer checks JSON, pedagogy, target-language audio, support-language boundaries, and activity compatibility. Platform admins own cost entitlement, storage, release-control, and child-safe premium boundaries.

The backend-neutral storage contract for this role map is `ai_generator_responsibility_matrix` / `ai-generator-responsibility-matrix`. Hosted and local adapters must preserve role ownership, owner duties, handoff record ids, cannot-do rules, next gates, target-language trigger rules, and assist-language support rules while blocking live generation, app patch generation, external-builder app writes, external-builder scoring authority, package assembly, route registry writes, media playlist writes, assignment creation, local bundle writes, and student-ready markers.

The MiniStar Level 1 greetings generator seed may include tenant-specific prompt package, cost gate, disabled request builder, audio coverage, gamification mapping, reward readiness, engine binding, Draft JSON preview, derived correction queue, blocked verifier submission packet, generated package manifest, and derived publish readiness records. That seed does not make MiniStar generator-ready until audio approval, media-rights, teacher approval, durable storage, and release-control records also exist and pass review.

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

## MiniStar Early Japanese Support Guard

MiniStar Foundation, Bronze, and Plus generator drafts may include Japanese support language only as `support_language: ja-hiragana`. That support text must be hiragana-only, teacher-reviewable, and marked `support-only`.

Japanese support cues cannot be generated as target-language term, sentence, scoring, mastery, reward, approval, route, playlist, assignment, package-assembly, or student-ready evidence. English remains the target-language trigger for the MiniStar early-level sample.

The shared `validateAiGeneratedDraftPayload` contract must reject non-hiragana `ja-hiragana` support text, support cues not marked `support-only`, and early Japanese support metadata that is not explicitly `ja-hiragana`. This guard exists before live model calls so generated drafts cannot introduce corrupted text, kanji/katakana drift, or support-language progression by accident.

## Generator Lineage Map Rule

Teacher generator routes must show an inspection-only lineage map before live generation exists. The map traces a generated request through prompt package, Draft JSON preview, correction queue, verifier packet, generated package manifest, publish readiness gate, and teacher review queue item.

The lineage map cannot generate, submit verifier packets, assemble packages, create routes, create playlists, create assignments, unlock support-language progress, write local bundles, or mark student-ready state. MiniStar lineage must explicitly preserve English as the target-language trigger and Japanese as hiragana-only support.

## Generator Review Summary Rule

Teacher generator routes must show a tenant-aware review summary before detailed panels. The summary is an admin rollup only: it shows section readiness, primary blockers, next required records, source records, and blocked actions.

The review summary cannot call a live model, generate an app patch, assemble a package, create a route, create a playlist, create an assignment, write a local bundle, or mark content student-ready. MiniStar summaries must preserve English as the target-language trigger and keep Japanese hiragana support as support-only.

## Generator Reviewer Runbook Rule

Teacher generator routes must show a tenant-aware reviewer runbook before detailed panels. The runbook is guidance only: it gives reviewers a human review order, standing rules, evidence to review, required records, and blocked shortcuts.

The runbook cannot call a live model, generate an app patch, assemble a package, create a route, create a playlist, create an assignment, write a local bundle, or mark content student-ready. MiniStar runbooks must preserve English as the target-language trigger and keep Japanese hiragana support as support-only.

## Generated Package Promotion Checklist Rule

Teacher generator routes must show a review-only promotion checklist before any generated draft can become a real playable package. The checklist translates the manifest, lineage map, correction queue, audio coverage, verifier packet, reward gate, release-control binding, approval ledger, and assignment rollout gate into one visible draft-to-playable package pathway.

The promotion checklist cannot promote a package, write route registry entries, create playlists, create assignments, write local companion bundles, or mark student-ready state. MiniStar promotion checklists must explicitly preserve English target-language audio approval and keep Japanese hiragana support as support-only.

Backend schema, migration candidates, migration specs, durable records, and hosted/local adapter plans must preserve `ai_generated_package_promotion_checklist` / `ai-generated-package-promotion-checklist` before generated package promotion exists. The record must keep lineage map, correction queue, target-language audio approval, verifier packet, manifest completeness, reward readiness, release-control binding, teacher approval ledger, and assignment rollout gate references, while generated package promotion, route registry writes, media playlist writes, assignment writes, local bundle writes, student-ready markers, and support-language-only promotion remain blocked.

## Generated Package Release Candidate Rule

Teacher generator routes may show a review-only `ai_generated_package_release_candidate` preview after manifest, promotion checklist, and publish readiness records are visible. This preview exists to explain the future handoff from AI-generated package evidence into the private tenant library and normal release-control pipeline.

The release candidate preview cannot write `package_release_candidate`, `tenant_library_item`, route registry, playlist, assignment, local bundle, or student-ready records. It must show private-library handoff as blocked, student-facing release as blocked, and MiniStar Japanese support-language release as blocked while English remains the target-language trigger.

Backend schema, migration candidates, migration specs, durable records, and hosted/local adapter plans must preserve `ai_generated_package_release_candidate` / `ai-generated-package-release-candidate` before generated package private-library handoff exists. The record must keep generated manifest, promotion checklist, publish readiness, private library target, future tenant library item, future package release candidate, release-control, approval, and assignment rollout references while generated package library publish, release candidate writes, tenant library item writes, student-facing release, assignment writes, local bundle release, student-ready markers, and support-language-only release remain blocked.

## Generated Package Assembly Readiness Rule

Teacher generator routes must show a review-only generated package assembly readiness preview before any generated draft can become a written package, route entry, playlist, local bundle, assignment, or student-ready item.

The preview combines manifest completeness, promotion checklist status, publish readiness, release candidate handoff, teacher approval evidence, media-rights evidence, target-language audio approval, and tenant-specific language boundaries into one assembly decision. It may guide human review and identify next required records, but it cannot assemble packages, write route registries, create media playlists, write local bundles, assign students, mark generated packages student-ready, or treat support-language-only activity as release evidence.

MiniStar assembly readiness must keep English as the target-language assembly trigger. Japanese hiragana support for early levels remains support-only and cannot satisfy assembly, scoring, mastery, reward, route, playlist, assignment, or student-ready gates.

The backend-neutral storage contract is `ai_generated_package_assembly_readiness` / `ai-generated-package-assembly-readiness`. Hosted and local adapters must preserve manifest, promotion checklist, publish readiness, release candidate, teacher approval, media-rights, target-language audio, and support-language boundary lanes while blocking generated package assembly, route registry writes, media playlist writes, local bundle writes, assignment creation, student-ready markers, and support-language-only assembly.

## Generated Package Assembly Dry Run Rule

Teacher generator routes may show a review-only generated package assembly dry run after assembly readiness. The dry run previews the package JSON, route registry entry, media playlist binding, local companion artifact, assignment shell, and report-adjacent bindings that would be needed after every readiness lane clears.

Dry runs must pass the shared `validateAiGeneratedPackageAssemblyDryRun` guard before future package-writer work can treat the artifact map as structurally valid. The guard keeps dry runs blocked in the foundation, requires package, route, playlist, local companion, and assignment artifact previews, requires explicit blocked write rules, preserves support-language boundaries, and blocks package JSON writes, route registry writes, media playlist writes, local bundle writes, assignments, student-ready markers, and support-language-only assembly dry runs.

The dry run cannot write package JSON, route registry entries, media playlists, local companion bundles, assignment records, real learner data, student-ready markers, or support-language-only assembly state. It is an artifact map for human review, not a package builder.

The backend-neutral storage contract is `ai_generated_package_assembly_dry_run` / `ai-generated-package-assembly-dry-run`. Hosted and local adapters must preserve assembly readiness links, generated package manifest links, package JSON previews, route registry previews, media playlist previews, local companion previews, assignment-shell previews, and source record ids while blocking package JSON writes, route registry writes, media playlist writes, local bundle writes, assignment creation, student-ready markers, and support-language-only assembly.

## Generated Package Writer Preflight Rule

Teacher generator routes may show a review-only generated package writer preflight after assembly dry runs. The preflight names the future writer targets for package JSON, route registry, media playlist, local companion, assignment shell, and rollback map work.

Writer preflights must pass the shared `validateAiGeneratedPackageWriterPreflight` guard before future package-writer implementation work can treat writer targets as structurally valid. The guard keeps preflights blocked in the foundation, requires package, route, playlist, local companion, assignment, and rollback writer targets, requires explicit blocked write rules, preserves support-language boundaries, and blocks writer execution, package JSON commits, route registry mutation, media playlist creation, local bundle packaging, assignment activation, student-ready markers, and support-language-only package writers.

The preflight cannot execute a writer, commit package JSON, mutate route registries, create media playlists, package local bundles, activate assignments, collect real learner data, mark generated packages student-ready, or use support-language-only evidence as a writer trigger. It is a review surface for future implementation planning, not a content-writing workflow.

The backend-neutral storage contract is `ai_generated_package_writer_preflight` / `ai-generated-package-writer-preflight`. Hosted and local adapters must preserve assembly dry-run links, assembly readiness links, package id previews, writer target maps, required evidence, and blocked writer actions while blocking writer execution, package JSON writes, route registry writes, media playlist writes, local bundle writes, assignment creation, student-ready markers, and support-language-only writers.

## Generated Package Writer Rollback Drill Rule

Teacher generator routes may show a review-only generated package writer rollback drill after writer preflight. The drill names pre-write snapshots, post-write verification, and rollback rehearsal steps for package JSON, route registry, media playlist, local companion, assignment shell, and release-control rollback scope.

Rollback drills must pass the shared `validateAiGeneratedPackageWriterRollbackDrill` guard before future package-writer implementation work can treat rollback rehearsal as structurally valid. The guard keeps drills blocked in the foundation, requires package JSON, route registry, media playlist, local companion, assignment shell, and release-control snapshots, requires post-write verification, preserves support-language boundaries, and blocks rollback execution, package writer execution, package JSON rollback, route rollback, media playlist rollback, local bundle rollback, assignment rollback, production QR redirect mutation, and support-language-only rollback evidence.

The rollback drill cannot execute a rollback, execute a package writer, restore package JSON, mutate route registries, mutate production QR redirects, roll back media playlists, roll back local bundles, mutate assignments, collect real learner data, or use support-language-only evidence as rollback proof. It is a rehearsal and evidence map for a future writer implementation.

The backend-neutral storage contract is `ai_generated_package_writer_rollback_drill` / `ai-generated-package-writer-rollback-drill`. Hosted and local adapters must preserve writer preflight links, pre-write snapshots, post-write verification, rollback rehearsal steps, blocked rollback actions, and support-language boundaries while blocking rollback execution, package writer execution, package JSON rollback, route rollback, media playlist rollback, local bundle rollback, assignment mutation, production QR redirect mutation, student-ready markers, and support-language-only rollback evidence.

## Generated Package Writer Implementation Readiness Rule

Teacher generator routes may show a review-only generated package writer implementation readiness gate after rollback drill storage is visible. The gate names the future writer modules, required test gates, release controls, next records, and blocked implementation actions.

Implementation readiness records must pass the shared `validateAiGeneratedPackageWriterImplementationReadiness` guard before future package-writer implementation work can be considered. The guard keeps readiness blocked in the foundation, requires content package, route registry, media playlist, local companion, assignment shell, and release rollback guard module plans, requires storage contract verification, rollback drill replay, and support-language boundary tests, preserves release controls, and blocks package writer implementation, writer execution, generated app file writes, route mutation, playlist creation, local bundle packaging, assignment activation, rollback execution, production QR redirect mutation, and support-language-only implementation evidence.

The implementation readiness gate cannot implement package writers, write app files, execute writers, mutate route registries, create media playlists, package local bundles, activate assignments, execute rollbacks, mutate production QR redirects, mark student-ready state, or use support-language-only evidence as implementation proof. Codex must make a separate package-writer implementation decision before any code path can exist.

The backend-neutral storage contract is `ai_generated_package_writer_implementation_readiness` / `ai-generated-package-writer-implementation-readiness`. Hosted and local adapters must preserve rollback drill links, module plans, required test gates, release controls, next records, blocked implementation actions, and support-language boundaries while blocking package writer implementation, writer execution, generated app file writes, route registry mutation, media playlist creation, local bundle packaging, assignment activation, student-ready markers, production QR redirect mutation, and support-language-only implementation evidence.

## Package Writer Module Test Plan Rule

Teacher generator routes may show a review-only package writer module test plan after implementation readiness storage is visible. The plan names content package writer, route registry writer, media playlist writer, local companion writer, assignment shell writer, and release rollback guard test suites.

The module test plan cannot execute automated writer tests, run writer mutation browser tests, patch app files, write generated package JSON, mutate route registries, create media playlists, package local bundles, activate assignments, mutate production QR redirects, or accept support-language-only test passes. It is a test evidence map for a future package writer implementation decision.

The backend-neutral storage contract is `ai_generated_package_writer_module_test_plan` / `ai-generated-package-writer-module-test-plan`. Hosted and local adapters must preserve implementation readiness links, rollback drill links, package id previews, module test suites, required fixtures, required assertions, required evidence, blocked test actions, and support-language boundaries while blocking automated writer test execution, writer mutation browser runs, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only test passes.

## Package Writer Test Evidence Packet Rule

Teacher generator routes may show a review-only package writer test evidence packet after module test plan storage is visible. The packet names fixture, route/QR, audio/media, local/assignment, rollback, and support-language evidence lanes required before a future writer test harness can be considered.

The test evidence packet cannot run automated writer tests, run writer mutation browser tests, upload evidence, capture signed approval, patch app files, write generated package JSON, mutate route registries, create media playlists, package local bundles, activate assignments, mutate production QR redirects, or accept support-language-only evidence passes. It is a proof checklist for a future Codex test harness decision, not a runnable test workflow.

The backend-neutral storage contract is `ai_generated_package_writer_test_evidence_packet` / `ai-generated-package-writer-test-evidence-packet`. Hosted and local adapters must preserve module test plan links, implementation readiness links, rollback drill links, evidence lanes, source records, required evidence, acceptance checks, missing evidence, blocked evidence actions, and support-language boundaries while blocking automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only evidence passes.

## Package Writer Test Harness Plan Rule

Teacher generator routes may show a review-only package writer test harness plan after test evidence packet storage is visible. The plan names future dry-run harness phases for fixture replay, route smoke, media policy, local/assignment checks, and rollback guards, plus environment adapters for static fixture, browser smoke, and local dry-run checks.

The harness plan cannot implement a test harness, run automated writer tests, run mutation browser checks, upload evidence, capture signed approval, patch app files, write generated package JSON, mutate route registries, create media playlists, package local bundles, activate assignments, mutate production QR redirects, or accept support-language-only harness passes. It is an implementation-planning surface for a future Codex test harness decision, not an executable test runner.

The backend-neutral storage contract is `ai_generated_package_writer_test_harness_plan` / `ai-generated-package-writer-test-harness-plan`. Hosted and local adapters must preserve test evidence packet links, module test plan links, implementation readiness links, rollback drill links, harness phases, environment adapters, required-before-harness prerequisites, blocked harness actions, and support-language boundaries while blocking test harness implementation, automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only harness passes.

## Package Writer Test Harness Implementation Proposal Rule

Teacher generator routes may show a review-only package writer test harness implementation proposal after test harness plan storage is visible. The proposal names future module scope, implementation boundaries, required review gates, dry-run-only checks, next records, and support-language boundaries.

The implementation proposal cannot implement a harness, run automated writer tests, run mutation browser checks, upload evidence, capture signed approval, patch app files, write generated package JSON, mutate route registries, create media playlists, package local bundles, activate assignments, mutate production QR redirects, or accept support-language-only harness passes. It is a scoping proposal for a future Codex implementation decision, not executable code.

The backend-neutral storage contract is `ai_generated_package_writer_test_harness_implementation_proposal` / `ai-generated-package-writer-test-harness-implementation-proposal`. Hosted and local adapters must preserve test harness plan links, test evidence packet links, module test plan links, proposed module scope, implementation boundaries, required review gates, dry-run-only checks, next records, blocked actions, and support-language boundaries while blocking harness implementation, automated writer test execution, writer mutation browser runs, evidence upload, signed approval capture, app file patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only harness passes.

## Package Writer Harness Implementation Decision Rule

Teacher generator routes may show a review-only package writer harness implementation decision after the implementation proposal. The decision preview names required evidence, file scope rules, decision options, next records, and blocked actions before any harness code can be considered.

The decision preview cannot approve harness implementation, create package writer harness code, run automated writer tests, run mutation browser checks, upload evidence, capture signed approval, patch app files, write generated package JSON, mutate route registries, create media playlists, package local bundles, activate assignments, mutate production QR redirects, or accept support-language-only implementation decisions. It is a manual Codex decision preview, not an approval workflow.

MiniStar decision previews must keep English as the target-language assembly trigger and preserve hiragana-only Japanese support as support-only.

The backend-neutral storage contract is `ai_generated_package_writer_harness_implementation_decision` / `ai-generated-package-writer-harness-implementation-decision`. Hosted and local adapters must preserve required evidence, file-scope rules, decision options, reviewer identity requirements, next records, linked implementation proposal, linked harness plan, linked evidence packet, and blocked actions while blocking harness approval, harness implementation, writer test execution, mutation browser runs, evidence upload, signed approval capture, app patches, generated package JSON writes, route registry writes, media playlist writes, local bundle packaging, assignment activation, production QR redirect mutation, and support-language-only implementation decisions.

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

## Generated Game Build Brief Rule

Teacher generator routes may show `ai_generated_game_build_brief` packets for external prototype builders such as Z.ai. A build brief must name the target mode, parent engine, JSON fixture shape, `standard_event_contract`, `audio_cue_manifest`, deterministic scoring contract, integration notes, deliverables, and blocked actions.

Build briefs are not production work orders. They cannot promote standalone games, bypass parent engines, write generated game routes, override scoring profiles, assign students, or allow Phaser builds to skip the LivingTextbook wrapper and event contract. MiniStar briefs must keep Japanese support-language scoring and release blocked.

The backend-neutral storage contract is `ai_generated_game_build_brief` / `ai-generated-game-build-brief`. Hosted and local adapters must preserve parent-engine binding, standard event contract, audio cue manifest, deterministic scoring contract, integration notes, deliverables, and blocked actions while blocking standalone game promotion, Phaser bypass, generated game route writes, scoring profile overrides, direct student assignment, media-only progress, and support-language-only scoring or release.

## External Prototype Task Packet Rule

Teacher generator routes may show `ai_external_prototype_task_packet` previews after generated build briefs and before returned prototype reviews. These packets convert strict build briefs into copy-ready task instructions for outside builders such as Z.ai while remaining review-only.

The task packet must name source records, permitted handoff contents, required-before-handoff checks, mode tasks, repository scope, output-folder rules, fixture requirements, standard events, target-language audio coverage, deterministic scoring, deliverables, return evidence, and blocked actions.

The external task packet cannot start a live handoff, write app files, create routes, grant scoring authority, write rewards, create playlists, assemble packages, assign students, or create student-facing previews. It must scope outside prototype output to `Drewsure/ministar-lab only` until Codex integration review accepts a wrapper-first plan. MiniStar task packets must block Japanese support-language progress while English remains the target-language trigger.

The backend-neutral storage contract is `ai_external_prototype_task_packet` / `ai-external-prototype-task-packet`. Hosted and local adapters must preserve repository scope, permitted handoff contents, required-before-handoff checks, mode tasks, standard event contract, audio cue manifest, deterministic scoring snapshot, return evidence requirements, and blocked handoff actions while blocking live handoff, app file writes, external-builder scoring authority, route creation, reward inventory writes, playlist creation, package assembly, student assignment, student-facing preview, student-ready markers, and support-language progress.

## External Prototype Task Export Readiness Rule

Teacher generator routes may show a review-only external prototype task export readiness gate after the task packet. The gate defines what must be true before any future prompt copy, repository issue creation, archive download, or outside-builder handoff exists.

The gate must require reviewer identity, evidence storage, durable task packet storage, external-builder repository policy, return-review intake, and Codex owner confirmation. It must block task export, prompt copy action, repository issue creation, archive download, live handoff, app writes, route creation, scoring authority, student-facing pathway, and support-language progress. MiniStar gates must keep Japanese support-language progress blocked while English remains the target-language trigger.

The backend-neutral storage contract is `ai_external_task_export_readiness_gate` / `ai-external-task-export-readiness-gate`. Hosted and local adapters must preserve export channels, readiness checks, blocked export actions, reviewer identity requirement, evidence storage requirement, external repository policy requirement, return-review intake requirement, and Codex owner confirmation requirement while blocking task export, prompt copy, repository issue creation, archive download, live handoff, app writes, route creation, scoring authority, student-facing pathways, and support-language progress.

## Prototype Return Review Rule

Returned prototype work from Z.ai or any outside builder must enter an `ai_prototype_return_review` preview before integration. The review must name the source build brief, returned artifacts, required evidence, parent-engine wrapper review, JSON fixture conformance, standard event replay, audio cue coverage, deterministic scoring, mobile accessibility, white-label fit, and blocked actions.

Returned prototypes cannot be merged into production, write route registry entries, mutate scoring profiles, mutate audio manifests, create assignments, or create student-facing previews from returned code. Phaser returns must still prove they can wrap the LivingTextbook parent-engine, JSON, audio, scoring, and event contracts.

The backend-neutral storage contract is `ai_prototype_return_review` / `ai-prototype-return-review`. Hosted and local adapters must preserve returned artifact evidence, parent-engine wrapper review, JSON fixture conformance, standard event replay, audio cue coverage review, deterministic scoring review, mobile accessibility review, and white-label fit while blocking production merge, route writes, scoring mutations, audio manifest mutations, direct assignment, and student-facing prototype previews.

## Prototype Integration Plan Rule

Prototype integration plans must stay wrapper-first and review-only. A plan may show quarantine, wrapper adapter proposal, JSON fixture replay, standard event replay, target-language audio coverage, deterministic scoring replay, mobile accessibility inspection, white-label theme injection, and Codex integration decision requirements.

Prototype integration plans cannot import returned files into `apps/web`, write route registry entries, mutate game sequences, mutate scoring profiles, mutate audio manifests, promote packages, assign students, or treat prototype evidence as package-ready. Phaser and other premium surfaces must remain removable wrappers around the LivingTextbook parent-engine contract.

The backend-neutral storage contract is `ai_prototype_integration_plan` / `ai-prototype-integration-plan`. Hosted and local adapters must preserve wrapper adapter review, fixture replay report, event replay report, audio coverage report, scoring replay report, mobile accessibility review, integration lanes, test harness requirements, next review records, and mode integration plans while blocking direct app import, route writes, game sequence mutation, scoring mutation, audio manifest mutation, package promotion, and direct assignment.

## Prototype Wrapper Adapter Review Rule

Prototype wrapper adapter reviews must prove that a returned prototype can be a removable wrapper around a LivingTextbook parent engine. The review must name fixture input contract, standard event output contract, state ownership rules, wrapper evidence, rejection triggers, and blocked actions.

The wrapper may own transient local interaction and animation state only. It cannot own route state, score authority, audio manifest authority, assignment or learner identity, reward inventory writes, tenant branding, or package promotion. Hard-coded vocabulary, sentences, tenant media, mascot, event bypass, support-language progress triggers, hidden control text, route or assignment side effects, or direct score and reward writes reject the wrapper.

The backend-neutral storage contract is `ai_prototype_wrapper_adapter_review` / `ai-prototype-wrapper-adapter-review`. Hosted and local adapters must preserve parent-engine adapter boundary, fixture input contract, standard event output contract, state ownership rules, wrapper evidence, rejection triggers, and blocked actions while blocking event contract bypass, tenant hard-coding, route state ownership, score authority, audio manifest authority, reward inventory writes, support-language progress triggers, direct app imports, package promotion, and assignments.

## Prototype Fixture Replay Report Rule

Prototype fixture replay reports must prove that returned prototypes load reviewed JSON fixtures rather than hard-coded unit text, tenant visuals, audio, scoring, rewards, routes, or support-language shortcuts.

The report must show fixture coverage, input assertions, output assertions, replay evidence, failure triggers, and blocked actions. It must preserve 8-12 vocabulary terms, exactly 2 target sentences, target-language-only progress, support-only assist language, target-language audio cue references, tenant theme injection, and standard event output while blocking live model calls, direct app imports, route writes, scoring/audio mutation, reward writes, student assignment, and support-language scoring or release.

The backend-neutral storage contract is `ai_prototype_fixture_replay_report` / `ai-prototype-fixture-replay-report`. Hosted and local adapters must preserve reviewed unit JSON fixture id, fixture coverage, input/output assertions, replay evidence, failure triggers, and blocked actions while blocking hard-coded unit text, tenant hard-coding, support-language progress triggers, score authority, audio manifest authority, reward inventory writes, direct app imports, package promotion, and assignments.

## Prototype Event Replay Report Rule

Prototype event replay reports must prove that returned prototypes emit the LivingTextbook standard event contract rather than hidden local progress, direct score authority, direct reward writes, route mutations, report exports, playlist writes, local bundle writes, or assignment side effects.

The report must show standard event coverage, required event order, allowed payload fields, accepted progress effects, failure triggers, and blocked actions. Target-language events are the only learning progress candidates; support-language, media-only, and background-audio events must remain support-only.

The backend-neutral storage contract is `ai_prototype_event_replay_report` / `ai-prototype-event-replay-report`. Hosted and local adapters must preserve standard event contract id, progress event acceptance map id, standard event coverage, required event order, allowed payload fields, accepted progress effects, failure triggers, and blocked actions while blocking hidden progress streams, score authority, reward inventory writes, route state ownership, report exports, playlist writes, local bundle writes, support-language progress triggers, direct app imports, package promotion, and assignments.

## Prototype Audio Coverage Report Rule

Prototype audio coverage reports must prove that returned prototypes cover every learner-facing target-language text with tap-to-speak or replay audio before integration. The report must cover vocabulary terms, target sentences, instructions, feedback, and critical controls.

The report must preserve `prototype_audio_coverage_report`, `audio_cue_manifest`, `package_game_audio_coverage`, and `background_media_policy_binding` references while showing target-language audio checks, control audio checks, support-language rules, replay evidence, missing cue triggers, and blocked actions.

Prototype audio reports cannot generate voice, trigger voice API cost, mutate audio manifests, write playlists, mark package audio complete, count media-only listening as mastery, let support-language audio unlock progress, or assign students. MiniStar reports must keep Japanese support audio hiragana-only for early levels and unable to unlock English progress.

The backend-neutral storage contract is `ai_prototype_audio_coverage_report` / `ai-prototype-audio-coverage-report`. Hosted and local adapters must preserve audio cue manifest id, package game audio coverage id, background media policy binding id, required cue families, target-language audio checks, control audio checks, support-language audio rules, replay evidence, failure triggers, and blocked actions while blocking generated voice calls, voice API cost, audio manifest mutation, playlist writes, media-only mastery, support-language progress triggers, package audio-complete markers, direct app imports, package promotion, and assignments.

## Prototype Mobile Accessibility Report Rule

Prototype mobile accessibility reports must prove that returned prototypes are safe for phone-first QR classrooms before integration. The report must show mobile viewport smoke evidence, touch target checks, keyboard and focus checks, readable text checks, visual stability checks, and blocked actions.

The report must preserve `prototype_mobile_accessibility_report`, `activity_compatibility_snapshot`, `template_rendering_profile`, `font_accessibility_profile`, and `standard_event_contract` references while proving that learner controls have visible text, accessible names, adequate touch targets, no color-only state, no hidden black-button text, no viewport overflow, and no unreadable learner controls.

Prototype mobile/accessibility reports cannot create student-facing previews, import files into `apps/web`, write route registry entries, waive accessibility because a prototype looks polished, assign students, or allow Phaser/canvas wrappers without accessible DOM controls. MiniStar reports must keep early Japanese support text hiragana-readable and unable to unlock English progress.

The backend-neutral storage contract is `ai_prototype_mobile_accessibility_report` / `ai-prototype-mobile-accessibility-report`. Hosted and local adapters must preserve activity compatibility snapshot id, template rendering profile id, font accessibility profile id, standard event contract id, viewport evidence, touch target checks, keyboard/focus checks, readable text checks, visual stability checks, wrapper control checks, failure triggers, and blocked actions while blocking accessibility waivers, student-facing previews, direct app imports, route writes, package promotion, and assignments.

## Prototype Scoring Replay Report Rule

Prototype scoring replay reports must prove that returned prototypes report answer evidence through the parent scoring profile rather than owning score, Star Dust, mastery, rewards, or package state.

The report must preserve `prototype_scoring_replay_report`, `game_scoring_profile_snapshot`, `progress_event_acceptance_map`, `collection_unlock_binding`, and `standard_event_contract` references while showing deterministic scoring replay, score inputs, score replay checks, mastery replay checks, reward boundary checks, failure triggers, and blocked actions.

Prototype scoring reports cannot mutate scoring profiles, write Star Dust, own direct score authority, write reward inventory, generate random rewards or gacha, count media-only activity as Star Dust, let support-language-only activity become mastery, promote packages, or assign students. MiniStar reports must keep Japanese support-language scoring and release blocked while English remains the target-language trigger.

The backend-neutral storage contract is `ai_prototype_scoring_replay_report` / `ai-prototype-scoring-replay-report`. Hosted and local adapters must preserve game scoring profile snapshot id, progress event acceptance map id, collection unlock binding id, standard event contract id, deterministic scoring replay, score replay checks, mastery replay checks, reward boundary checks, failure triggers, and blocked actions while blocking direct score authority, scoring profile overrides, Star Dust writes, reward inventory writes, random rewards, media-only mastery, support-language mastery, package promotion, and assignments.

## Prototype Codex Integration Decision Rule

Prototype Codex integration decisions must remain manual, review-only, and blocked until wrapper adapter review, fixture replay report, event replay report, audio coverage report, mobile accessibility report, scoring replay report, and integration readiness gate evidence are reviewed.

The decision preview cannot generate `apps/web` patches, import returned code, write route registry entries, create student-facing routes, mutate scoring profiles, write Star Dust or rewards, mutate audio manifests, promote packages, or assign students. Decision options may be shown for review, but no decision is recorded until all evidence passes and Codex completes manual review.

MiniStar Codex decisions must keep Japanese support language support-only and hiragana-safe for early levels while English remains the target-language trigger.

The backend-neutral storage contract is `codex_integration_review_decision` / `codex-integration-review-decision`. Hosted and local adapters must preserve linked integration plan, linked readiness gate, selected decision, decision status, no-decision/decision-recorded state, manual Codex review requirement, all-evidence-reviewed state, reviewer identity requirement, decision options, decision evidence checks, and blocked actions while blocking app patch generation, direct imports, route writes, student-facing routes, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, package promotion, and assignments.

## Prototype Integration Readiness Gate Rule

Prototype integration readiness gates must roll up all review evidence before any returned prototype can propose an `apps/web` integration patch. The gate must show wrapper adapter review, fixture replay report, event replay report, audio coverage report, mobile accessibility report, scoring replay report, and Codex integration review decision requirements in one teacher/admin-visible place.

The gate remains review-only until every evidence check is reviewed and a Codex decision exists. Missing evidence must block direct app imports, route registry writes, student-facing routes, scoring profile mutation, Star Dust or reward writes, audio manifest mutation, package promotion, and student assignment.

MiniStar readiness gates must keep Japanese support language hiragana-only for early levels and support-only. English remains the target-language trigger for scoring, mastery, reward, and release readiness.

The backend-neutral storage contract is `ai_prototype_integration_readiness_gate` / `ai-prototype-integration-readiness-gate`. Hosted and local adapters must preserve linked integration plan, wrapper adapter review, fixture replay report, event replay report, audio coverage report, mobile accessibility report, scoring replay report, Codex integration review decision, evidence readiness checks, all-evidence-reviewed state, and blocked actions while blocking app patches, direct imports, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, and assignments.

## Prototype App Patch Proposal Rule

Prototype app patch proposals must remain review-only until an accepted Codex integration review decision, all-evidence readiness gate, reviewer identity/signature gate, and release-control binding exist. The proposal may show future file scope, wrapper boundaries, fixture-only data paths, route preview scope, verifier/test gates, and rollback requirements, but it cannot write files.

The proposal preview blocks app file writes, generated route writes, student-facing routes, scoring or reward mutation, audio manifest mutation, package promotion, and assignment. MiniStar proposals also block Japanese support-language triggers; English remains the target-language trigger.

The backend-neutral storage contract is `ai_prototype_app_patch_proposal` / `ai-prototype-app-patch-proposal`. Hosted and local adapters must preserve proposed file scope, required pre-patch gates, required test gates, rollback requirements, reviewer identity/signature requirement, release-control binding, and blocked patch actions while blocking app file writes, app patch generation, direct imports, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress.

## Prototype Patch Test Readiness Rule

Prototype patch test readiness gates must remain review-only until a future patch test harness, route safety release gate, rollback drill record, storage contract verification, and Codex patch approval decision exist.

The gate must name fixture replay, standard event replay, target-language audio, mobile accessibility, deterministic scoring, route safety, storage contract, and rollback checks. It cannot execute tests, write app files, mutate route aliases, change scoring or rewards, mutate audio manifests, promote packages, assign students, or allow support-language progress. MiniStar gates must also prove Foundation Japanese support stays hiragana-only and support-only.

The backend-neutral storage contract is `ai_prototype_patch_test_readiness_gate` / `ai-prototype-patch-test-readiness-gate`. Hosted and local adapters must preserve required test lanes, rollback requirements, patch test harness plan, route safety release gate, rollback drill record, storage contract verification, Codex patch approval decision, and blocked actions while blocking test execution, app file writes, app patch generation, route writes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress.

## Prototype Patch Test Harness Plan Rule

Patch test harness plans must remain design-only until a future implementation proposal, route safety release gate, rollback drill record, storage contract verification, and Codex patch approval decision exist. The plan may name fixture replay, standard event, target-language audio, mobile accessibility, deterministic scoring, route safety, storage contract, rollback, and support-language boundary checks, but it cannot run tests, invoke Playwright, write app files, generate patches, mutate routes, change scoring or rewards, mutate audio manifests, promote packages, assign students, or trigger support-language progress.

The backend-neutral storage contract is `ai_prototype_patch_test_harness_plan` / `ai-prototype-patch-test-harness-plan`. Hosted and local adapters must preserve runtime policy, required inputs, harness sections, non-execution outputs, and blocked harness actions while blocking test execution, Playwright runs, app file writes, app patch generation, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress.

## Prototype Patch Harness Implementation Proposal Rule

Patch harness implementation proposals must remain review-only until Codex approves file scope, route safety, rollback, storage, reviewer identity, and patch approval records. The proposal may name future harness manifest adapters, assertion maps, mobile checklists, route smoke checklists, storage checklists, and rollback checklists, but it cannot implement a harness, run tests, invoke Playwright, write app files, generate patches, mutate routes, expose student-facing routes, change scoring or rewards, mutate audio manifests, promote packages, assign students, or trigger support-language progress.

The backend-neutral storage contract is `ai_prototype_patch_harness_implementation_proposal` / `ai-prototype-patch-harness-implementation-proposal`. Hosted and local adapters must preserve proposed file scope, implementation boundaries, required review gates, dry-run-only checks, next required records, and blocked implementation actions while blocking harness implementation, test execution, Playwright runs, app file writes, app patch generation, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress.

## Prototype Codex Patch Approval Decision Rule

Codex patch approval decisions must remain review-only until patch file scope, patch test readiness, harness plan, harness implementation proposal, route safety, rollback, storage verification, and reviewer identity signature evidence are reviewed.

The decision preview may show options such as keeping the patch blocked, approving patch planning only, returning for evidence repair, or rejecting the patch scope. A visible option is not an approval record. Until a future storage contract and signed approval workflow exist, no Codex patch approval is recorded.

The preview cannot write app files, generate patches, execute tests, invoke Playwright, mutate routes, expose student-facing routes, change scoring or rewards, mutate audio manifests, promote packages, assign students, or trigger support-language progress. MiniStar patch approval decisions must keep Foundation Japanese support hiragana-only and support-only while English remains the progress trigger.

The backend-neutral storage contract is `codex_patch_approval_decision` / `codex-patch-approval-decision`. Hosted and local adapters must preserve linked patch proposal, patch test readiness gate, harness plan, harness implementation proposal, route safety release gate, rollback drill record, storage verification, reviewer identity signature gate, selected decision, decision status, approval evidence checks, decision options, and blocked patch actions while blocking app file writes, patch generation, test execution, Playwright runs, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress.

## Prototype Signed Approval Preflight Rule

Signed approval preflights must remain review-only until a future storage contract, reviewer identity signature gate, evidence attachment storage, route safety release gate, rollback drill record, and storage verification are accepted.

The preflight may name authenticated reviewer identity, tenant role binding, Codex reviewer acknowledgement, approval scope, approval intent fields, evidence checklist, and scope locks. It cannot capture a signature, show an approve button, approve a patch, generate a patch, write app files, execute tests, invoke Playwright, mutate routes, expose student-facing routes, change scoring or rewards, mutate audio manifests, promote packages, assign students, or trigger support-language progress.

MiniStar signed approval preflights must keep Foundation Japanese support hiragana-only and support-only while English remains the progress trigger.

The backend-neutral storage contract is `ai_prototype_signed_approval_preflight` / `ai-prototype-signed-approval-preflight`. Hosted and local adapters must preserve linked Codex patch approval decision, reviewer identity signature gate, route safety release gate, rollback drill record, storage verification, required identity lanes, scope locks, approval record draft fields, evidence checklist, cannot-approve blockers, next required records, and blocked approval actions while blocking signed approval capture, approve buttons, patch authorization, app file writes, patch generation, test execution, Playwright runs, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress.

## Prototype Patch Authorization Release Lock Rule

Patch authorization release locks must remain review-only until signed approval acceptance, release-control binding, patch file scope, patch test evidence, route safety, rollback, storage verification, and reviewer identity evidence are accepted.

The lock may name required release locks, authorization scope, forbidden-until-unlocked conditions, release evidence, blocked actions, and next required records. It cannot authorize patches, write app files, generate patches, execute tests, invoke Playwright, mutate routes, expose student-facing routes, change scoring or rewards, mutate audio manifests, promote packages, assign students, or trigger support-language progress.

MiniStar patch authorization release locks must keep Foundation Japanese support hiragana-only and support-only while English remains the progress trigger.

The backend-neutral storage contract is `ai_prototype_patch_authorization_release_lock` / `ai-prototype-patch-authorization-release-lock`. Hosted and local adapters must preserve linked signed approval preflight, Codex patch approval decision, release-control binding, route safety release gate, rollback drill record, storage verification, reviewer identity signature gate, required release locks, authorization scope, forbidden-until-unlocked blockers, release evidence, next required records, and blocked patch actions while blocking patch authorization, app file writes, patch generation, test execution, Playwright runs, route writes, student-facing routes, scoring mutations, Star Dust or reward writes, audio manifest mutation, package promotion, assignments, and support-language progress.

## Prototype Patch Implementation Work Order Rule

Patch implementation work orders must remain review-only until signed approval acceptance, patch authorization release lock acceptance, release-control binding, patch test evidence, route safety, rollback, storage verification, and reviewer identity evidence are accepted.

The backend-neutral storage contract is `ai_prototype_patch_implementation_work_order` / `ai-prototype-patch-implementation-work-order`. Hosted and local adapters must preserve required-before-work records, allowed future file groups, dry-run verification order, rollback plan, route safety, rollback drill, storage verification, reviewer identity, release-lock binding, and blocked work-order actions while blocking work order execution, app file writes, generated patches, test execution, Playwright runs, generated route writes, student-facing routes, scoring or reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress.

The work order may name required-before-work records, allowed future file groups, dry-run verification order, rollback plan, blocked actions, and next required records. It cannot execute a work order, write app files, generate patches, execute tests, invoke Playwright, mutate routes, expose student-facing routes, change scoring or rewards, mutate audio manifests, promote packages, assign students, or trigger support-language progress.

MiniStar patch implementation work orders must keep Foundation Japanese support hiragana-only and support-only while English remains the progress trigger.

## Prototype Patch Change Set Preview Rule

Prototype patch change set previews must remain review-only until a stored work order, work-order execution authorization, patch fixture archive, rollback snapshot, and human reviewer sign-off exist.

The preview may name planned file changes, wrapper boundaries, fixture mapping files, event/audio test files, invariant checks, review blockers, blocked actions, and next required records. It cannot apply a patch, write app files, generate files, run tests, invoke Playwright, create routes, mutate scoring or rewards, mutate audio manifests, promote packages, assign students, or trigger support-language progress.

MiniStar patch change set previews must keep Foundation Japanese support hiragana-only and support-only while English remains the progress trigger.

The backend-neutral storage contract is `ai_prototype_patch_change_set_preview` / `ai-prototype-patch-change-set-preview`. Hosted and local adapters must preserve linked implementation work order, planned file changes, invariant checks, review blockers, next required records, route safety, rollback drill, storage verification, reviewer identity, and blocked change-set actions while blocking apply-patch actions, app file writes, generated file writes, test execution, Playwright runs, generated route writes, student-facing routes, scoring or reward mutation, audio manifest mutation, package promotion, assignments, and support-language progress.

## Mode Recommendation Rule

Generator mode recommendations must reuse the reviewed activity compatibility matrix. The generator can recommend a tight pathway for a unit, but it must not produce a broad switch panel or unsupported conversions. Blocked conversions stay visible with their payload-fit and compatibility-rule reasons.

## Audio Coverage Planner Rule

Generated game requests must produce an `ai_audio_coverage_plan` before review. The plan must enumerate target-language term audio, sentence audio, instruction audio, feedback audio, and critical control audio; name the `audio_cue_manifest` and `package_game_audio_coverage` records; keep support-language audio support-only; and block background music or video sound from counting toward mastery. Live synthetic voice generation and voice API cost remain blocked until a tenant approves the premium package and storage/review controls exist.

## Target-Language Audio Approval Packet Rule

Teacher generator routes must show a review-only target-language audio approval packet before package teacher review can be treated as complete. The packet names the exact learner-facing term, sentence, instruction, feedback, control, support-language, and background-media policy cues that need review.

The packet cannot capture audio approval, generate voice, bill a speech or voice API, mark package audio complete, create routes, create playlists, assign students, or count media-only listening as progress. Support-language audio remains support-only and cannot unlock progress, mastery, Star Dust, package approval, or student-ready state.

MiniStar audio approval packets must preserve English as the target-language trigger. Foundation/Bronze/Plus Japanese support must remain hiragana-only and support-only.

The backend-neutral storage contract is `target_language_audio_approval` / `target-language-audio-approval`. Hosted and local adapters must preserve cue-level review items, progress boundaries, audio cue manifest links, package game audio coverage links, support-language audio rules, required coverage, approval checks, and blocked actions while blocking approval capture, voice generation, speech API billing, package audio-complete markers, route registry writes, media playlist writes, assignments, media-only progress, and support-language progress.

## Gamification Mapping Rule

Generated game requests must produce an `ai_gamification_mapping_plan` before review. The plan must name accepted game events, Star Dust allocation lanes, mastery thresholds, `game_scoring_profile_snapshot`, `progress_event_acceptance_map`, and `collection_unlock_binding` records. AI generation cannot create random rewards, generated gacha, purchase-like unlocks, support-language-only mastery, media-only Star Dust, or unreviewed score profiles.

The shared `validateAiGamificationMappingPlan` contract must enforce the 1,000 Star Dust unit cap, 750 Star Dust unit mastery threshold, 3,000 Star Dust module threshold, scoring lanes that total exactly 1,000 Star Dust, deterministic collection unlock bindings, accepted reward trigger events, required gamification records, and blocked reward actions. The generator route must show gamification guard blocks and warnings before any reward readiness, package approval, route creation, playlist creation, assignment, collection inventory write, Spin Wheel ticket issuance, or avatar evolution write can exist.

## Reward Readiness Gate Rule

Generated game requests must pass an `ai_reward_readiness_gate` before any reward publishing, collection inventory write, Spin Wheel ticket issuance, avatar evolution write, or student assignment exists.

The gate must preserve the 1,000 Star Dust unit cap, 75% mastery thresholds, deterministic collection unlocks, accepted learning-event sources, shared gamification mapping guard clearance, correction-queue clearance, `game_scoring_profile_snapshot`, `progress_event_acceptance_map`, `collection_unlock_binding`, and `earned_collection_inventory` records. Generated surprise rewards remain blocked.

The backend-neutral storage contract is `ai_reward_readiness_gate` / `ai-reward-readiness-gate`. Hosted and local adapters must preserve deterministic reward checks while blocking reward publishing, collection inventory writes, generated surprise rewards, Spin Wheel ticket issuance, avatar evolution writes, and student assignment.

## Verifier Submission Packet Rule

Generated game requests must produce an `ai_verifier_submission_packet` before teacher approval. The packet must include schema validation, pedagogical lock, target-language progression, audio coverage, engine binding, gamification mapping, activity compatibility, media-rights, and teacher-approval checks.

Verifier submission, generated package approval, route creation, playlist creation, assignment creation, and student-ready marking remain blocked until durable verifier storage, reviewer identity, media evidence attachments, audio cue approval, approval ledger binding, and release-control binding exist.

## Generated Package Teacher Review Packet Rule

Teacher generator routes may show an AI generated package teacher review packet after verifier packet planning and before generated package manifests. The packet is a teacher approval prep surface: it gathers generated content fit, target-language audio, curated activity pathway, deterministic rewards, media-rights evidence, support-language boundaries, verifier readiness, missing evidence, blocked actions, and next required records into one readable review packet.

The packet cannot capture teacher approval, assemble packages, write route registry entries, create playlists, create assignments, write local bundles, mark packages student-ready, or treat support-language activity as progress evidence. It must keep `teacher_approval_ledger`, `media_rights_evidence_attachment`, `target_language_audio_approval`, `release_control_binding`, and `assignment_rollout_gate` visible as future records.

MiniStar teacher review packets must preserve English target-language audio as the approval trigger. Foundation Japanese support must remain hiragana-only and support-only; Japanese support-language text, audio, or taps cannot unlock progress, satisfy mastery, approve package assembly, create playlists, create routes, or mark the generated unit student-ready.

The backend-neutral storage contract is `ai_generated_package_teacher_review_packet` / `ai-generated-package-teacher-review-packet`. Hosted and local adapters must preserve teacher decision lanes, ready signals, missing evidence, blocked actions, next required records, target-language audio approval needs, media-rights evidence needs, teacher approval ledger needs, release-control binding needs, and assignment rollout needs while blocking approval capture, generated package assembly, route registry writes, media playlist writes, assignments, local bundle writes, student-ready markers, and support-language progress.

## Review Queue Integration Rule

Generated draft packages must enter the standard teacher draft review queue as read-only queue items. They must show source lineage, verifier packet requirements, target-language audio blockers, media-rights blockers, engine/gamification checks, blocked route and playlist creation, blocked assignment, and blocked approval. The queue must not give AI drafts a shortcut around the same review and approval gates used for teacher-created drafts.

MiniStar generated drafts must enter this same queue with MiniStar-specific source lineage, English target-language audio blockers, hiragana-only Japanese support review, media-rights blockers, verifier blockers, approval blockers, and assignment blockers.

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
