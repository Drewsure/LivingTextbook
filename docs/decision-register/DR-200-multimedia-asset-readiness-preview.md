# DR-200: Multimedia Asset Readiness Preview

## Decision

Add a read-only multimedia asset readiness preview for uploaded audio, music, video, posters, captions, playlists, background media, and local bundle media.

## Rationale

Multimedia is part of the Living Textbook core package, especially for white-label textbook companions. The platform needs a visible review and storage boundary before media uploads can become active unit assets, game backgrounds, playlists, or local package files.

## Implications

- `/teacher/intake` shows multimedia asset readiness.
- The preview names `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry`.
- Learning audio remains separate from enrichment media.
- Background media cannot override tap-to-speak or learner-critical audio.
- Videos require caption/transcript and fallback policy before use.
- Local media bundles require checksums, relative paths, update rules, and release gates.
- Media-only progress, unlicensed media, raw learner audio storage, automatic transcode-to-publish, and local folder activation remain blocked.

## Next

Add storage contracts for playlist binding, background-media policy binding, and local media bundle entries before live media upload promotion or local package media activation.
