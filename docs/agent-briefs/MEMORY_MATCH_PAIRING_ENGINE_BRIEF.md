# Agent Brief: Memory Match Pairing Engine

Audience: Z.ai or another outside AI builder

Status: Future implementation brief, not yet assigned

Owner: Codex retains architecture, schema, integration, and final review control.

## Objective

Build a clean Memory Match implementation as the first real mode of the `pairing` parent engine.

The work must integrate with the existing Living Textbook contracts instead of creating a standalone game.

## Required Source Context

Read before building:

- `docs/PRINCIPLES_AND_STANDARDS.md`
- `docs/GAME_ENGINE_CONTRACTS.md`
- `docs/COMPONENT_STRUCTURE.md`
- `docs/ROUTE_CONTRACTS.md`
- `apps/web/src/features/game-shell/gameModeCatalog.ts`
- `apps/web/src/features/game-shell/pairing/pairingEngineAdapter.ts`
- `apps/web/src/features/game-shell/pairing/pairingEngineState.ts`

## Required Inputs

The engine must accept:

- `UnitPayload`
- `LaunchSession`
- `StudentProgressionState`
- Tenant display configuration
- Mode catalog item for `memory-match`

## Required Outputs

The engine must emit standard `GameProgressEvent` records:

- `round_shown`
- `answer_submitted`
- `answer_result`
- `game_completed`
- `mastery_updated`

It may also emit:

- `powerup_used` if a future power-up is wired in

## Implementation Constraints

- Do not add database persistence.
- Do not add authentication.
- Do not add a new styling system.
- Do not hard-code MiniStar as the only tenant.
- Do not copy legacy code directly into the canonical app.
- Do not introduce paid dependencies or heavy game frameworks without approval.
- Do not add premium animation, mascot art, particles, or collection-room visuals in this task.
- Use tenant CSS variables for colors and focus states.
- Keep mobile-first classroom QR use in mind.

## Expected Component Shape

Preferred target structure:

- `MemoryMatchEngine.tsx`: client orchestrator for board state and emitted events.
- `MemoryMatchBoard.tsx`: visual board component.
- `MemoryMatchCard.tsx`: stable card/button component.
- `memoryMatchScoring.ts`: local scoring helper if needed.

The existing pure state helper should remain separate:

- `pairingEngineState.ts`

## Acceptance Criteria

- Student can start from the existing unlocked Memory Match shell.
- Board renders generated pair cards from the current unit vocabulary.
- Selecting two matching cards marks the pair as matched.
- Selecting two non-matching cards records an incorrect result and returns them to available state.
- Completing all pairs emits `game_completed`.
- Completion can produce Star Dust using the shared scoring model or a documented local helper.
- Layout works on mobile and desktop.
- Buttons are keyboard-focusable and accessible.
- No visual polish replaces structure.

## Review Requirements

Codex must review before integration:

- Event contract correctness
- Tenant-token styling
- Component boundaries
- Mobile layout
- Accessibility
- Dependency changes
- Whether implementation stays within this brief
