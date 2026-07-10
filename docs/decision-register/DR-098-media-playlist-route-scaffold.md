# DR-098: Media Playlist Route Scaffold

## Decision

Add an active `/media/[playlistId]` scaffold route for reviewed content-package playlists.

## Reason

Music and video are part of the Living Textbook product promise, especially for white-label textbook partners. Media should be package-linked and rights-aware from the start, not bolted on later as loose files.

## Standard

- Playlist routes show package metadata, media rights, source paths, and local bundle paths.
- Optional game-background media is teacher-controlled and off by default.
- Media routes do not store raw learner audio, learner recordings, or transcripts in progress records.
- Missing demo files should not break the scaffold; production playback remains gated by rights, bundle, and deployment policy.
