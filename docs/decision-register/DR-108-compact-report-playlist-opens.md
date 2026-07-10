# DR-108: Compact Report Playlist Opens

## Decision

The compact teacher-visible report preview should show playlist opens separately from media starts, pauses, and completions.

## Reason

Opening the media route is useful context, but it is not playback. Both the detailed monitor and compact report should preserve that distinction.

## Standard

- `media_playlist_opened` counts as `Playlist opens`.
- Media starts, pauses, and completions stay separate.
- Playlist opens remain report-only and do not affect rewards, mastery, or unlocks.
