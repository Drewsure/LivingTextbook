# 2026-08-21 Game Mode Settings Backend Contract

Promoted game mode settings storage from a review-only teacher panel into the backend-neutral storage contract.

The contract now covers schema entities, migration candidates, migration specs, hosted and local adapter write intents, shared persistence categories, and typed evidence flags for:

- `game_mode_settings_profile`
- `teacher_game_mode_settings_snapshot`
- `game_mode_settings_change_request`

This preserves teacher control planning without enabling live saves. The future settings path remains blocked from mutating timer/difficulty choices, arcade speed, game skins, background music, scoring profiles, support-language progress, media-only progress, classroom launch state, or report export until policy, accessibility, release-control, and persistence gates pass.

Verification:

- `npm run verify:backend-storage`
- `npm run typecheck --workspace @living-textbook/web`
- `npm run verify:foundation`
