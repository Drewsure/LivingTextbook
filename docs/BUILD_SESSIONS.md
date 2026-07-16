# Living Textbook Planned Build Sessions

This document gives the project an explicit build-session structure. It should be reviewed when choosing the next work block and updated as the platform matures.

The structure follows the standing rule: foundation first, interaction second, premium polish third.

## Session 0: Standards And Decisions Gate

Purpose: Ensure the project still follows the white-label saleable platform direction before work begins.

Required reads:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md`
- `docs/FUTURE_REQUIREMENTS.md`
- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md` when teacher authoring, activity switching, printables, sharing, library, or competitor coverage is being discussed
- `docs/OPERATING_NOTES.md`
- `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` when major custom systems or external assets are being considered

Outputs:

- Any new principle or decision is documented.
- Any recurring workaround is documented.
- Any major architecture choice is entered in the decision register.
- Any public-repository or public-asset candidate has license/provenance review before adoption.
- `/teacher/intake` exposes the current foundation verification gate so partner/admin review can see the canonical command and what it protects.
- `/teacher/intake` exposes competitive feature coverage so teacher time-saving, curated activity pathways, private libraries, printables, and target-language expansion are visible during admin review.
- `/teacher/intake` exposes activity pathway compatibility so offered, planned, premium, teacher-review, and blocked outputs are visible before authoring or printables are built.
- `/teacher/intake` exposes printable output readiness so worksheet/PDF expectations are planned without pretending export is ready.
- `/teacher/intake` exposes private tenant library planning so community-resource expectations have a safe v1 workaround before public sharing.
- `/teacher/intake` exposes share/embed readiness so private assignment links can advance while public sharing and iframe embeds remain gated.
- Private assignment routes must remain focused assignment previews, not public activity pages, public community sharing, or iframe embeds.
- `/teacher/intake` exposes teacher authoring readiness so fast creation/editing remains draft-first and review-gated.
- `/teacher/intake` exposes target-language expansion readiness so Japanese-as-target-language and other non-English target-language opportunities are not confused with assist-language support.
- `/teacher/uploads/sample-publisher` exposes the dedicated upload workspace so file intake, review, promotion, Labelled Diagram image assets, and multimedia asset gates have a visible route boundary before live file pickers or storage are built.
- `/teacher/uploads/sample-publisher`, `/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram`, and `/teacher/assets/media/sample-publisher-l1-u1-routines-media` expose evidence packet flows before live file inputs, object/local storage, approval actions, publish actions, route creation, label editing, media transcoding, playlist creation, or assignment shortcuts are built.
- `/teacher/evidence/sample-publisher` exposes the tenant evidence packet review index so upload, Labelled Diagram, and media evidence blockers stay visible in one admin route before live evidence upload, signed approval capture, promotion, publishing, route creation, playlist creation, or assignment shortcuts are built.
- `/teacher/evidence/sample-publisher/handoff` exposes the evidence packet handoff preview so export packet shape, recipient duties, and next gates are visible before evidence export, signed approval capture, promotion, publishing, route creation, playlist creation, or assignment shortcuts are built.
- `/teacher/intake` exposes evidence export readiness so PDF, JSON, local manifest, email handoff, signature capture, release-state mutation, and student assignment remain blocked until identity, attachment storage, retention/export policy, and release-control gates are accepted.
- `/teacher/intake` exposes evidence attachment storage readiness so hosted object storage, closed local evidence folders, and hybrid export archives stay blocked until quarantine paths, checksums, malware scan status, retention, delete/export policy, access controls, backup responsibility, and release-control rules are accepted.
- `/teacher/intake` exposes evidence storage adapter selection so hosted managed storage can be treated as the controlled first-pilot recommendation while closed local evidence storage and hybrid archive movement remain explicit, policy-gated, higher-complexity options.
- `/teacher/intake` and `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate` expose the school policy handoff packet so privacy, QR use, progression rules, media ownership, dry-run evidence, storage, release, and rollback can be discussed before any school policy acceptance, signed approval, evidence export, launch-ready status, local activation, production QR promise, or live classroom workflow exists.
- `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` exposes the focused school meeting packet route so partner or school review can open the handoff packet directly without enabling policy acceptance, signed approval capture, evidence export, release mutation, production QR promises, local activation, report export, learner data, or live classroom launch.
- `/teacher/intake`, `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`, and `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` expose the school policy acceptance preflight before any accept button exists; it must keep approval identity, policy text, evidence attachment storage, release-control binding, support-language limits, microphone/AI Tutor opt-ins, storage activation, rollback, production QR promises, learner data, report export, and live classroom workflow blocked until explicit future implementation gates are accepted.
- `/teacher/intake`, `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate`, and `/teacher/policy-handoff/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate-school-policy-gate-handoff-packet` expose the school policy text version pack so privacy, retention, QR/progression, media/local package, microphone, AI Tutor, storage, rollback, evidence, signature, and revocation clauses are visible before any school acceptance text can be accepted or signed.
- Backend schema, migration candidates, migration specs, adapter plans, durable records, and persistence boundaries preserve `evidence_packet` and `evidence_attachment` before live evidence upload, signed approval capture, storage writes, attachment downloads, upload promotion, asset editing, media transcoding, playlist creation, local activation, release-state mutation, student-facing attachments, or assignment shortcuts are built.

## Session 1: First Vertical Slice

Purpose: Prove teacher QR launch, student entry practice, progression events, deterministic rewards, audio-supported learner text, and the first playable game path.

Current status: Implemented on `legacy-source-import`. Local typecheck/build/browser verification passed after fresh clone, dependency install, and local route checks for `/`, `/teacher`, `/launch/demo-unit-1`, and `/enter/ministar`. Missing demo media files are expected placeholder 404s and are handled by the UI.

Implemented path:

Teacher launch -> QR route -> flashcards -> tap-to-speak learner text -> completion event -> reward preview -> Memory Match/Quiz/Sentence Builder/Speak It unlock -> game_started -> playable Memory Match -> linked follow-on games -> game_completed -> Star Dust update -> reusable unit-session summary.

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
- Confirm Training Academy uses the shared white-label launch resolver before changing recovery routes.
- Confirm active route verification content-checks Training Academy, Quiz, Sentence Builder, and Speak It routes for both sample tenants.
- Browser-verify the package-linked media playlist at `/media/playlist-ministar-l1-u1-greetings`.
- Browser-verify teacher demo route shortcuts at `/teacher`.
- Mobile verification.
- Compatibility with optional background/support media without requiring it.
- Explicit package-level audio support coverage for every active student-facing game mode.
- Teacher/admin package readiness must show which active game modes have explicit audio coverage.
- Persistence adapter write intents must preserve reviewed package game/audio coverage snapshots before pilot release.
- Backend migration specs must include package game/audio coverage snapshots before vendor-specific migrations.

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

- Persistence-backed report aggregation after storage policy is selected.

## Session 2.75: Reviewed Assist Language Foundation

Purpose: Make multilingual assist support part of the content-package foundation without hard-coding Japanese or depending on live AI translation.

Current status: Implemented on `legacy-source-import`. Shared content-model contracts, MiniStar tenant language settings, a reviewed MiniStar Japanese sample plan, and a local teacher visibility toggle are present. Browser verification remains useful after each follow-up reporting change.

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

- Assist-language review workflow for PDF/imported units.
- Optional recorded assist-language audio cues.
- Broader UI localization later, separate from learning-content assist.
- Target-language expansion remains visible on `/teacher/intake`; Japanese target-language pilots stay blocked until script policy, segmentation, audio, input, and teacher review gates pass.
- Durable launch-session storage for the teacher assist-language visibility setting.

## Session 3: Content Package And PDF Unit Onboarding

Purpose: Support white-label tenant curriculum intake from PDF units, teacher docs, or structured spreadsheets.

Current status: Active scaffold. `/teacher/intake` now shows source review queue, AI authoring/verifier handoff, reviewed source intake gates, package readiness, source-to-route decisions, route registry data, deployment profiles, pilot release candidate summary, package publish gates, package approval ledger, backend schema draft, backend migration candidates, backend migration specs, and persistence boundaries. Package release candidates, publish gates, approval ledgers, upload intake/review/promotion records, and Labelled Diagram `game_asset_manifest` / `label_anchor_record` contracts are named in the durable record map, and the backend schema, candidates, and specs now name the vendor-neutral path needed before backend-specific migration work. `npm run verify:package-readiness` now guards sample package readiness for active game/audio coverage, media package expectations, front-door QR/access policy, support-language policy, and optional premium AI Tutor policy. It remains a review concept, not an automatic PDF-to-student assignment pipeline.

Teacher assignment readiness now shows the assigned game path for each sample plan so Quiz and Sentence Builder are visible in teacher/admin review before persistence exists.

Outputs:

- Content package model.
- PDF-derived unit metadata workflow.
- Human review step for imported units.
- AI authoring/verifier integration plan.
- AI authoring/verifier handoff that blocks unreviewed AI drafts from student assignment.
- Curated activity pathway and compatibility rules for each reviewed unit package.
- Planned printable worksheet/PDF output from reviewed payloads.
- Printable output readiness gates for browser-print preview, QR/audio, version/rights snapshot, and teacher export policy.
- Private tenant library planning for drafts, tenant-approved packages, school sharing, and public community blocking.
- Teacher authoring readiness for quick drafts, copy/edit, activity pathway edits, printable authoring, and direct-AI-publish blocking.
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
- Background media policy that keeps music/chant enrichment teacher-controlled, support-only, and lower priority than tap-to-speak learning audio.

## Session 6: Local/Closed Deployment Mode

Purpose: Package the same platform for closed local use when a publisher, school, or textbook partner needs a non-public installation.

Current status: Deployment profile, local deployment preflight, local bundle manifests, local companion preview, and persistence boundary scaffolds exist in `/teacher/intake` and `/local/sample-publisher`. Hosted PWA is the recommended first pilot path. Local classroom server and packaged local app remain first-class paths, but require offline media bundle, installer/update, sync/export, backup, local storage, approval audit handling, and QR/deep-link decisions before production. `npm run verify:local-bundle` now guards against accidentally presenting the planning package as offline-ready while those blockers remain open. The backend schema draft preserves hosted/local vocabulary compatibility, and local classroom export/restore is intentionally deferred until hosted pilot schema is validated.

Outputs:

- Local app packaging recommendation.
- Offline asset bundle structure.
- Local storage/sync strategy.
- QR/deep-link behavior for installed apps.
- Update path for future content packages and multimedia packages.
- Local deployment preflight covering installer/update, media bundle, reporting/export, backup/restore, QR/deep-link, and offline access control.

## Session 7: Tenant Pilot Package

Purpose: Prepare a real partner pilot without polluting the MiniStar reference implementation.

Current status: Active scaffold. A white-label pilot readiness panel and partner timeline document define the practical partner promise: a testable pilot in roughly 8-12 weeks, with a narrower first scope than the eventual commercial product. A second sample tenant and partner-style content package prove the white-label path in code at `/partner-demo`, `/enter/sample-publisher`, `/launch/partner-demo-unit-1`, `/quiz/partner-demo-unit-1`, `/sentence/partner-demo-unit-1`, `/speak/partner-demo-unit-1`, `/training/partner-demo-unit-1`, and `/teacher/sessions/partner-demo-unit-1`. Teacher unit review routes at `/teacher/units/ministar%3Aministar-english%3AL1%3AU1` and `/teacher/units/sample-publisher%3Apartner-textbook-companion%3AL1%3AU1` now give teachers a focused pre-assignment review surface. `/teacher/intake` adds reviewed source intake gates, tenant route registry data, deployment profile choices, package publish gate, package approval ledger, assignment rollout gates, release-control durable records, backend schema draft, backend migration candidates, backend migration specs, and persistence boundaries. `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1` now show teacher session preflight and monitor scaffolds on the shared event stream. The teacher session settings contract now separates safety failures from persistence warnings for audio, assist language, microphone approval, background media, AI Tutor, and reporting/retention.

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
- Durable record map entries for release candidates, publish gates, and approval ledgers.
- Vendor-neutral backend schema draft.
- Backend migration candidates.
- Backend migration specs.
- Pilot verification checklist.

Next outputs:

- Pull latest `legacy-source-import` locally and run typecheck/build after connector-side changes.
- Use `docs/ACTIVE_ROUTE_VERIFICATION_LIST.md` for route checks after route, package, assignment, game, audio, QR, or teacher-report changes.
- Confirm `/teacher/intake` shows the active route matrix for non-technical route review.
- Confirm the active route matrix stays aligned with the full automated active-route verification list.
- Confirm teacher unit review routes show package evidence, curated activity paths, route readiness, assignment controls, and pilot blockers before expanding teacher authoring or assignment persistence.
- Confirm private assignment link routes show student-facing assignment scope and private-first sharing rules before public links or embeds are considered.
- Confirm collection room routes show deterministic earned collection mechanics before premium avatar, room, mascot, or animation polish begins.
- Browser-verify the package publish gate, approval ledger, backend schema draft, backend migration candidates, backend migration specs, and persistence boundary at `/teacher/intake`.
- Browser-verify the teacher preflight, assigned game path, and monitor settings contract at `/teacher/sessions/demo-unit-1` and `/teacher/sessions/partner-demo-unit-1`.
- Confirm teacher session pages show a session pilot readiness snapshot that separates demo-safe monitoring from live classroom blockers.
- Confirm teacher session pages show a report package boundary that separates learning evidence, support-only signals, excluded sensitive fields, and export blockers.
- Confirm teacher session pages link to a report package preview route while live export remains blocked.
- Confirm safety failures and persistence warnings are displayed separately.
- Confirm teacher session preflight shows assigned game audio coverage before pilot use.
- Confirm teacher session monitor shows assigned game audio coverage in the report surface.
- Confirm teacher session monitor shows media engagement by asset without treating media as mastery.
- Confirm teacher report summaries separate English audio engagement from support-language taps.
- Confirm game action buttons use the shared audio-supported action pattern when a child must understand the control.
- Confirm student progress summaries show English listened progress and support unlocks separately.
- Confirm recommended game route cards separate `Listen` from `Open` so audio support never causes navigation or unlocks by itself.
- Confirm recommended route listen taps are reportable as `route_guidance_listened`, with no Star Dust, mastery, or unlock effect.
- Confirm `/teacher/intake` shows the progress event taxonomy before backend event storage is finalized.
- Confirm `/teacher/intake` shows the progress event taxonomy revision and required event fields before backend event storage is finalized.
- Confirm `npm run verify:taxonomy` passes before adding, renaming, or removing shared progress event types.
- Confirm `npm run verify:game-modes` passes before adding, renaming, routing, or delegating shared game modes.
- Confirm backend schema and migration specs preserve event effect taxonomy before progress-event storage is implemented.
- Confirm backend schema and migration specs preserve earned collection inventory before avatar, room, companion, or long-term reward ownership persistence is implemented.
- Confirm progress-event persistence write intents preserve event effect taxonomy in hosted and local adapters.
- Confirm package game/audio coverage write intents show machine-readable snapshot preservation.
- Confirm teacher assignment readiness shows audio-covered game modes against assigned game modes.
- Confirm assignment rollout surfaces game audio coverage before scheduling.
- Confirm `npm run verify:class-roster` passes after learner identity, roster slots, front-door codes, teacher reports, microphone practice, AI Tutor speech records, backend schema, local deployment, or report export changes.
- Confirm the publish gate blocks release while media rights, report policy, deployment profile, persistence, and pilot package policy are unresolved.
- Confirm the publish gate blocks release until media routes, local/hosted bundle decisions, and support-only media reporting are reviewed.
- Confirm the publish gate blocks release while assigned game modes are missing reviewed audio coverage or approved fallback.
- Confirm `/teacher/intake` shows the competitive feature coverage panel before teacher authoring, printables, private library, sharing, or embed work begins.
- Confirm `/teacher/intake` shows the activity pathway compatibility panel before template conversion, printable, or text-puzzle work begins.
- Confirm `/teacher/intake` shows the printable output readiness panel before worksheet/PDF implementation begins.
- Confirm `/print/demo-unit-1` and `/print/partner-demo-unit-1` load before expanding printable output, QR placement, or PDF generation.
- Confirm `/teacher/intake` shows the private tenant library plan before teacher authoring, copy/edit, sharing, or public-community work begins.
- Confirm `/teacher/library/sample-publisher` shows private drafts, tenant-approved packages, school sharing plans, and public-community blocking before live library search or copy/edit work begins.
- Confirm `/teacher/intake` shows the share/embed readiness panel before public links, iframe embeds, colleague sharing, or public community discovery work begins.
- Confirm `/teacher/intake` shows the teacher authoring readiness panel before live teacher editor or copy/edit implementation begins.
- Confirm `/teacher/intake` shows upload channel readiness before adding live upload controls for PDFs, text, images, audio, music, video, Labelled Diagram assets, media playlists, or local bundles.
- Confirm `/teacher/uploads/sample-publisher` shows upload channel, review queue, promotion, Labelled Diagram asset, and multimedia asset readiness before adding live file pickers, object storage, local upload folders, OCR, media processing, image label editors, or student-facing uploaded asset use.
- Confirm `/teacher/uploads/sample-publisher` shows file policy profiles before live upload controls validate extensions, enforce size or duration limits, scan files, create checksums, transcode media, or promote uploaded files.
- Confirm `/teacher/uploads/sample-publisher` shows disabled intake controls before adding a real file input, drag-and-drop zone, upload progress bar, intake-record write, object storage write, or local folder write.
- Confirm `/teacher/uploads/sample-publisher` shows upload target mapping before uploaded files can create draft packages, game assets, media playlist bindings, local bundle entries, routes, or assignments.
- Confirm `/partner-demo` links to `/teacher/uploads/sample-publisher` before using the partner demo as a white-label handoff route.
- Confirm `/teacher/evidence/sample-publisher` shows the cross-source evidence packet review index before enabling live evidence upload, signed approval capture, upload promotion, asset publishing, playlist creation, route creation, or assignment shortcuts.
- Confirm `/teacher/evidence/sample-publisher/handoff` shows evidence export packet shape, recipient duties, blocked actions, and next gates before enabling evidence export, signed approval capture, upload promotion, asset publishing, playlist creation, route creation, or assignment shortcuts.
- Confirm `/teacher/intake` shows evidence export readiness before enabling PDF export, JSON export, downloadable ZIPs, email handoff, signature capture, release-state mutation, or student assignment from evidence.
- Confirm `/teacher/intake` shows the upload review queue before adding live upload approval, OCR promotion, image-label promotion, media playlist promotion, local-bundle promotion, or student-facing uploaded asset use.
- Confirm `/teacher/intake` shows target-specific upload promotion readiness before adding live upload promotion into teacher drafts, Labelled Diagram assets, media playlists, game background media, or local bundle files.
- Confirm `/teacher/intake` shows Labelled Diagram asset readiness before adding live image label editors, label coordinate storage, game asset manifests, or student-facing Labelled Diagram routes.
- Confirm `/teacher/assets/labelled-diagram/sample-publisher-l1-u1-labelled-diagram` stays teacher-only and blocks live upload, label editing, coordinate editing, student-facing image gameplay, and assignment routes from uploaded images.
- Confirm `/teacher/intake` shows multimedia asset readiness before adding live media uploads, media processing, playlist promotion, background-media assignment, video-only lesson paths, or local media bundle activation.
- Confirm `/teacher/assets/media/sample-publisher-l1-u1-routines-media` stays teacher-only and blocks live upload, transcoding, playlist creation, background-media assignment, local folder activation, route promotion, and media-only progress.
- Confirm uploads remain intake records first and cannot become student-facing until source lineage, rights, file policy, review, audio coverage, route mapping, and package release gates pass.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve upload intake records before live file pickers, object storage, local upload folders, OCR, image label anchors, or media processing begin.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve upload review records before live approve-for-draft, ready-for-asset-review, rights-request, return-for-replacement, OCR promotion, image-label promotion, media playlist promotion, local-bundle promotion, or student-facing upload use.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve upload promotion gate records before reviewed uploads can create target records, publish assets, assign students, or enter local bundles.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve `game_asset_manifest` and `label_anchor_record` records before live image asset libraries, coordinate editors, label editors, auto-generated active labels, or student-facing Labelled Diagram routes begin.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry` records before live playlist promotion, background-media assignment, local media bundle activation, or media-only progress paths begin.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` keeps local edit preview actions blocked before live save, review submission, or assignment work begins.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` keeps draft audio coverage visible before live authoring or audio generation work begins.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` keeps draft review handoff packets read-only and blocked before live submit-for-review, verifier workflow, or package approval work begins.
- Confirm `/teacher/review` keeps draft review queue items read-only and blocked before live verifier submission, package approval, direct AI publish, or student assignment work begins.
- Confirm `/teacher/review` keeps verifier submission preflights blocked before automatic verifier submission, live review workflows, or package-state promotion exists.
- Confirm `/teacher/review` keeps reviewer decision previews disabled before reviewer identity, evidence storage, verifier workflow, package approval, and release-control policy exist.
- Confirm `/teacher/review` keeps review evidence packet previews blocked before evidence upload, signature capture, approval ledgers, or real file storage exist.
- Confirm `/teacher/review` keeps review audit trail previews blocked before live state transitions, approvals, evidence upload, publishing, or student assignment exist.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft reviewer decisions before live return-for-edits, needs-audio, ready-for-approval, or package-state-change work begins.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft review evidence packets before file upload, signature capture, approval evidence, or evidence export work begins.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft review audit trails before live reviewer actions or package state transitions begin.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft verifier submission preflights before automatic verifier submission or verifier workflow promotion begins.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft review handoff packets before live submit-for-review, verifier workflow, or package approval work begins.
- Confirm `/teacher/intake` shows the target-language expansion readiness panel before Japanese target-language or other non-English target-language pilots are scoped.
- Confirm curated activity pathways remain the default teacher-facing answer to switch-template style expectations.
- Confirm the approval ledger does not imply real signed approvals before authentication and persistence exist.
- Confirm the durable record map includes publish gate and approval ledger records.
- Confirm the durable record map, adapter plans, schema draft, and migration specs include teacher report package boundary records before live report export.
- Confirm the backend schema draft includes tenant, package release, package game/audio coverage, QR alias, media manifest, launch session, progress event, teacher report package, publish gate, and approval ledger entities.
- Confirm migration candidates sequence admin/release records before student progress storage.
- Confirm migration specs name primary keys, tenant scope, indexes, retention, export, local fallback, and policy blockers before backend-specific migrations.
- Confirm package game/audio coverage is present in schema draft, write intents, migration candidates, and migration specs before vendor-specific backend work begins.
- Confirm `/teacher/intake` shows the first pilot source strategy: manually reviewed units first, draft PDF import later, automatic PDF-to-student publishing blocked.
- Confirm `/teacher/intake` shows a publisher maintenance change queue for year-on-year content, media, game, route, and report updates.
- Confirm durable records, adapter plans, schema draft, and migration specs include publisher maintenance change requests before partner self-maintenance.
- Confirm `/local/sample-publisher` shows the closed/local companion package preview without implying offline-ready installer status.
- Confirm `/local/sample-publisher` shows a package artifact map before exporter or installer work begins.
- Confirm `/local/sample-publisher` shows a package handoff checklist separating publisher, platform, and school-owned requirements.
- Confirm durable records, adapter plans, schema draft, and migration specs include local companion handoff and release gate records before local package generation.
- Confirm `/local/sample-publisher` shows a generated manifest snapshot as preview-only package metadata.
- Confirm `/local/sample-publisher` shows bundled game routes with engine, audio coverage, and progress reporting status.
- Confirm `/local/sample-publisher` shows a local release gate that blocks closed handoff until media rights, installer/update, backup/export, QR fallback, school access/privacy, and game/audio/reporting checks are reviewed.
- Confirm local companion release gate storage contracts exist before installer packaging, local server release, desktop companion handoff, or offline-ready claims.
- Confirm shared navigation exposes the local companion preview during review.
- Confirm `/teacher/intake` shows a pilot release candidate summary that joins publish gates and approval ledgers before any live pilot claim.
- Confirm `npm run verify:release-control` passes after publish gate, approval ledger, release candidate, or pilot handoff changes.
- Confirm `/teacher/intake` shows the backend selection gate before choosing the actual first pilot backend.
- Confirm teacher session monitor routes show a machine-readable settings snapshot before launch-session persistence is implemented.
- Confirm launch-session adapter plans, schema draft, migration candidates, and migration specs preserve teacher session settings snapshots before live student events are stored.
- Confirm assist-language teacher enablement is represented in the teacher-session settings snapshot before support language is used in real classroom launches.
- Confirm `npm run verify:session-settings` passes after teacher settings, assist language, microphone, background media, AI Tutor, or reporting changes.
- Confirm direct launch and front-door QR/class-code contexts both carry teacher session settings before support-language visibility changes.
- Confirm backend schema, migration specs, and adapter plans preserve assist-language teacher enablement before backend-specific migrations.
- Confirm `npm run verify:backend-storage` passes before backend selection, persistence adapters, or vendor-specific migrations.
- Confirm teacher session monitor routes show an event acceptance gate before live student event storage is enabled.
- Confirm launch-session storage contracts preserve event acceptance gates before live student event writes are enabled.
- Confirm teacher report package previews include an event acceptance summary before report export or live event storage is enabled.
- Confirm progress-event write intents require a passed event acceptance gate before live student event writes are enabled.
- Confirm teacher report package storage preserves event acceptance summaries before report export is enabled.
- Confirm durable record contracts preserve progress-event taxonomy, progress-event acceptance gates, and report event acceptance summaries before backend selection.
- Confirm teacher draft package routes preserve draft-only, source-lineage, audio-before-students, and review-before-assignment boundaries before live authoring.
- Confirm local draft edit previews cannot save, submit for review, assign to students, or regenerate audio before persistence and verifier workflows exist.
- Confirm teacher draft audio coverage previews preserve term, sentence, instruction, and fallback audio requirements before student use.
- Confirm private teacher library routes preserve source lineage, no-student-data-copy rules, and public-community blocking before teacher library persistence or sharing is implemented.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve teacher draft packages before live teacher authoring, copy/edit, private-library drafts, or assignment persistence.
- Confirm backend schema, adapter plans, durable records, and migration specs preserve tenant library items before live library search, copy/edit, school sharing, or public-community decisions.
- Confirm `/teacher/media/sample-publisher` shows media rights, target records, maintenance stages, and blocked live actions before live media upload, replacement, playlist promotion, background-media assignment, or local media activation begins.
- Confirm `/teacher/intake` shows the content entry option scaffold with template flow, activity title, instructions, AI draft control, flip tiles, single/double sided rows, row audio/image controls, formatting tools, item reorder/duplicate/delete, `min 2 max 50` limits, and blocked Done-to-student routing before live upload or authoring controls are implemented.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows the disabled content-entry workbench preview before any real draft save, file picker, AI generation, template switch, upload, Done-to-student route, or assignment workflow is implemented.
- Confirm Flip Tiles remains a concrete source template while the upload/content-entry guide applies across compatible game families, with approved learner fonts, tenant font packs, hiragana-safe font handling, readable tile sizing, and font rendering gates before live styling controls.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `template_rendering_profile` and `font_accessibility_profile` before enabling live cross-game template rendering, tenant font packs, font uploads, or printable rendering controls.
- Confirm `/teacher/intake` shows template/font profile readiness with student-facing rendering and font blocks before live template switching, printable rendering, or tenant font configuration is enabled.
- Confirm `/teacher/authoring/draft-sample-publisher-l1-u1` shows draft profile bindings before live draft template switching, printable rendering, or tenant font configuration is enabled.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `activity_compatibility_snapshot` before enabling live teacher pathway changes, extra template conversions, or printable switching.
- Confirm package publish gates require reviewed `activity_compatibility_snapshot`, `template_rendering_profile`, and `font_accessibility_profile` records before pilot release.
- Confirm `/teacher/intake` shows a publisher pilot readiness summary sourced from the package publish gate before partner demos, pilot handoff, or commercial readiness conversations.
- Confirm `/teacher/intake` shows a pilot evidence packet preview before enabling live evidence upload, signed approval capture, or partner pilot release workflows.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `pilot_evidence_packet` before live evidence upload, signed approval capture, or partner pilot release workflows.
- Confirm `/teacher/evidence/sample-publisher` shows an evidence packet assembly gate with release readiness lanes, packet-version freeze blocks, and approval/export/QR/assignment/storage blocks before live evidence upload, packet export, signed approval capture, route promotion, QR promotion, local bundle activation, or student assignment is enabled.
- Confirm `/teacher/evidence/sample-publisher` shows reviewer identity and signature readiness with reviewer identity, approval intent, signature policy, audit retention, and approval-action blocks before signed approval capture, approve buttons, release-state mutation, signature attachment upload, signed PDF packets, evidence download, or approval-based student assignment are enabled.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `reviewer_identity_signature_gate` before signed approval capture, approve buttons, signature attachment upload, signed PDF packets, evidence download, release-state mutation, or approval-based student assignment are enabled.
- Confirm `/teacher/intake` shows a pilot launch checklist preview before enabling live classroom launch, evidence upload, signed approval capture, or pilot-ready status changes.
- Confirm `/teacher/intake` shows a teacher dry-run rehearsal preview before enabling live classroom launch, real learner data collection, report export, or pilot-ready status changes.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `teacher_dry_run_rehearsal` before live classroom launch, real learner data collection, report export, or pilot-ready status changes.
- Confirm `/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run` loads before enabling live classroom launch, report export, or pilot-ready status changes.
- Confirm `/teacher/intake` and `/teacher/dry-run/sample-publisher-first-handoff-teacher-dry-run` show a classroom launch gate preview with `Launch blocked`, `No live student session`, `No launch button`, `Real learner data blocked`, and `Report export still blocked` before any live classroom workflow is implemented.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `classroom_launch_gate` before live classroom launch, launch buttons, real learner data collection, report export, or launch-ready status changes.
- Confirm `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate` loads as a review-only workspace before adding any live classroom launch route, launch button, report export, or launch-ready state transition.
- Confirm `/teacher/intake` and `/teacher/launch-gate/starter-english-level-1-unit-1-2026.1-pilot-candidate-classroom-launch-gate` show a school launch policy gate preview with school, publisher, platform, and shared dry-run ownership before a controlled demo is ever described as school-approved launch readiness.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_launch_policy_gate` before policy acceptance workflows, live launch, real learner data, report export, local activation, release mutation, or launch-ready status changes.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_policy_handoff_packet` before school meeting packets can become audited pilot-readiness artifacts, while still blocking policy acceptance, signed approval capture, evidence export, local activation, production QR promises, launch-ready status, learner data, report export, and live classroom workflow.
- Confirm backend schema, migration candidates, migration specs, adapter plans, and durable records preserve `school_policy_acceptance_preflight` before any school accept button, signature capture, evidence export, storage activation, launch-ready status, production QR promise, AI Tutor activation, learner data, report export, or live classroom workflow can be designed.
- Confirm student launch and front-door routes show controlled-practice launch context before real classroom launch, production student accounts, or live learner data collection is enabled.
- Confirm teacher session monitor and report-package routes show a session launch gate boundary before live classroom launch, real learner data collection, report export, or launch-ready state transition.
- Confirm private assignment routes show controlled-practice launch context before real classroom launch, production student accounts, report export, or live learner data collection is enabled.
- Confirm teacher unit review routes show launch-safety status before live assignment, real classroom launch, production student accounts, report export, or live learner data collection is enabled.
- Confirm upload review and promotion storage preserves `target_mapping_packet` before live upload controls can create draft packages, game assets, playlists, local bundle entries, routes, or assignments.
- Confirm `npm run verify:launch-safety` passes after launch, front-door, private assignment, teacher unit review, teacher session monitor, report package, or classroom launch gate changes.
- Confirm stable QR alias routes are content-checked for printed QR id, resolved target, and guardrails before real textbook QR commitments are made.

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
