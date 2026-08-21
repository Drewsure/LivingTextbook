# DR-462: Game Mode Settings Storage Readiness

Decision: add a backend-neutral storage readiness packet for future game mode settings before any live teacher setting save exists.

Rationale: Teacher controls for timers, difficulty, motion, attempts, background media, and skins will eventually need persistence. Defining records and hosted/local write intents now keeps the white-label product portable and prevents a future quick save button from bypassing school policy, accessibility review, release control, learning-audio priority, deterministic scoring, or support-language boundaries.

Scope:

- Add review-only records for `game_mode_settings_profile`, `teacher_game_mode_settings_snapshot`, and `game_mode_settings_change_request`.
- Expose hosted and local write intent names for each future record.
- Wire the packet into teacher intake and `npm run verify:game-settings`.

Boundaries:

- No live teacher save button.
- No persisted timer or difficulty choice.
- No direct game skin or arcade speed mutation.
- No support-language-only progress.
- No background-media-only progress.
- No scoring profile override.
