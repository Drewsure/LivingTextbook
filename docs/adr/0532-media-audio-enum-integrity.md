# ADR-0532: Media And Audio Enum Integrity

Status: Accepted

## Context

Content packages may be produced by PDF extraction, AI authoring, tenant uploads, or partner imports. Their JSON data is not protected by TypeScript at runtime. Media and audio fields could therefore carry unknown values while still passing some structural checks.

## Decision

Validate media asset type, kind, and rights status; audio cue kind and source; and playlist usage role and playback context against the shared supported catalogs.

## Consequences

- Imported data receives deterministic repair errors before review or release.
- Future media, game, local-bundle, and reporting adapters can rely on known values.
- Adding a new catalog value becomes an explicit schema change.
- Validation remains provider-neutral and side-effect free.

## Verification

- Runtime behavior tests cover invalid values across media assets, audio cues, and playlists.
- The full foundation gate must pass typechecks, production build, and all active routes.
