# DR-110: Media Playlist Demo Controls

## Decision

Active media playlist routes should include local demo controls for media telemetry.

## Reason

The media route should demonstrate the same reporting contract as the front-door media slice without requiring real production media files or backend storage.

## Standard

- Playlist routes can emit local `media_started`, `media_paused`, and `media_completed` preview events.
- Demo controls do not write production reports, unlock games, or award mastery.
- The controls reuse the shared media playback card rather than creating a second media-control pattern.
