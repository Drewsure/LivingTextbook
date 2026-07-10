# ADR 0099: White-Label Media Playlist Resolution

## Status

Accepted

## Context

The first media playlist scaffold used the MiniStar package. To protect the white-label product direction, the route should also demonstrate a publisher-owned playlist.

## Decision

Resolve `/media/[playlistId]` against the sample package set and render the page with the matching tenant brand.

## Consequences

The multimedia route is no longer MiniStar-only. Future persistence and routing work can replace the sample resolver with a real package lookup without changing the page contract.
