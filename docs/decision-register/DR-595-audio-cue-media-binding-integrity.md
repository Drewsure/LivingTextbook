# DR-595: Audio Cue Media Binding Integrity

Status: Accepted

Decision: Validate every optional audio cue media-asset reference against package existence, audio kind, tenant, and unit boundaries.

Guardrails:

- Referenced media assets must exist in the package.
- Referenced media assets must be audio assets.
- Cue and asset tenant boundaries must match.
- Cue and asset unit boundaries must match when both are present.
- Text-to-speech and fallback voice cues may remain without a media asset ID.

Recorded in `docs/adr/0524-audio-cue-media-binding-integrity.md`.

