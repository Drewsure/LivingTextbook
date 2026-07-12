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

Status: Active checkpoint; local-state vertical slice now includes flashcards, unlock, playable Memory Match, local completion events, and teacher-visible report preview. Persistence/auth still deferred until local verification and a clear reporting need.

Requirement: The platform should not introduce database persistence, full auth, live classrooms, or account management until the first student progression slice proves the core route behavior.

Current target slice:

Teacher launch protocol -> QR route -> flashcard entry practice -> completion event -> next game unlock -> playable Memory Match -> progress summary update.

Rationale:

- White-label impact: Positive. Proving the flow first keeps tenant assumptions from being embedded too early in auth or database tables.
- Cost impact: Positive. It avoids paying the build and maintenance cost of persistence before the product interaction is proven.
- Architecture impact: Positive. It lets the event contract settle before Supabase, another backend, or a custom service is chosen.

Revisit when:

- The interactive student slice works locally.
- Standard game events are emitted by at least one mode.
- Teacher launch and student unlock state have a clear persistence need.
- The next feature genuinely requires saved classroom state rather than temporary local state.

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

Status: Sample package, visible dashboard concept, active `/enter/ministar` front-door slice, and playable Memory Match implemented on `legacy-source-import`; real media playback, persistence, real teacher reports, permanent QR resolver, and local/closed packaging remain future implementation work.

Requirement: The platform must be able to support a white-label textbook partner who provides PDF units and needs a closed/local companion application with games, a multimedia platform, gamification, year-on-year content maintenance, teacher reporting, and long-lived QR codes printed in textbooks.

This requirement is part of the initial build, not a later add-on. It should guide content packages, PDF onboarding, media asset handling, route permanence, deployment packaging, teacher reports, and first-slice route decisions.

Implemented sample boundary:

- Shared contracts exist for content packages, audio/video media assets, unit multimedia plans, front-door entry mode, permanent QR routes, and audio support plans in `packages/content-model/src/index.ts`.
- A sample package exists in `apps/web/src/data/sampleMultimediaPackage.ts`.
- The dashboard shows the sample multimedia package, route concept, optional background-media plan, audio support plan, and teacher progress summary concept.
- `/enter/ministar` opens the sample unit package through entry-code/user-code local state.
- The front-door slice emits launch, flashcard, game, media, and background-media events into one teacher-visible report preview.
- Memory Match is playable from both `/launch/demo-unit-1` and `/enter/ministar`.
- Documentation exists in `docs/SAMPLE_MULTIMEDIA_PACKAGE.md`.

Required capabilities:

- Import or draft unit payloads from PDF textbook units.
- Preserve page, unit, activity, and edition references from the original textbook.
- Store audio, music, and video assets as tenant-owned multimedia catalog entries.
- Link tracks, chants, listening activities, lesson videos, music videos, or playlists to units and QR routes.
- Allow unit media to be used before games, after games, or optionally as controlled background/support media during games.
- Map textbook units to reusable game parent engines and mode configs.
- Support deterministic progression and earned rewards for partner tenants.
- Resolve printed QR codes through stable identifiers rather than fragile file paths.
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
- The platform should not make unrestricted switch-template behavior the default promise.
- Each unit should eventually identify required, recommended, optional, premium, printable, and blocked activities.
- Compatibility rules should explain why a payload can or cannot become a particular activity type.
- The current sample compatibility matrix must remain visible until the contract is promoted to shared package data.
- Printable/PDF outputs are planned and should be generated from reviewed package data.
- Private tenant libraries should come before any public community library.
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
- `docs/ACTIVITY_PATHWAY_COMPATIBILITY_MATRIX.md`
- `docs/UNIT_GAME_OFFER_MAP_CONTRACT.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`

## FR-007: Japanese As Target Language For White-Label Tenants

Status: Planned opportunity; not part of the current MiniStar English pilot.

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

Revisit when:

- A Japanese-language school or publisher opportunity appears.
- Content model language fields are revised.
- Text/spelling engine work expands beyond English spacing/tokenization.
- UI typography and ruby/furigana rendering are scoped.

References:

- `docs/ASSIST_LANGUAGE_STANDARD.md`
- `docs/COMPETITIVE_FEATURE_COVERAGE_MATRIX.md`
- `docs/PRINCIPLES_AND_STANDARDS.md`
