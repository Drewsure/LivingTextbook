# ADR 0200: Multimedia Asset Readiness Preview

Date: 2026-07-14

## Status

Accepted

## Context

The white-label platform must support textbook companions that include audio, music, video, posters, captions, playlists, optional game-background media, and closed/local media bundles. These media assets are core to the Living Textbook package, but live upload controls, processing, transcoding, playlist promotion, background-media assignment, and local folder activation must remain blocked until review, storage, rights, and release gates exist.

## Decision

Add a read-only multimedia asset readiness preview to `/teacher/intake`.

The preview names the target records required before uploaded media can become active unit assets:

- `media_manifest`
- `media_playlist_binding`
- `background_media_policy_binding`
- `local_media_bundle_entry`

It preserves the rule that learner-critical target-language audio remains separate from music/video enrichment. Background media must yield to learning audio, videos need caption/transcript and fallback policy, local bundles need checksums and relative paths, and passive media cannot trigger mastery by itself.

## Consequences

Future multimedia upload work has a visible gate before implementation. Media uploads cannot become active playlists, required videos, background tracks, local bundle entries, or mastery triggers by preview state, folder placement, or transcode completion alone.

This does not implement live upload controls, object storage, media processing, transcoding, playlist promotion, background-media assignment, or local media bundle activation.
