# DR-107: Media Playlist Opened Event

## Decision

Add `media_playlist_opened` as a distinct report-only event.

## Reason

Opening a playlist route is useful teacher context, but it is not the same as playing or completing media. It must not be recorded as `media_started`, mastery, Star Dust, or a game unlock.

## Standard

- Student unit media shortcuts emit `media_playlist_opened`.
- The event records playlist id and route href.
- It sets progression and mastery permissions to false and awards zero Star Dust.
- Teacher monitors show playlist opens separately from asset playback events.
