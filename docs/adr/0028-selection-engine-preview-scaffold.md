# ADR-0028: Selection Engine Preview Scaffold

Status: Accepted  
Date: 2026-07-01

## Context

Memory Match proves the first playable pairing-engine path. The platform still needs a second parent-engine direction for quiz-style and selected-response modes without building isolated games.

## Decision

Add a non-playable selection engine preview scaffold to the dashboard. The scaffold maps reviewed `UnitPayload` vocabulary and sentence data into deterministic selected-response rounds with audio prompt text, visible options, and expected standard events.

The scaffold is visible at:

- `http://127.0.0.1:3000/`

## Consequences

Positive:

- Establishes the next reusable parent-engine direction without premature game polish.
- Gives Z.ai or outside agents a stricter target for future Quiz, Balloon Pop, Whack-a-Mole, and arcade-selection prototypes.
- Keeps audio-first prompts and standard events in the design from the beginning.

Tradeoffs:

- This is not yet a playable game.
- Actual selection state, scoring, event emission, and mobile verification remain future work.
- Arcade skins must wait until the selection parent engine is stable.

## Related Documents

- `docs/SELECTION_ENGINE_SCAFFOLD.md`
- `docs/verification/SELECTION_ENGINE_PREVIEW_CHECKS.md`
- `docs/GAME_ENGINE_CONTRACTS.md`
