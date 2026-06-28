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

Status: Active checkpoint

Requirement: The platform should not introduce database persistence, full auth, live classrooms, or account management until the first student progression slice proves the core route behavior.

Current target slice:

Teacher launch protocol -> QR route -> flashcard entry practice -> completion event -> next game unlock -> progress summary update.

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
4. Student marks entry practice complete.
5. The app records an `entry_practice_completed` progress event.
6. The next recommended game, currently Memory Match, unlocks.
7. The displayed progression state updates with earned Star Dust.
8. The first deterministic reward unlocks.
9. Student starts the unlocked Memory Match shell.
10. The app records a standard `game_started` event.

Implemented boundary:

- Progress is held in local component state.
- Star Dust is calculated through the shared content model.
- Completion and unlock events are produced by an app-level local progression adapter.
- Earned rewards are deterministic catalog entries, not random rewards.
- Memory Match unlocks and starts as progression state, not as full gameplay yet.

Remaining verification:

- Run local typecheck/build when the working branch is locally accessible.
- Visually inspect `/launch/demo-unit-1` in the browser.
- Confirm mobile layout remains readable after the state changes.

Non-goals:

- Real database persistence.
- Authentication.
- Live teacher monitoring.
- Premium mascot animation.
- Full Memory Match gameplay.
- Collection room rendering.

## FR-003: Public Repository Research Before Major Reinvention

Status: Future research checkpoint

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

## FR-004: Textbook Partner Local Companion And Multimedia Platform

Status: Sample package and visible dashboard concept implemented on `legacy-source-import`; real media playback, front-door route handling, persistence, and local/closed packaging remain future implementation work.

Requirement: The platform must be able to support a white-label textbook partner who provides PDF units and needs a closed/local companion application with games, a multimedia platform, gamification, year-on-year content maintenance, teacher reporting, and long-lived QR codes printed in textbooks.

This requirement is part of the initial build, not a later add-on. It should guide content packages, PDF onboarding, media asset handling, route permanence, deployment packaging, teacher reports, and first-slice route decisions.

Implemented sample boundary:

- Shared contracts exist for content packages, audio/video media assets, unit multimedia plans, front-door entry mode, and permanent QR routes in `packages/content-model/src/index.ts`.
- A sample package exists in `apps/web/src/data/sampleMultimediaPackage.ts`.
- The dashboard shows the sample multimedia package, route concept, optional background-media plan, and teacher progress summary concept.
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
- The front-door entry-code/user-code flow is designed.
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
