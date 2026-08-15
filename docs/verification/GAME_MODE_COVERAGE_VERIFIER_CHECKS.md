# Game Mode Coverage Verifier Checks

## Scope

Run after shared game mode, catalog, scoring, route, game prototype, Z.ai delegation, audio coverage, or engine work.

## Checks

- Confirm `npm run verify:game-modes` passes.
- Confirm every shared `GameModeId` appears in `gameModeCatalog`.
- Confirm every shared `GameModeId` has deterministic scoring profile mapping.
- Confirm every shared `GameModeId` declares required learner audio.
- Confirm every shared `GameModeId` has a parent engine mapping.
- Confirm every active playable mode has a route contract and helper, including `match-up` at `/match/[code]`, `label-it` at `/label-it/[code]`, `true-false` at `/true-false/[code]`, `type-answer` at `/type-answer/[code]`, and `balloon-pop` at `/balloon/[code]`.
- Confirm external prototypes do not become platform modes until this verifier passes.

## Verification Command

```powershell
npm run verify:foundation
```
