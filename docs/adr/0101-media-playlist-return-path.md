# ADR 0101: Media Playlist Return Path

## Status

Accepted

## Context

The media playlist route became active and white-label, but opening a playlist had no obvious return to the unit flow.

## Decision

Pass a resolved return path into the media playlist panel and render a `Return to unit` link.

## Consequences

Students and testers can move between unit launch and package media more easily. The return path remains scaffold resolver data and can later be replaced by real launch/package context.
