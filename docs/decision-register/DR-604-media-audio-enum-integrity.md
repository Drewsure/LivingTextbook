# DR-604: Media And Audio Enum Integrity

Status: Accepted

Decision: Validate runtime media, audio, and playlist enum values against the supported content-model catalog.

Guardrails:

- Media type, kind, and rights status must be supported values.
- Audio cue kind and source must be supported values.
- Playlist usage role and playback context must be supported values.
- No live provider, storage, playback, release, assignment, or student-state behavior is introduced.

Related records: `docs/adr/0532-media-audio-enum-integrity.md`, `docs/PRINCIPLES_AND_STANDARDS.md` section 74.
