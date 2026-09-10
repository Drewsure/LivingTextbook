# DR-601: Background Media Mode Policy

Status: Accepted

Decision: Require multimedia plans to use unique, supported curated game-mode IDs when declaring allowed background media modes.

Guardrails:

- Allowed IDs must be supported curated game modes.
- Duplicate IDs are rejected.
- Background media remains subordinate to learning audio, instructions, scoring, and progression.
- Validation remains review-only and introduces no playback, autoplay, volume, storage, release, or student-state behavior.

Related records: `docs/adr/0530-background-media-mode-policy.md`, `docs/PRINCIPLES_AND_STANDARDS.md` section 72.
