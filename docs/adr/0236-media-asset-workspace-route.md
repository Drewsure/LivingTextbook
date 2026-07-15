# ADR 0236: Media Asset Workspace Route

## Status

Accepted.

## Context

White-label textbook partners need audio, music, video, playlists, background media, and local bundle media as part of the core Living Textbook package. The media library route shows readiness broadly, but one media candidate also needs a focused teacher-only review route before live upload, transcoding, playlist creation, or local folder activation exists.

## Decision

Add `/teacher/assets/media/sample-publisher-l1-u1-routines-media` as a teacher-only media asset workspace. The route renders `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, `local_media_bundle_entry`, `target_mapping_packet`, required packets, related evidence routes, and blocked live actions.

## Consequences

- Music and video are treated as governed unit assets, not loose uploads.
- Optional playback, learning-audio priority, no media-only progress, captions/transcript policy, checksums, and local path requirements stay visible.
- Live upload, transcoding, playlist creation, background-media assignment, local folder activation, route promotion, and media-only progress remain blocked.
- Active route verification grows to 44 checked routes.
