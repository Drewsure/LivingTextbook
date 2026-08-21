# Game Mode Settings Profile Checks

Purpose: keep teacher-facing timer, difficulty, motion, attempts, background media, and audio-priority settings as reviewed profiles before any live setting save exists.

Required command:

```powershell
npm run verify:game-settings
```

Acceptance criteria:

- Active modes have a settings profile before teacher-adjustable controls are implemented.
- Profiles state that no setting save is allowed until school policy, persistence, and release-control gates are accepted.
- Target-language events remain the only mastery, Star Dust, and next-step trigger.
- Assist-language text, audio, hints, and UI labels remain support-only.
- Learning audio has priority over background media, music, sound effects, and celebrations.
- Timer, difficulty, motion, attempts, and background media rules cannot override scoring profiles.
- Future storage readiness shows backend-neutral records, hosted write intents, and local write intents.

Blocked until later:

- Live teacher setting saves.
- Persisted timer or difficulty choices.
- Persisted settings snapshots.
- Motion-heavy skins without accessibility review.
- Background media that masks learning audio.
- Any support-language-only progress path.
- Any settings panel that changes deterministic scoring.
