# DR-201: Multimedia Binding Storage Contract

## Decision

Add backend-neutral storage contracts for `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry`.

## Rationale

The platform already has `media_manifest` for media metadata and rights, but a saleable white-label textbook companion also needs durable rules for playlists, game background media, and closed/local bundle files.

## Implications

- Backend schema drafts include media playlist bindings, background media policy bindings, and local media bundle entries.
- Migration candidates and specs cover hosted and local storage paths.
- Durable records and persistence adapters preserve optional playback, non-mastery media policy, teacher controls, learning-audio priority, checksums, relative paths, update rules, and local activation blocks.
- Media-only progress, background media overriding learning audio, required video-only progress, and local folder activation remain blocked.

## Next

Keep media upload promotion disabled until storage, rights, review, release-control, local bundle, and teacher-control gates remain green.
