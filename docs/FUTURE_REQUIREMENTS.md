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

Implemented boundary:

- Progress is held in local component state.
- Star Dust is calculated through the shared content model.
- Completion and unlock events are produced by an app-level local progression adapter.
- Memory Match unlocks as progression state, not as full gameplay yet.

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
