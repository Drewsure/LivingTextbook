# DR-202: Teacher Media Library Preview Route

## Decision

Add a read-only teacher media library preview route for the sample publisher tenant.

## Rationale

A white-label textbook companion must let partners maintain media year on year, but live upload and replacement flows are too risky before storage, rights, review, release, and local bundle gates are implemented.

## Implications

- `http://127.0.0.1:3000/teacher/media/sample-publisher` is part of active route verification.
- The route shows `media_manifest`, `media_playlist_binding`, `background_media_policy_binding`, and `local_media_bundle_entry`.
- It shows partner-owned media rights records and blocked maintenance stages.
- Live media upload, automatic transcode-to-publish, media-only progress, background media overriding learning audio, video-only progress, and local folder activation remain blocked.

## Next

Use this route as the visible review surface before adding real upload, replacement, rights evidence, playlist edit, background-media assignment, or local bundle media workflows.
