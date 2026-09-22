# Living Textbook Future Requirements

This document records future-facing requirements, deferred build ideas, and decision checkpoints that should be reviewed when choosing the next concrete build task.

It is not a replacement for `docs/PRINCIPLES_AND_STANDARDS.md`. It is the backlog memory for ideas that are important, but not necessarily ready for immediate implementation.

## Requirement Review Rule

When the next build direction is unclear, review this document together with:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md`
- `docs/ROUTE_CONTRACTS.md`
- `docs/COMPONENT_STRUCTURE.md`

The next task should usually advance the clean vertical slice before adding polish, infrastructure, or premium assets.

## FR-001: Defer Database And Auth Until The First Interactive Slice Works

Status: Superseded checkpoint; the first interactive slice is verified and the platform has entered a gated persistence phase. Process-memory remains the default rehearsal provider. A server-only SQLite adapter exists as the current reference durable adapter, but deployment gates still block live learner writes, production accounts, and school rollout.

Requirement: The platform should not introduce database persistence, full auth, live classrooms, or account management until the first student progression slice proves the core route behavior.

Current target slice:

Teacher launch protocol -> QR route -> flashcard entry practice -> completion event -> next game unlock -> playable Memory Match -> progress summary update.

Rationale:

- White-label impact: Positive. Proving the flow first keeps tenant assumptions from being embedded too early in auth or database tables.
- Cost impact: Positive. It avoids paying the build and maintenance cost of persistence before the product interaction is proven.
- Architecture impact: Positive. It lets the event contract settle before Supabase, another backend, or a custom service is chosen.

Completed checkpoint:

- The local progression slice is verified through flashcards, unlock, playable Memory Match, completion events, and teacher-visible report evidence.
- Cross-route progression and a hosted/local persistence seam now exist behind explicit deployment and policy gates.
- The persistence status surface is read-only and exposes safe readiness evidence rather than learner records or secrets.

Remaining persistence boundary:

- Do not activate durable writes until student session identity, teacher authorization, school policy, retention, release approval, operations, and deployment configuration are all approved together.
- Do not interpret a passing typecheck, build, or readiness preview as a live backend approval.
- Keep provider selection and tenant activation separate from the reference SQLite implementation so white-label deployments can choose an appropriate local or hosted operating model.

Revisit for the next persistence decision when:

- A named pilot tenant supplies the policy, retention, authorization, and deployment evidence required for durable writes.
- The team chooses whether that pilot uses the reference SQLite adapter, a managed hosted provider, or a local companion deployment.
- Real report export and recovery behavior are demonstrated against sanitized evidence before any learner data is accepted.

## FR-002: First Interactive Student Progression Slice

Status: Implemented as local interactive slice on `legacy-source-import`; visual/build verification still required when local repo access is available.

Requirement: Build the first interactive student flow without premium visual polish.

Acceptance path:

1. Student enters `/launch/[code]`.
2. Student sees flashcard entry practice.
3. Student sees deterministic earned rewards with Star Dust thresholds.
4. Student taps vocabulary terms and target sentences to hear them.
5. Student marks entry practice complete.
6. The app records an `entry_practice_completed` progress event.
7. The next recommended game, currently Memory Match, unlocks.
8. The displayed progression state updates with earned Star Dust.
9. The first deterministic reward unlocks.
10. Student starts the unlocked Memory Match board.
11. The app records a standard `game_started` event.
12. Student taps hidden cards to hear/reveal vocabulary and match pairs.
13. Completing Memory Match records `game_completed` and awards additional Star Dust.

Implemented boundary:

- Progress is held in local component state.
- Star Dust is calculated through the shared content model and local game completion helper.
- Completion and unlock events are produced by an app-level local progression adapter.
- Earned rewards are deterministic catalog entries, not random rewards.
- Memory Match now plays as a simple local pairing game with attempts, matches, completion, audio-on-card-tap, and game completion events.

Remaining verification:

- Run local typecheck/build when the working branch is locally accessible.
- Visually inspect `/launch/demo-unit-1` and `/enter/ministar` in the browser.
- Confirm mobile layout remains readable after state changes and Memory Match completion.

Non-goals:

- Real database persistence.
- Authentication.
- Live teacher monitoring.
- Premium mascot animation.
- Advanced Memory Match art, animation, or asset polish.
- Collection room rendering.

## FR-003: Public Repository Research Before Major Reinvention

Status: Active research checkpoint; no external code or assets have been imported. `docs/RESEARCH_NOTES_PUBLIC_REPOS.md` records the required research and license-review procedure.

Requirement: Before building major game engines, AI authoring subsystems, classroom monitoring, reward catalogs, avatar systems, PWA offline behavior, multimedia playback, content packaging, or content pipelines from scratch, conduct a deliberate public repository and best-practice research pass.

Purpose:

- Avoid reinventing solved problems.
- Identify proven patterns from high-quality open-source education, game, PWA, classroom, accessibility, media-playback, offline-sync, and AI-content tools.
- Find libraries or architecture ideas that can raise the product toward AAA quality without creating unnecessary build cost.

Research standards:

- Check license compatibility before any adoption.
- Prefer actively maintained repositories with clear tests, docs, releases, and accessible issue history.
- Prefer architecture ideas and reusable libraries over copy-pasting large codebases.
- Record sources, tradeoffs, and rejection reasons in a research note or ADR.
- Evaluate white-label impact, cost impact, accessibility, mobile/PWA fit, and vendor lock-in.
- Do not promote external code into `apps/web`, `apps/ai-service`, or shared packages without an integration plan.
- Do not import assets unless provenance, license, rights, and tenant-fit are recorded.

Suggested future research areas:

- React/Next PWA learning platforms.
- Phaser and web arcade learning engines.
- Open-source flashcard, memory, matching, quiz, and spelling games.
- Classroom QR launch/session patterns.
- Reward catalogs, avatar progression, virtual pet, and room/base collection systems.
- AI content validation and JSON schema verification tools.
- Offline-first student progress and sync patterns.
- Accessible audio/video player patterns for classrooms and children.
- Content package, asset manifest, and offline media bundle patterns.
- Accessibility patterns for young learners and multilingual classrooms.

Revisit when:

- The first vertical slice is locally verified.
- A parent game engine is about to be built.
- Persistence/auth decisions are about to be made.
- A large custom UI, reward, avatar, media, or content pipeline is being proposed.

References:

- `docs/RESEARCH_NOTES_PUBLIC_REPOS.md`
- `docs/DECISION_REGISTER.md` DR-010

## FR-004: Textbook Partner Local Companion And Multimedia Platform

Status: Sample package, visible dashboard concept, active `/enter/ministar` front-door slice, playable Memory Match, gated persistence adapters, and a verified preview QR resolver are implemented on `legacy-source-import`. Real media playback, live learner writes, production teacher reports, QR registry mutation/redirect administration, and local/closed packaging remain future implementation work.

Requirement: The platform must be able to support a white-label textbook partner who provides PDF units and needs a closed/local companion application with games, a multimedia platform, gamification, year-on-year content maintenance, teacher reporting, and long-lived QR codes printed in textbooks.

This requirement is part of the initial build, not a later add-on. It should guide content packages, PDF onboarding, media asset handling, route permanence, deployment packaging, teacher reports, and first-slice route decisions.

Implemented sample boundary:

- Shared contracts exist for content packages, audio/video media assets, unit multimedia plans, front-door entry mode, permanent QR routes, and audio support plans in `packages/content-model/src/index.ts`.
- A sample package exists in `apps/web/src/data/sampleMultimediaPackage.ts`.
- The dashboard shows the sample multimedia package, route concept, optional background-media plan, audio support plan, and teacher progress summary concept.
- `/enter/ministar` opens the sample unit package through entry-code/user-code local state.
- The front-door slice emits launch, flashcard, game, media, and background-media events into one teacher-visible report preview.
- Memory Match is playable from both `/launch/demo-unit-1` and `/enter/ministar`.
- The durable-write activation preflight is bound into the pilot handoff package,
  preserving tenant/package identity and the no-activation boundary.
- Pilot, release-control, approval, persistence, and activation evidence use one
  canonical tenant/package scope; handoff validation rejects scope drift.
- The pilot handoff carries approval-ledger counts and status without enabling
  signature capture or package promotion.
- The evidence-packet handoff uses the canonical pilot package identity and a
  separate stable route key; it must remain export- and promotion-blocked.
- The pilot command view exposes one canonical teacher review decision derived
  from all scoped evidence and keeps live actions blocked.
- Documentation exists in `docs/SAMPLE_MULTIMEDIA_PACKAGE.md`.

Required capabilities:

- Import or draft unit payloads from PDF textbook units.
- Preserve page, unit, activity, and edition references from the original textbook.
- Store audio, music, and video assets as tenant-owned multimedia catalog entries.
- Link tracks, chants, listening activities, lesson videos, music videos, or playlists to units and QR routes.
- Allow unit media to be used before games, after games, or optionally as controlled background/support media during games.
- Map textbook units to reusable game parent engines and mode configs.
- Support deterministic progression and earned rewards for partner tenants.
- Resolve printed QR codes through stable identifiers rather than fragile file paths. The preview resolver is implemented and verified; production registry mutation, redirect administration, and hosted/local deployment wiring remain gated.
- Support a front-door QR route where students enter an entry code and, when required, a user code.
- Support backend teacher reporting for game progress, media engagement, and language review progression.
- Support local/closed deployment options such as installed app, installed PWA, or local classroom server.
- Use hybrid QR as the standard: stable QR registry, optional tiny hosted redirect, and local app/content-package fallback.

Pilot acceptance path:

1. Select one representative PDF unit from the partner.
2. Produce a reviewed structured content package for that unit.
3. Add at least one unit-linked audio asset and one unit-linked video asset.
4. Add one unit playlist and one optional game-background media setting.
5. Add flashcard entry practice.
6. Add one Memory Match or pairing game.
7. Add deterministic reward progress.
8. Add a teacher launch view.
9. Add a student QR route using a stable identifier or front-door entry code.
10. Demonstrate a reportable progress summary for game and media engagement.
11. Demonstrate local/closed package behavior at prototype level.

Revisit when:

- A real partner commitment is being discussed.
- The QR route registry is designed.
- The front-door entry-code/user-code flow needs persistence or tenant administration.
- PDF onboarding work begins.
- Real multimedia player work begins.
- Real teacher reporting is introduced.
- Local deployment packaging is selected.

References:

- `docs/SAMPLE_MULTIMEDIA_PACKAGE.md`
- `docs/BUILD_SESSIONS.md`
- `docs/partner-strategies/LOCAL_TEXTBOOK_COMPANION_STRATEGY.md`
- `docs/adr/0004-permanent-qr-and-local-companion-mode.md`
- `docs/adr/0005-core-multimedia-package.md`
- `docs/DECISION_REGISTER.md` DR-007 and DR-008

## FR-005: Audio-First Learner Support Across All Games

Status: Active requirement; content model contract, sample cue plan, tap-to-speak flashcards, tap-to-hear Memory Match cards, audio-supported critical actions, and speakable media titles are implemented on `legacy-source-import`. Real playback providers, telemetry, offline media resolution, and verifier/teacher review surfaces remain future implementation work.

Requirement: Any learner-facing text in student flows must be supported by audio. The platform must not assume young children or English learners can read independently.

Implemented sample boundary:

- `packages/content-model/src/index.ts` defines `AudioCue` and `UnitAudioSupportPlan`.
- Content package validation now requires each unit to include an audio support plan.
- The sample package includes audio cues for all 8 vocabulary terms, both target sentences, flashcard instructions, Memory Match instructions, and basic feedback.
- The dashboard package panel shows audio cue count and support-plan status.
- `AudioCueText` supports tap/click-to-speak learner text.
- `AudioSupportedAction` supports hearing critical action labels without triggering the action.
- Flashcard terms, target sentences, instructions, and feedback speak when tapped.
- Front-door open, flashcard completion, next-game start, media start/complete, and background-media controls have separate listen/replay support.
- Media playlist titles and media asset titles are speakable in the current front-door slice.
- Memory Match cards speak when tapped and use sample package audio cues when available.
- DR-009 and ADR-0006 record audio-first learner support as an accepted platform decision.

Required capabilities:

- Harden the shared listen/replay UI across every future mode, route, and game shell.
- Text-to-speech provider abstraction for cost-efficient fallback.
- Recorded/partner/teacher audio replacement path without changing game components.
- Optional audio telemetry for teacher reports when useful.
- Offline/local bundle resolution for closed textbook companion deployments.
- Teacher/verifier surfaces that flag missing learner audio before assignment.

Acceptance path:

1. Load a reviewed unit package with an audio support plan.
2. Render flashcards with tap-to-speak controls for every term.
3. Render sentence practice with tap-to-speak controls for both target sentences.
4. Render instructions and feedback with audio support.
5. Confirm critical action labels can be heard without triggering the underlying action.
6. Start Memory Match and confirm card prompts can be heard as well as revealed.
7. Confirm optional background media can be disabled without removing comprehension audio.
8. Confirm package validation fails when a unit lacks an audio support plan.

Revisit when:

- The next game engine or mode shell is built.
- The first shared audio playback UI is introduced.
- Real multimedia playback is introduced.
- Offline/local partner packaging is designed.
- AI authoring payloads begin generating audio cue manifests.

References:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/DECISION_REGISTER.md` DR-009
- `docs/adr/0006-audio-first-learner-support.md`
- `docs/SAMPLE_MULTIMEDIA_PACKAGE.md`

## FR-006: Competitive Feature Coverage And Curated Activity Pathways

Status: Active foundation requirement; `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md` and `/teacher/intake` now record the current coverage stance.

Requirement: Maintain a competitive feature coverage matrix so Wordwall-style teacher expectations are reviewed without causing unfocused feature copying.

Accepted direction:

- Living Textbook should provide curated teacher-approved activity pathways per reviewed unit.
- Fast teacher authoring should create drafts only; direct assignment from drafts or AI output remains blocked.
- The platform should not make unrestricted switch-template behavior the default promise.
- Each unit should eventually identify required, recommended, optional, premium, printable, and blocked activities.
- Compatibility rules should explain why a payload can or cannot become a particular activity type.
- The current sample compatibility matrix must remain visible until the contract is promoted to shared package data.
- Printable/PDF outputs are planned and should be generated from reviewed package data.
- Printable output readiness must allow browser-print previews while blocking PDF export until QR/audio bridge, version/rights snapshot, and teacher export policy exist.
- Private tenant libraries should come before any public community library.
- Private tenant library readiness must preserve teacher private drafts, tenant-approved package libraries, school sharing, and public community blocking.
- Public community sharing is not v1 because moderation, copyright, privacy, quality, and tenant-isolation risks are high.
- Embeds and public sharing links are optional later capabilities, not foundation blockers.

Revisit when:

- Teacher activity authoring begins.
- Printable/PDF worksheet output is scoped.
- Tenant library, copy/edit, or package-sharing work begins.
- A public marketplace/community idea is proposed.
- Activity conversion rules are added to the unit game offer map.

References:

- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`
- `docs/TEACHER_AUTHORING_READINESS_CONTRACT.md`
- `docs/ACTIVITY_PATHWAY_COMPATIBILITY_MATRIX.md`
- `docs/PRINTABLE_OUTPUT_READINESS_CONTRACT.md`
- `docs/PRIVATE_TENANT_LIBRARY_CONTRACT.md`
- `docs/UNIT_GAME_OFFER_MAP_CONTRACT.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`

## FR-007: Japanese As Target Language For White-Label Tenants

Status: Planned opportunity with a visible readiness gate; not part of the current MiniStar English pilot.

Requirement: Preserve the option for Japanese-language schools to use the platform with Japanese as the target learning language.

Boundary:

- MiniStar Japanese assist support is not the same as Japanese-as-target-language support.
- For MiniStar English, English remains the progression trigger.
- For a Japanese-learning tenant, Japanese would become the progression trigger and English could become an assist language.

Future capabilities:

- Target language configurable as Japanese.
- Hiragana, katakana, kanji, and optional furigana/ruby rendering.
- Japanese audio cues and pronunciation models.
- Kana/kanji typing support.
- Japanese phrase and particle segmentation.
- Level-aware script policy.
- Teacher-reviewed Japanese curriculum rules.
- Optional handwriting or stroke-order modes later.

Current scaffold:

- `docs/TARGET_LANGUAGE_EXPANSION_CONTRACT.md` records the target-language expansion contract.
- `/teacher/intake` shows Japanese target-language readiness and blockers.
- `npm run verify:target-language` checks that the plan, route verification, and assist-language boundary remain in place.

Revisit when:

- A Japanese-language school or publisher opportunity appears.
- Content model language fields are revised.
- Text/spelling engine work expands beyond English spacing/tokenization.
- UI typography and ruby/furigana rendering are scoped.

References:

- `docs/ASSIST_LANGUAGE_STANDARD.md`
- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`
- `docs/TARGET_LANGUAGE_EXPANSION_CONTRACT.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`

## FR-008: Private Assignment Sharing And Future Embeds

Status: Planned with a visible readiness gate; public sharing and iframe embeds are blocked for v1.

Requirement: Preserve share-link and embed opportunities without weakening tenant privacy, student reporting, package rights, or young-learner focus.

Accepted direction:

- Private assignment links and stable QR routes come first.
- Teacher colleague sharing should happen inside private tenant libraries through copy-as-draft and review.
- Public share links are blocked for v1.
- Website iframe embeds are optional later.
- Public community discovery is blocked for v1.

Future capabilities:

- Assignment link records tied to reviewed package versions.
- Tenant-scoped access control.
- Report package boundaries for shared assignments.
- Embed origin allowlists, sandbox policy, token expiry, and fallback links.
- Rights and visibility checks before public or embedded sharing.

Current scaffold:

- `docs/SHARE_EMBED_READINESS_CONTRACT.md` records the share/embed contract.
- `/teacher/intake` shows share/embed readiness and blockers.
- `npm run verify:share-embed` checks the plan and route verification.

Revisit when:

- Assignment persistence is implemented.
- Teacher colleague sharing begins.
- Public visibility, embed, or community library work is proposed.
- A publisher asks to place playable activities inside an external site.

References:

- `docs/SHARE_EMBED_READINESS_CONTRACT.md`
- `docs/PRIVATE_TENANT_LIBRARY_CONTRACT.md`
- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`

## FR-009: Controlled Z.ai Game Intake Timing

Status: Evidence-only Memory Match intake is open; direct integration remains
blocked.

Requirement: Preserve the value of ongoing Z.ai game work without letting external prototypes bypass the LivingTextbook foundation.

Accepted direction:

- The user may continue directing Z.ai work in `Drewsure/ministar-lab`.
- Codex has alerted the user that the foundation is ready for one controlled,
  evidence-only Memory Match handoff.
- Z.ai output remains external prototype evidence, not source material for
  direct promotion into `apps/web`, `apps/ai-service`, routes, scoring,
  rewards, assignments, playlists, or package assembly.
- Intake must start with inventory and classification, not copy/paste integration.

Required intake gates:

- Parent-engine fit review.
- JSON fixture conformance.
- Standard event replay.
- Target-language tap-to-speak audio coverage.
- Support-language progress blocking.
- Deterministic scoring replay.
- Mobile/accessibility review.
- White-label tenant configuration review.
- Codex integration decision before any app patch.

Future capabilities:

- Z.ai prototype inventory table.
- Returned prototype evidence packet.
- Phaser wrapper adapter review.
- Fixture, event, audio, scoring, and mobile replay reports.
- Codex promotion decision record.

Current controlled intake:

- The first requested candidate is Memory Match in the pairing parent engine.
- The human may send `docs/agent-briefs/ZAI_MEMORY_MATCH_EVIDENCE_REQUEST.md`
  to Z.ai while keeping work scoped to `Drewsure/ministar-lab`.
- A returned evidence packet must pass provenance, fixture, event, audio,
  deterministic scoring, accessibility, tenant, and wrapper review before any
  integration proposal exists.
- Balloon Pop remains the next candidate after Memory Match evidence review.

Revisit the next candidate when:

- Foundation route verification remains stable.
- The shared game contracts are stable enough to judge returned prototypes.
- At least one parent-engine wrapper path is ready for controlled prototype review.
- Memory Match evidence is returned and its Codex integration decision is
  recorded.

References:

- `docs/BUILD_SESSIONS.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/AI_TEACHING_GAME_GENERATOR_CONTRACT.md`
- `docs/GAME_PROTOTYPE_SURFACE_STANDARD.md`
- `docs/agent-briefs/ZAI_GAME_PROTOTYPE_DIRECTIVES.md`

Persistence follow-up:

- Select and document the first provider-neutral hosted/local persistence
  implementation only after the canonical pilot review decision, school
  policy, retention, and audit requirements are accepted.
- Keep the review decision record as metadata and never allow it to become a
  hidden activation authority.
- Define the first production snapshot retention and audit policy before
  implementing any hosted or local snapshot write path.

## FR-010: Structured Source Extraction Preview

Status: Implemented as a review-only shared contract; real upload, parser,
OCR, storage, and promotion remain gated.

Requirement: Preserve extracted PDF/text lineage before any publisher source
can become a teacher draft or student-facing package.

Current boundary:

- `SourceExtractionPreview` accepts already-extracted segments with tenant,
  source, package, checksum, page, sequence, unit, and segment-kind identity.
- It derives deterministic normalized text and unit page summaries in memory.
- It rejects malformed checksums, duplicate ordering, undeclared unit mappings,
  and blank extracted text.
- It keeps parser/OCR promotion, storage, draft creation, package assembly,
  route creation, assignment, and student payload use blocked.

References:

- `packages/content-model/src/sourceExtractionPreview.ts`
- `scripts/verify-source-extraction-preview.mjs`
- `docs/adr/0979-structured-source-extraction-preview.md`

## FR-011: Structured Extraction Review Workbench

Status: Implemented as a read-only UI bridge; real upload, extraction,
promotion, and persistence remain gated.

Requirement: Teachers must be able to inspect extracted page and unit evidence
before deciding whether a future governed source workflow can continue.

Current boundary:

- The source workspace shows tenant-filtered previews for the MiniStar and
  sample-publisher pathways.
- Page, sequence, segment kind, unit identity, normalized text, and original
  text evidence are visible.
- Preview records are visibly marked as not promoted and cannot create drafts,
  packages, routes, storage records, assignments, or student payloads.

References:

- `apps/web/src/data/sampleSourceExtractionPreviews.ts`
- `apps/web/src/features/content-intake/SourceExtractionReviewPacketPanel.tsx`
- `scripts/verify-source-review-queue.mjs`

## FR-012: Source-to-Package Extraction Binding

Status: Implemented as review-only evidence binding; extraction acceptance,
draft creation, package promotion, assignment, and launch remain gated.

Requirement: A package-readiness record must be able to prove which structured
extraction preview supplied its source evidence.

Current boundary:

- Source package assembly requires an `extractionPreviewId`.
- Binding checks tenant, source, target package, source checksum, and preview
  identity, plus review-only and no-side-effect flags.
- Mismatched previews fail closed before package evidence can be reconciled.

References:

- `packages/content-model/src/sourcePackageAssembly.ts`
- `packages/content-model/src/sourceExtractionPreview.ts`
- `scripts/verify-runtime-behavior.mjs`

## FR-021: External Candidate Handoff Diagnostics

Status: Implemented as a review-only operator safeguard; no candidate source
is imported or promoted.

Requirement: The external Phaser verifier must clearly distinguish a frozen
source snapshot from a returned evidence package so a human does not fabricate
missing evidence files or mistake a not-ready handoff for a product failure.

Current boundary:

- A missing return manifest under a frozen-looking path produces an explicit
  source-context diagnostic.
- The verifier still requires the real `evidence/return-package.json` and all
  hash-verified artifacts in an isolated folder outside the repository.

References:

- `scripts/verify-phaser-candidate-package.mjs`
- `scripts/verify-phaser-candidate-package-behavior.mjs`
- `docs/OPERATING_NOTES.md`

## FR-013: Package-Readiness Extraction Lineage

Status: Implemented as review-only reconciliation metadata; package promotion,
storage writes, assignment, and student activation remain gated.

Requirement: Package-readiness records must preserve the exact extraction
preview identity behind their source assembly evidence.

Current boundary:

- Reconciliation records carry `sourceExtractionPreviewId`.
- Hosted/local metadata-preview references preserve the same identity.
- Tenant, package, preview-ID, and checksum drift fail closed.

References:

- `packages/content-model/src/packageReadinessReconciliation.ts`
- `packages/content-model/src/packageReadinessPersistence.ts`
- `scripts/verify-runtime-behavior.mjs`

## FR-014: Package-Readiness Lineage Visibility

Status: Implemented as review-only operator visibility; upload, storage,
promotion, assignment, and student activation remain gated.

Requirement: Teachers and publisher operators must be able to audit the exact
source assembly packet, extraction preview, and checksum behind a readiness
record without inspecting implementation details.

Current boundary:

- Package-readiness reconciliation cards show the source assembly packet,
  extraction preview ID, and source checksum.
- Hosted/local metadata-preview cards show the same lineage references.
- Visible lineage remains evidence only and cannot authorize any side effect.

References:

- `apps/web/src/features/content-intake/PackageReadinessReconciliationPanel.tsx`
- `apps/web/src/features/persistence/PackageReadinessPersistencePanel.tsx`
- `scripts/verify-package-readiness-reconciliation.mjs`
- `scripts/verify-package-readiness-persistence.mjs`

## FR-016: Extraction Preview Candidate-Unit Binding

Status: Implemented as review-only lineage validation; draft creation, package
promotion, route creation, storage, assignments, and student activation remain
gated.

Requirement: Candidate units in a source package assembly must be declared by
the structured extraction preview bound to that assembly.

Current boundary:

- The shared assembly validator checks every candidate unit against the
  preview's declared unit list.
- MiniStar and sample-publisher fixtures are reconciled before review panels
  render their evidence.
- Undeclared candidate units produce visible findings and fail runtime checks.

References:

- `packages/content-model/src/sourcePackageAssembly.ts`
- `apps/web/src/data/sampleSourcePackageAssembly.ts`
- `apps/web/src/features/content-intake/SourcePackageAssemblyPanel.tsx`

## FR-015: End-to-End Extraction-to-Readiness Binding

Status: Implemented as review-only validation; extraction acceptance, draft
creation, storage writes, package promotion, assignment, and student activation
remain gated.

Requirement: A readiness record must prove that its source assembly and
structured extraction preview refer to the same tenant-scoped package evidence.

Current boundary:

- The shared readiness contract validates tenant, target package, preview ID,
  and source checksum directly against the preview.
- MiniStar and sample-publisher fixtures use matching preview and assembly
  checksums.
- Runtime behavior rejects checksum drift before readiness evidence can pass.

References:

- `packages/content-model/src/packageReadinessReconciliation.ts`
- `apps/web/src/data/samplePackageReadinessReconciliation.ts`
- `scripts/verify-runtime-behavior.mjs`

## FR-018: Extraction-Preview Output Invariants

Status: Implemented as review-only output validation; extraction acceptance,
draft creation, storage writes, package promotion, assignment, and student
activation remain gated.

Requirement: The structured preview object consumed by later evidence layers
must preserve the invariants established by its extraction request.

Current boundary:

- Normalized text must equal the deterministic normalization of original text.
- Unit summaries must match candidate-unit segment counts and page ranges.
- Segment identity, candidate-unit coverage, blocked actions, and no-side-effect
  flags are revalidated on the output object.
- Composite package-readiness lineage invokes this output validation before
  readiness evidence can pass.

References:

- `packages/content-model/src/sourceExtractionPreview.ts`
- `scripts/verify-source-extraction-preview.mjs`
- `scripts/verify-source-review-queue.mjs`

## FR-019: Source Assembly Media-Package Binding

Status: Implemented as review-only media lineage validation; upload,
transcoding, rights approval, playlist promotion, storage writes, assignment,
and student activation remain gated.

Requirement: Candidate audio, video, and image asset IDs in a source assembly
must resolve to the same tenant and target package before package evidence can
use them.

Current boundary:

- Every candidate media ID must exist in the bound content package.
- Media tenant identity must match the source assembly tenant.
- Unit-bound media must remain inside the assembly's candidate-unit scope.

References:

- `packages/content-model/src/sourcePackageAssembly.ts`
- `apps/web/src/data/sampleSourcePackageAssembly.ts`
- `scripts/verify-runtime-behavior.mjs`

## FR-017: Composite Package-Readiness Lineage Binding

Status: Implemented as review-only validation; extraction acceptance, draft
creation, storage writes, package promotion, assignment, and student
activation remain gated.

Requirement: A readiness record must be verified against the exact source
assembly and extraction preview as one tenant-scoped evidence chain.

Current boundary:

- A composite validator reconciles readiness, assembly, and preview identity
  in one call.
- Candidate-unit scope is checked through the same chain, not only through a
  separately rendered source panel.
- Unit-scope drift fails closed before readiness evidence can be considered
  coherent.

References:

- `packages/content-model/src/packageReadinessReconciliation.ts`
- `apps/web/src/data/samplePackageReadinessReconciliation.ts`
- `scripts/verify-runtime-behavior.mjs`

## FR-020: Composite Media-Package Readiness Binding

Status: Implemented as review-only composite validation; upload, transcoding,
rights approval, playlist promotion, storage writes, assignment, and student
activation remain gated.

Requirement: Package readiness must consume the same tenant-scoped content
package used by the source assembly instead of trusting a separately rendered
media finding.

Current boundary:

- The composite readiness validator requires the content package as a lineage
  input.
- Missing, cross-tenant, missing-package, and out-of-candidate-unit media
  references fail closed before readiness evidence can pass.
- The content package binding remains evidence-only and cannot authorize any
  upload or release side effect.

References:

- `packages/content-model/src/packageReadinessReconciliation.ts`
- `packages/content-model/src/sourcePackageAssembly.ts`
- `apps/web/src/data/samplePackageReadinessReconciliation.ts`
- `scripts/verify-runtime-behavior.mjs`

## FR-022: Fail-Closed Sample Launch Resolution

Status: Implemented as a tenant-boundary hardening slice for the canonical
demo resolver; production route registries and durable QR resolution remain
future deployment work.

Requirement: A launch code that is not explicitly registered for a reviewed
tenant/package must not fall back to MiniStar or any other tenant's sample
content.

Current boundary:

- The sample resolver accepts only the exact reviewed MiniStar and sample
  publisher launch codes.
- Unknown codes fail closed instead of inheriting a tenant, package, audio
  manifest, progression state, or report context.
- Prefix matching is intentionally prohibited because a printed or hosted QR
  path must be resolved by a tenant-scoped route registry, not a naming guess.

Remaining production work:

- Replace the sample set with a durable, tenant-scoped route registry.
- Add QR alias, rollback, local-fallback, authorization, and release-state
  checks before real route mutation is enabled.

References:

- `apps/web/src/data/sampleLaunchResolver.ts`
- `docs/adr/0991-fail-closed-sample-launch-resolution.md`

## FR-023: Tenant-Scoped Front-Door Registry Integrity

Status: Implemented for the reviewed sample registry; durable route mutation,
QR alias persistence, rollback, authorization, and local fallback remain
future deployment work.

Requirement: A front-door route may be served only when its registry entry
binds one tenant to its own path, content package, access policy, launch
session, progression state, and permanent QR path.

Current boundary:

- Duplicate route IDs, paths, and active tenant IDs fail closed.
- Cross-tenant content packages, access policies, launch sessions, and QR
  paths fail closed.
- The launch unit must be present in the route's content package, and the
  progression factory must remain bound to the same launch identity.
- The registry is still static review data; it cannot write routes, aliases,
  redirects, assignments, or student-ready state.

References:

- `apps/web/src/data/sampleTenantRouteRegistry.ts`
- `apps/web/src/data/sampleFrontDoorResolver.ts`
- `scripts/verify-front-door-route-boundary.mjs`
- `docs/adr/0992-tenant-scoped-front-door-registry-integrity.md`

## FR-024: Durable QR Alias And Rollback Runtime Contract

Status: Implemented as a provider-neutral review-only contract; durable alias
records, redirect mutation, release activation, and rollback execution remain
future deployment work.

Requirement: Hosted, local, and hybrid deployments must use one tenant-scoped
QR alias shape with explicit release identity, safe target and fallback paths,
rollback evidence, and learner-data protection.

Current boundary:

- Alias and rollback records must bind tenant, alias, package, release, and
  previous-release identities.
- Direct file paths, localhost targets, unsafe traversal, and raw media paths
  are rejected by the shared runtime contract.
- Active-alias readiness requires release approval, persistence readiness,
  local-fallback readiness, and rollback approval evidence.
- The review-only adapter cannot mutate routes, redirects, packages, local
  bundles, learner data, or rollback state.

References:

- `packages/content-model/src/qrAliasRuntime.ts`
- `apps/web/src/data/sampleQrAliasRollbackEvidence.ts`
- `scripts/verify-qr-alias-rollback-boundary.mjs`
- `docs/adr/0993-durable-qr-alias-and-rollback-runtime-contract.md`

## FR-025: QR Alias Backend Contract Alignment

Status: Implemented in the schema draft, migration candidate, and migration
spec; backend selection and real migration execution remain future work.

Requirement: Durable QR alias storage must preserve the shared runtime's
printed identity, release lineage, safe target/fallback, rollback evidence,
tenant scope, and learner-data exclusion fields.

Current boundary:

- The route-alias schema draft, migration candidate, and migration spec carry
  the same release and rollback fields.
- Migration prerequisites explicitly include the QR rollback contract and
  release-lineage acceptance.
- The alignment verifier rejects drift before backend implementation begins.
- No database migration, route write, QR redirect mutation, package swap,
  local activation, or rollback execution is enabled.

References:

- `apps/web/src/data/sampleBackendSchemaDraft.ts`
- `apps/web/src/data/sampleBackendMigrationCandidates.ts`
- `apps/web/src/data/sampleBackendMigrationSpecs.ts`
- `scripts/verify-qr-alias-backend-alignment.mjs`

## FR-026: QR Preview Runtime Consumption

Status: Implemented for the review route; production redirect execution and
durable alias writes remain blocked.

Requirement: The QR preview must consume the same review-only alias/rollback
adapter that governs future hosted, local, and hybrid route activation.

Current boundary:

- The preview displays the review-only decision and current/previous release
  evidence for the reviewed sample alias.
- It cannot write redirects, activate routes, swap packages, or execute
  rollback.
- The preview remains a route-resolution demonstration, not a production QR
  commitment.

References:

- `apps/web/src/app/q/[...segments]/page.tsx`
- `scripts/verify-qr-alias-preview-integration.mjs`

## FR-027: Printed QR Binding Preview

Status: Implemented as a review-only worksheet binding preview; QR image
generation, durable alias writes, and long-lived print release remain future
work.

Requirement: Printed worksheets must show the stable textbook identity,
reviewed target, safe fallback, release lineage, and rollback state through the
same shared QR alias contract used by web previews.

Current boundary:

- Complete textbook identity resolves through the safe permanent QR path.
- Incomplete identity visibly uses a front-door fallback and remains blocked
  from long-lived textbook printing.
- The preview does not generate a QR image, mutate redirects, write aliases,
  swap packages, activate local bundles, execute rollback, or collect learner
  data.

References:

- `apps/web/src/data/samplePrintableQrAliasPreview.ts`
- `apps/web/src/features/printables/PrintableWorksheetPreview.tsx`
- `scripts/verify-qr-print-preview-integration.mjs`

## FR-028: Explicit Pilot Deployment Decision Record

Status: Implemented as a review-only decision record; provider selection,
persistence activation, and classroom launch remain future work.

Requirement: A controlled pilot must carry an explicit tenant- and
package-bound deployment decision rather than relying on a general options
guide or an implied recommendation.

Current boundary:

- Hosted PWA is the cost-efficient recommendation for the first pilot.
- Hosted, local classroom server, and packaged companion options remain visible.
- The selected option is unset until a human school or publisher owner
  reviews it.
- No deployment decision can activate persistence, launch classrooms, promote
  packages, mutate QR routes, export reports, or migrate providers.

Policy lineage requirement:

- The deployment decision must explicitly reference the tenant school-policy
  acceptance preflight and future acceptance-record preview.
- A policy evidence reference must never be interpreted as accepted policy or
  as authorization for durable learner writes.

References:

- `packages/content-model/src/pilotDeploymentDecision.ts`
- `apps/web/src/data/samplePilotDeploymentDecision.ts`
- `apps/web/src/features/pilot/PilotDeploymentDecisionPanel.tsx`
- `scripts/verify-pilot-deployment-decision.mjs`

## FR-029: Persistence Activation Policy-Lineage Binding

Status: Implemented as review-only handoff evidence; durable writes, provider
activation, and school acceptance remain blocked.

Requirement: Any future hosted or local persistence activation must carry the
exact tenant/package deployment decision, school-policy acceptance preflight,
and future acceptance-record preview identities. A generic accepted-policy or
provider boolean is insufficient evidence.

Current boundary:

- Pilot handoff activation evidence displays all three lineage identities.
- The sample deployment remains unselected and policy remains `not-accepted`.
- `canActivate` remains false and no learner-data mutation is introduced.

References:

- `packages/content-model/src/pilotHandoff.ts`
- `apps/web/src/data/samplePilotHandoffPackage.ts`
- `apps/web/src/features/pilot/PilotHandoffPackagePanel.tsx`
- `scripts/verify-persistence-activation-preflight.mjs`

## FR-030: Pilot Lineage Reconciliation

Status: Implemented as review-only validation; provider selection, policy
acceptance, durable writes, classroom launch, and package promotion remain
blocked.

Requirement: Pilot handoff activation evidence must be reconciled against the
actual deployment decision, school-policy acceptance preflight, and future
acceptance-record preview, not merely checked for non-empty identifiers.

Current boundary:

- The shared content model rejects cross-tenant, cross-package, mismatched,
  or accepted-looking lineage sources.
- The sample pilot and intake routes surface the reconciled validation result.
- Runtime behavior tests cover valid lineage, altered preview identity, and
  altered policy-preflight tenant cases.

References:

- `packages/content-model/src/pilotHandoff.ts`
- `apps/web/src/data/samplePilotLineageValidation.ts`
- `scripts/verify-pilot-lineage-binding.mjs`
- `docs/verification/PILOT_LINEAGE_BINDING_CHECKS.md`

## FR-031: Source-to-Draft Import Boundary

Create a durable, tenant-scoped source-to-draft import workflow only after
source extraction review, rights, audio, target mapping, ownership, and storage
provider gates are implemented. The review-only preview must remain the
canonical contract for identity reconciliation and must not be treated as a
permission to enable writes.
