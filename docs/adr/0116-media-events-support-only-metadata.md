# ADR 0116: Media Events Support-Only Metadata

## Status

Accepted

## Context

The platform now supports unit playlists, media playback telemetry, and optional game-background media. Those events are useful to teachers, but they should never be confused with learning mastery events.

## Decision

Add explicit support-only metadata to local media event factories.

## Consequences

- Teacher report previews can safely count media events as engagement context.
- Future persistence adapters receive the same no-unlock, no-mastery, zero-reward meaning.
- Game and media routes stay aligned with the audio-first progression rule.

