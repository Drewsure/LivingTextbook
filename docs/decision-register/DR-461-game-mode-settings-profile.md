# DR-461: Game Mode Settings Profile

Decision: add a review-only game mode settings profile before live teacher controls exist.

Rationale: Wordwall-style timer, difficulty, visual style, and gameplay options are useful, but this platform should introduce them through curated, tenant-safe profiles rather than an open switch-anything panel. This keeps young learner defaults gentle, preserves target-language-only progress, and avoids hidden scoring drift.

Scope:

- Active game modes receive review-only timer, difficulty, motion, attempts, audio, and background media policy.
- The teacher intake page shows the settings profile as evidence and planning, not as live controls.
- `npm run verify:game-settings` blocks missing profiles or missing safety boundaries.

Boundaries:

- No setting save.
- No scoring profile override.
- No background-media-only progress.
- No support-language-only mastery.
- No motion-heavy skin without accessibility review.
- Learning audio remains higher priority than music, media, sound effects, and celebration audio.
