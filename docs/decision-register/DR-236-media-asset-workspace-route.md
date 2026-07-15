# DR-236: Media Asset Workspace Route

## Decision

Add a teacher-only media asset workspace route for reviewed audio, music, video, playlist, background-media, and local-bundle candidates.

## Rationale

Media is part of the Living Textbook core package, especially for white-label textbook partners. A dedicated workspace lets us review media manifests, playlist bindings, background-media policy, local bundle entries, rights, optional playback, captions, checksums, and learning-audio priority without enabling live uploads or media-only progress.

## Implications

- `/teacher/assets/media/sample-publisher-l1-u1-routines-media` is active scaffold only.
- The route shows `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, `local_media_bundle_entry`, and `target_mapping_packet`.
- Live upload, transcoding, playlist creation, background-media assignment, local folder activation, route promotion, and media-only progress remain blocked.
- Active route verification now covers 44 routes.

## Next

Only build live media upload or playlist editing after media storage, rights proof, caption/transcript policy, background-audio priority, local bundle checksums, and release-control gates are implemented.
