# DR-463: Game Mode Settings Backend Contract

Decision: promote game mode settings records into the backend storage contract before any live teacher setting save exists.

Rationale: The teacher-facing settings readiness panel is not enough by itself. White-label hosted and closed-local deployments need the same schema vocabulary, migration names, persistence categories, and shared type flags before timer, difficulty, motion, attempts, background media, skin, or arcade-speed controls can persist. This keeps future implementation vendor-neutral and stops a quick settings save from bypassing learning-audio priority, target-language-only progress, accessibility review, school policy, release control, deterministic scoring, or safe defaults.

Scope:

- Add backend schema entities for `game_mode_settings_profile`, `teacher_game_mode_settings_snapshot`, and `game_mode_settings_change_request`.
- Add migration candidate and migration spec coverage for game mode settings storage.
- Add hosted and local persistence adapter write intents for the three record categories.
- Add shared content-model category and write-intent flags for the game settings storage contract.
- Extend `npm run verify:backend-storage` to require the new records, flags, and write intents.

Boundaries:

- No live teacher save button.
- No persisted timer or difficulty choice.
- No arcade speed, game skin, background music, or safe-default mutation.
- No support-language-only progress.
- No media-only progress.
- No scoring profile override.
- No backend vendor selection.
