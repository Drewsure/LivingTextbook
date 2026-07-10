# DR-099: White-Label Media Playlist Resolution

## Decision

The `/media/[playlistId]` scaffold resolves playlists from both the MiniStar reference package and the sample publisher package.

## Reason

The media platform is part of the white-label product, not a MiniStar-only feature. A second tenant playlist route proves that music/video metadata can travel with each publisher package.

## Standard

- Media playlist routes resolve by package playlist id.
- Tenant branding follows the resolved content package.
- Playlist routes remain rights-aware and metadata-first until real media storage/bundles are approved.
- The active route list includes at least one MiniStar playlist and one sample publisher playlist.
