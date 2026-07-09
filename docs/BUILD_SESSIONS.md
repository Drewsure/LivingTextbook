# Living Textbook Planned Build Sessions

This document gives the project an explicit build-session structure. It should be reviewed when choosing the next work block and updated as the platform matures.

The structure follows the standing rule: foundation first, interaction second, premium polish third.

## Session 0: Standards And Decisions Gate

Purpose: Ensure the project still follows the white-label saleable platform direction before work begins.

Required reads:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md`
- `docs/FUTURE_REQUIREMENTS.md`
- `docs/OPERATING_NOTES.md`
- `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` when major custom systems or external assets are being considered

Outputs:

- Any new principle or decision is documented.
- Any recurring workaround is documented.
- Any major architecture choice is entered in the decision register.
- Any public-repository or public-asset candidate has license/provenance review before adoption.

## Session 1: First Vertical Slice

Purpose: Prove teacher QR launch, student entry practice, progression events, deterministic rewards, audio-supported learner text, and the first playable game path.

Current status: Implemented on `legacy-source-import`. Local typecheck/build/browser verification passed after fresh clone, dependency install, and local route checks for `/`, `/teacher`, `/launch/demo-unit-1`, and `/enter/ministar`. Missing demo media files are expected placeholder 404s and are handled by the UI.

Implemented path:

Teacher launch -> QR route -> flashcards -> tap-to-speak learner text -> completion event -> reward preview -> Memory Match unlock -> game_started -> playable Memory Match -> game_completed -> Star Dust update -> reusable unit-session summary.

Implemented front-door expansion:

Permanent/front-door QR contract -> entry-code/user-code option -> sample multimedia package -> native audio/video playback shell plus manual media progress controls -> optional background media events -> student unit-session summary -> teacher-visible progress summary.

Remaining gate:

- Repeat local typecheck/build after each connector-side change is pulled.
- Run mobile verification against `docs/VERIFICATION_CHECKLIST.md`.
- Replace placeholder media files or keep clear unavailable-source messaging for demo assets.

## Session 2: Game Engine Foundation

Purpose: Turn Memory Match into the first reusable `pairing` parent engine implementation and use it as the pattern for future game modes.

Current status: Initial playable pairing implementation exists and has been locally browser-verified in the first slice. Memory Match uses pairing adapter/state helpers, emits start/completion events, emits item-level `round_shown`, `answer_submitted`, `answer_result`, and `mastery_updated` events, supports card tap-to-hear audio, uses a shared scoring profile, and updates local progression. Quiz adds the first playable selection route at `/quiz/[code]` before arcade skins and now appears in teacher monitor sample events. Selection and text-spelling previews now show parent-engine contracts. Sentence Builder adds the first playable text-spelling route at `/sentence/[code]`, is visible in route contracts, the game sequence, and the unit game offer map, and now appears in teacher monitor sample events. Speak It now adds the first core speech-practice shell with optional local microphone record/replay, no upload, no transcript, and no AI Tutor dependency.

Required gate:

- Check `docs/GAME_ENGINE_CONTRACTS.md`.
- Check public repository research requirement before major reinvention.
- Check license/provenance before adopting any outside game code or assets.

Next outputs:

- Stronger event metadata if teacher reports need item-level detail.
- Additional scoring profiles for the next selected parent engine or mode.
- Browser-verify Quiz at `/quiz/demo-unit-1` and `/quiz/partner-demo-unit-1`.
- Browser-verify Sentence Builder at `/sentence/demo-unit-1` and `/sentence/partner-demo-unit-1`.
- Browser-verify teacher demo route shortcuts at `/teacher`.
- Mobile verification.
- Compatibility with optional background/support media without requiring it.

## Session 2.5: Training Academy Recovery Lane

Purpose: Add the smallest deterministic recovery path before database persistence, AI Tutor, or premium polish.

Current status: Active local-state prototype exists on `legacy-source-import` at `/training/[code]`. It uses the shared launch/session/progression shape, reuses tap-to-speak audio support, awards small recovery Star Dust, records teacher-visible recovery metadata, returns the student to the normal unit route, includes a reusable teacher recovery summary adapter, includes deterministic recovery trigger logic in the student launch flow, and now supports focus-specific recovery configs. The front-door teacher report sample and teacher session monitor count recovery events from the same unified stream. Local typecheck/build is required after each connector-side change.

Implemented path:

Training recommendation -> configurable recovery focus -> tap-to-speak target items -> sentence pattern listening -> start review event -> answer submission/result metadata -> training completed -> small recovery Star Dust -> teacher recovery summary -> return-to-unit event -> link back to `/launch/[code]`.

Implemented trigger path:

Memory Match answer results -> repeated-miss detection -> one `training_recommended` event with trigger metadata -> learner-facing recovery card -> optional link to `/training/[code]`.

Implemented focus path:

Focus config contract -> Vocabulary, Sentences, Listening, Spelling, and Game practice lanes -> focus selection event -> generic target-item practice -> focus-specific reward cap.

Implemented report path:

Training metadata bridge -> recovery summary counts -> focus-change counts -> front-door teacher report metrics -> teacher session monitor metrics -> event list display using `trainingEventType` metadata.

Remaining gate:

- Pull latest `legacy-source-import` locally and run typecheck/build.
- Verify repeated-miss trigger on `/launch/demo-unit-1`.
- Verify focus selector on `/training/demo-unit-1`.
- Verify `training_focus_selected` metadata and teacher summary counts.
- Verify front-door recovery counts on `/enter/ministar`.
- Verify teacher session monitor counts recovery records on `/teacher/sessions/demo-unit-1`.
- Run mobile verification for `/launch/demo-unit-1`, `/training/demo-unit-1`, and `/teacher/sessions/demo-unit-1`.
- Promote dedicated Training Academy event types into `packages/content-model` only after the metadata bridge proves stable.

Next outputs:

- Teacher-facing trigger settings and thresholds after the local rule proves usable.
- Query-param or launch-session selected focus when a trigger points to a specific recovery lane.
- Persistence-backed report aggregation after storage policy is selected.

## Session 2.75: Reviewed Assist Language Foundation

Purpose: Make multilingual assist support part of the content-package foundation without hard-coding Japanese or depending on live AI translation.

Current status: Implemented on `legacy-source-import`. Shared content-model contracts, MiniStar tenant language settings, and a reviewed MiniStar Japanese sample plan are present. The repository owner pulled the connector-side change and reported local typecheck/build passing. Browser verification remains useful after each follow-up reporting change.

Implemented path:

Tenant language settings -> optional content-package assist language plan -> reviewed vocabulary and sentence glosses -> package summary visibility -> optional student-facing flashcard assist text -> tap-to-speak assist text.

Required gate:

- Pull latest `legacy-source-import` locally.
- Run typecheck/build.
- Verify `/` shows assist-language package status.
- Verify `/launch/demo-unit-1` and `/enter/ministar` show Japanese assist text under flashcard terms and target sentences.
- Confirm Japanese is package data, not hard-coded globally.
- Confirm live AI assist remains disabled for the core sample.

Next outputs:

- Teacher toggle/state for showing or hiding assist language.
- Assist-language review workflow for PDF/imported units.
- Optional recorded assist-language audio cues.
- Broader UI localization later, separate from learning-content assist.

## Session 3: Content Package And PDF Unit Onboarding

Purpose: Support white-label tenant curriculum intake from PDF units, teacher docs, or structured spreadsheets.

Current status: Active scaffold. `/teacher/intake` now shows source review queue, AI authoring/verifier handoff, reviewed source intake gates, package readiness, source-to-route decisions, route registry data, deployment profiles, package publish gates, package approval ledger, backend schema draft, backend migration candidates, backend migration specs, and persistence boundaries. Package publish gates and approval ledgers are named in the durable record map, and the backend schema, candidates, and specs now name the vendor-neutral path needed before backend-specific migration work. It remains a review concept, not an automatic PDF-to-student assignment pipeline.

Outputs:

- Content package model.
- PDF-derived unit metadata workflow.
- Human review step for imported units.
- AI authoring/verifier integration plan.
- AI authoring/verifier handoff that blocks unreviewed AI drafts from student assignment.
- Source review queue for raw PDF, DOCX, audio, video, and teacher-note handoff.
- Mapping from textbook page/unit to digital launch payload.
- Mapping from textbook page/unit/activity to multimedia assets and playlists.
- Mapping from textbook content to reviewed assist-language package data when tenants require it.

## Session 4: QR Registry And Route Permanence

Purpose: Make QR codes stable enough for printed textbooks and classroom materials.

Current status: Active scaffold. The front-door route resolver now uses tenant route registry data for MiniStar and the sample publisher. The persistence boundary now identifies the route registry as a durable backend requirement. Permanent textbook QR schema remains a future route contract and is now included in the backend schema draft, backend migration candidates, backend migration specs, package publish gate, and approval ledger as a release-blocking review domain. QR print readiness now separates demo/draft aliases from production textbook printing.

Outputs:

- Permanent QR id schema.
- Tenant/book/unit/activity route contract.
- Front-door entry-code/user-code route contract.
- Strategy for stable registry, optional hosted redirect, local app deep link, and offline fallback.
- Rules forbidding QR codes that point directly to fragile local file paths.
- QR print-readiness gates for textbook, workbook, and classroom-card publishing.

## Session 5: Multimedia Platform Foundation

Purpose: Add a white-label audio/video companion platform as part of the core Living Textbook package without hard-coding any one publisher's assets.

Current status: Sample multimedia content package, route concept, media event stream, native playback shell, manual progress fallback controls, optional background-media event controls, and media rights readiness exist. The persistence boundary now names media manifests, rights records, local bundle paths, hosted/local storage choices, package publish gates, and approval ledgers as first-class requirements. The backend schema draft and migration candidates name media manifests and rights as their own entity, with object/local storage separated from database metadata.

Outputs:

- Audio and video asset catalog.
- Unit-linked playlists.
- Optional unit/game background media settings.
- Native audio/video playback shell.
- Local/offline multimedia playback plan.
- Teacher and student multimedia launch routes.
- Media engagement events.
- Rights/ownership metadata fields.
- Media rights readiness gate for demo, pilot, background-media, and offline/local use.

## Session 6: Local/Closed Deployment Mode

Purpose: Package the same platform for closed local use when a publisher, school, or textbook partner needs a non-public installation.

Current status: Deployment profile, local deployment preflight, and persistence boundary scaffolds exist in `/teacher/intake`. Hosted PWA is the recommended first pilot path. Local classroom server and packaged local app remain first-class paths, but require offline media bundle, installer/update, sync/export, backup, local storage, approval audit handling, and QR/deep-link decisions before production. The backend schema draft preserves hosted/local vocabulary compatibility, and local classroom export/restore is intentionally deferred until hosted pilot schema is validated.

Outputs:

- Local app packaging recommendation.
- Offline asset bundle structure.
- Local storage/sync strategy.
- QR/deep-link behavior for installed apps.
- Update path for future content packages and multimedia packages.
- Local deployment preflight covering installer/update, media bundle, reporting/export, backup/restore, QR/deep-link, and offline access control.

## Session 7: Tenant Pilot Package

Purpose: Prepare a real partner pilot without polluting the MiniStar reference implementation.

Current status: Active scaffold. A white-label pilot readiness panel and partner timeline document define the practical partner promise: a testable pilot in roughly 8-12 weeks, with a narrower first scope than the eventual commercial product. A second sample tenant and partner-style content package prove the white-label path in code at `/partner-demo`, `/enter/sample-publisher`, `/launch/partner-demo-unit-1`, and `/speak/partner-demo-unit-1`. `/teacher/intake` adds reviewed source intake gates, tenant route registry data, deployment profile choices, package publish gate, package approval ledger, assignment rollout gates, release-control durable records, backend schema draft, backend migration candidates, backend migration specs, and persistence boundaries. `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1` now show teacher session preflight and monitor scaffolds on the shared event stream. The teacher session settings contract now separates safety failures from persistence warnings for audio, assist language, microphone approval, background media, AI Tutor, and reporting/retention.

Outputs:

- Tenant config.
- Sample imported units.
- Sample game payloads.
- Sample audio/video platform payloads.
- Sample unit playlist and optional game-background media setting.
- Sample assist-language package if required by the tenant.
- Package publish gate that separates demo-ready from pilot-publishable.
- Package approval ledger that names required human sign-offs.
- Assignment rollout gate that separates demo preview from scheduled pilot use.
- Durable record map entries for publish gates and approval ledgers.
- Vendor-neutral backend schema draft.
- Backend migration candidates.
- Backend migration specs.
- Pilot verification checklist.

Next outputs:

- Pull latest `legacy-source-import` locally and run typecheck/build after connector-side changes.
- Browser-verify the package publish gate, approval ledger, backend schema draft, backend migration candidates, backend migration specs, and persistence boundary at `/teacher/intake`.
- Browser-verify the teacher preflight and monitor settings contract at `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1`.
- Confirm safety failures and persistence warnings are displayed separately.
- Confirm the publish gate blocks release while media rights, report policy, deployment profile, persistence, and pilot package policy are unresolved.
- Confirm the approval ledger does not imply real signed approvals before authentication and persistence exist.
- Confirm the durable record map includes publish gate and approval ledger records.
- Confirm the backend schema draft includes tenant, package release, QR alias, media manifest, launch session, progress event, publish gate, and approval ledger entities.
- Confirm migration candidates sequence admin/release records before student progress storage.
- Confirm migration specs name primary keys, tenant scope, indexes, retention, export, local fallback, and policy blockers before backend-specific migrations.
- Decide whether the first partner pilot uses manually reviewed unit data or a draft PDF import workflow.
- Choose the actual first pilot backend only after privacy, reporting, release-control, schema, migration sequence, and deployment constraints are reviewed.

## Session 8: Premium Experience Layer

Purpose: Add polish only after the vertical slice, content package, QR strategy, multimedia foundation, game-engine foundation, Training Academy foundation, assist-language foundation, package publish gate, approval ledger, release-control durable records, backend schema draft, and backend migration candidates are stable.

Outputs:

- Visual asset direction.
- Micro-interactions.
- Avatar/reward presentation.
- Themed game skins.
- Sound feedback.
- Multimedia presentation polish.

## Session 9: Optional Premium AI Tutor Layer

Purpose: Preserve a saleable premium AI Tutor package for upper-level speaking, writing, correction, role play, and adaptive review without making the core platform depend on AI costs.

Current status: Strategy, ADRs, future requirement, standards, decision register entries, shared content-model contracts, tenant feature entitlement shape, disabled MiniStar sample entitlement, disabled Level 1 package plan, dashboard package status, and focused verification checklist exist on `legacy-source-import`. Active tutor UI, model calls, speech services, billing, and tutor routes remain explicitly deferred.

Required gate:

- Complete local build/browser verification of the foundation slice first.
- Confirm privacy, safety, transcript, usage-limit, and teacher-report rules before active tutor implementation.
- Select one upper-level unit before building the first tutor prototype.
- Keep AI Tutor premium-gated and disabled cleanly for tenants that do not adopt it.

Outputs:

- Tenant feature entitlement model.
- Unit-level tutor plan model.
- Upper-level tutor prototype route after foundation verification.
- Teacher-visible tutor summary events.
- Usage and cost controls.
- Safety and privacy verification.

## Build Session Rule

If a proposed task does not fit one of these sessions, document whether it is:

- a new required session,
- a future requirement,
- or a distraction from the current foundation path.

## Next Recommended Build Task

Do not add premium polish yet.

The hard gate is to keep typecheck/build passing after every route or package addition. The next safest task is local verification of `/teacher/intake`, `/teacher/sessions/demo-unit-1`, and `/teacher/sessions/partner-demo-unit-1`; after that, continue with backend-agnostic migration candidates, teacher session settings, package release-control refinement, and persistence-adapter work before choosing a real storage vendor.
