# DR-464: Game Mode Settings Backend Map Panel

Decision: add a compact teacher/admin backend map for game mode settings records.

Rationale: The detailed backend schema and persistence panels are intentionally comprehensive, but they are too large to act as a quick review surface. Game mode settings are safety-sensitive because they touch timers, difficulty, motion, attempts, background media, skins, arcade speed, scoring, and learning-audio priority. A compact map makes the full storage chain visible without introducing a save button.

Scope:

- Add `sampleGameModeSettingsBackendContractPlan`.
- Add `GameModeSettingsBackendContractPanel`.
- Render the panel on `/teacher/intake` beside the game mode settings profile and storage readiness panels.
- Extend `npm run verify:game-settings` and active route checks to require the panel.

Boundaries:

- No live settings persistence.
- No save settings button.
- No timer, difficulty, motion, arcade speed, skin, or background music mutation.
- No support-language-only progress.
- No media-only progress.
- No backend vendor selection.
