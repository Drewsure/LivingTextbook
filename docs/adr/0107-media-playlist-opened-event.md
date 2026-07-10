# ADR 0107: Media Playlist Opened Event

## Status

Accepted

## Context

The student flow now includes package-driven unit media shortcuts. Clicking the shortcut should be reportable, but treating that as playback would overstate engagement.

## Decision

Add `media_playlist_opened` to the shared event type union, local progression adapter, progress taxonomy, student media shortcut, and teacher monitor sample stream.

## Consequences

Teacher reports can distinguish playlist interest from playback. Media remains support activity unless a real playback or learning event occurs.
