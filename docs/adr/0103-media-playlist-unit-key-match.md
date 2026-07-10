# ADR 0103: Media Playlist Unit-Key Match

## Status

Accepted

## Context

The first media playlist panel was built from one-unit sample packages. That made package-id matching appear sufficient, but it would be wrong for multi-unit packages.

## Decision

Use `playlist.unitKey` to find the displayed unit context.

## Consequences

The scaffold is safer for larger packages and future publisher imports without changing the route contract.
