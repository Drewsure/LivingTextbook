# DR-029: Selection Engine Preview Scaffold

Status: Accepted  
Date: 2026-07-01

## Decision

Add a non-playable selection engine preview scaffold before building additional quiz or arcade-selection game modes. The preview must remain data-driven, audio-first, and aligned to standard progress events.

## White-Label Impact

Positive. A reusable selection parent engine can support many tenants and many skins without hard-coding MiniStar-specific game screens.

## Cost Impact

Strongly positive. Building one parent engine and multiple mode skins is cheaper than creating separate Quiz, Balloon Pop, Whack-a-Mole, Airplane, and Maze Chase implementations from scratch.

## Constraints

- The preview is not a finished game.
- It must use reviewed `UnitPayload` data.
- Prompt and option text must carry audio text.
- Vocabulary and syntax prompts must remain distinct.
- Standard event expectations must be visible before active gameplay.
- Arcade skins must wait until the selection parent engine is stable.

## Verification

Use `docs/verification/SELECTION_ENGINE_PREVIEW_CHECKS.md` and verify `http://127.0.0.1:3000/` after pulling and rebuilding.

## Related Files

- `apps/web/src/features/game-shell/selection/selectionEngineAdapter.ts`
- `apps/web/src/features/game-shell/selection/SelectionEnginePreview.tsx`
- `docs/SELECTION_ENGINE_SCAFFOLD.md`
- `docs/adr/0028-selection-engine-preview-scaffold.md`
