# DR-603: Playlist Role And Playback Context

Status: Accepted

Decision: Require playlists declared for `game-background` playback to use the `background` usage role.

Guardrails:

- Contradictory role/context pairs are rejected.
- Rights, tenant, unit, teacher enablement, and learning-audio priority remain separate checks.
- Validation has no playback, volume, progress, persistence, or release side effect.

Related records: `docs/adr/0531-playlist-role-playback-context.md`, `docs/PRINCIPLES_AND_STANDARDS.md` section 73.
