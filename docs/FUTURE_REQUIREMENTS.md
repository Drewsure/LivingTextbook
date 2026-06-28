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
3. Student marks entry practice complete.
4. The app records an `entry_practice_completed` progress event.
5. The next recommended game, currently Memory Match, unlocks.
6. The displayed progression state updates with earned Star Dust.
7. Student starts the unlocked Memory Match shell.
8. The app records a standard `game_started` event.

Implemented boundary:

- Progress is held in local component state.
- Star Dust is calculated through the shared content model.
- Completion and unlock events are produced by an app-level local progression adapter.
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

Requirement: Before building major game engines, AI authoring subsystems, classroom monitoring, reward catalogs, avatar systems, PWA offline behavior, or content pipelines from scratch, conduct a deliberate public repository and best-practice research pass.

Purpose:

- Avoid reinventing solved problems.
- Identify proven patterns from high-quality open-source education, game, PWA, classroom, accessibility, and AI-content tools.
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
- Accessibility patterns for young learners and multilingual classrooms.

Revisit when:

- The first vertical slice is locally verified.
- A parent game engine is about to be built.
- Persistence/auth decisions are about to be made.
- A large custom UI, reward, avatar, or content pipeline is being proposed.
