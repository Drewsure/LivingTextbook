# ADR 0201: Multimedia Binding Storage Contract

Date: 2026-07-14

## Status

Accepted

## Context

The multimedia asset readiness preview names `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry` as required target records. The existing `media_manifest` record covers media metadata and rights, but it does not by itself describe when media is bound to playlists, attached as game background media, or activated inside closed/local textbook bundles.

## Decision

Promote the three multimedia binding records into the backend-neutral storage contract.

`media_playlist_binding` preserves unit playlist membership, ordered media references, optional playback policy, review status, and a media-only progress block.

`background_media_policy_binding` preserves game background media settings, teacher controls, mute/duck/pause behavior, learning-audio priority, and non-scoring policy.

`local_media_bundle_entry` preserves checksums, relative bundle paths, rights proof, update rules, release-gate state, and local activation blocks.

Add schema entities, migration candidates, migration specs, hosted/local adapter write intents, durable records, and verifier coverage for all three records. Add a first `spec-media-manifest` migration spec as the base media record that these bindings reference.

## Consequences

Future live media upload work can support hosted and local textbook packages without relying on playlist preview state, background media settings, or local folder placement as activation. Passive media cannot become mastery evidence, background media must yield to learning audio, and local files cannot activate without reviewed bundle entries.

This does not implement live media upload, transcoding, playlist promotion, background-media assignment, or local media bundle activation.
