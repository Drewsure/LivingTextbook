# ADR 0110: Media Playlist Demo Controls

## Status

Accepted

## Context

The `/media/[playlistId]` route showed reviewed playlist metadata but did not demonstrate playback telemetry directly. A separate front-door media component already had media control patterns.

## Decision

Add a small client-side media playlist event preview that reuses `UnitMediaPlaybackCard` and local media event creation.

## Consequences

Playlist routes become more useful for testing and partner demos while staying honest that production reporting needs persistence and policy.
