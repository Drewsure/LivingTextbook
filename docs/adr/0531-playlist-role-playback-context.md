# ADR-0531: Playlist Role And Playback Context

Status: Accepted

## Context

Playlists carry both a usage role and a playback context. Without a consistency check, a playlist could declare `game-background` while retaining a `primary` role, leaving future engines and teacher review with contradictory policy.

## Decision

A playlist with `game-background` playback context must use the `background` usage role.

## Consequences

- Background media intent is explicit in package review and future local manifests.
- Primary learning media is less likely to be treated as ambient media.
- Rights, teacher enablement, audio priority, storage, and playback remain separate decisions.

## Verification

- Runtime behavior tests cover a contradictory role/context pair.
- The full foundation gate must pass typechecks, production build, and all active routes.
