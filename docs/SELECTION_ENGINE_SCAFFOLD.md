# Selection Engine Scaffold

Document type: parent-engine scaffold  
Status: active preview, not playable  
Last updated: 2026-07-01

## Purpose

The selection engine is the second reusable parent-engine direction after the playable pairing/Memory Match path. It should power quiz-style and selected-response modes without creating 48 isolated games.

Potential mode skins include:

- Quiz,
- True or False,
- Gameshow Quiz,
- Balloon Pop,
- Whack-a-Mole-style target selection,
- Airplane-style target selection,
- Maze Chase-style target selection.

## Current Route

Review at:

- `http://127.0.0.1:3000/`

The dashboard shows a `Selection Engine Preview` card. This is a preview scaffold, not a finished game.

## Current Code

- `apps/web/src/features/game-shell/selection/selectionEngineAdapter.ts`
- `apps/web/src/features/game-shell/selection/SelectionEnginePreview.tsx`
- `apps/web/src/features/dashboard/DashboardOverview.tsx`

## Scaffold Rules

- Selection prompts are generated from reviewed `UnitPayload` data.
- Vocabulary and syntax prompts remain separate.
- Prompt text and option text carry audio text.
- Rounds are deterministic in the scaffold; no random answer ordering is required yet.
- Standard event expectations are visible before active gameplay.
- The engine preview must not claim to be a playable assessment.

## Required Future Promotion Steps

Before the selection engine becomes playable, it needs:

- active answer selection state,
- standard progress event emission,
- scoring profile application,
- audio cue resolution from package audio plans,
- teacher-visible event reporting,
- mobile classroom verification,
- mode-specific skins only after the parent engine is stable.

## Non-Goals

- No finished Quiz mode is shipped by this scaffold.
- No arcade physics or animation is introduced here.
- No random reward or pressure loop is introduced here.
- No AI generation happens inside the game engine.
