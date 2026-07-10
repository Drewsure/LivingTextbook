# ADR 0098: Media Playlist Route Scaffold

## Status

Accepted

## Context

The platform already models media assets, playlists, multimedia plans, and local bundle paths. The route contract for `/media/[playlistId]` was still future, which left the multimedia product promise less concrete than games and teacher reports.

## Decision

Add an active media playlist scaffold route for the MiniStar sample package and include it in active route verification.

## Consequences

The white-label multimedia strategy becomes visible in the working app. The route remains metadata-first and does not pretend that missing sample MP3/MP4 files are production-ready assets.
