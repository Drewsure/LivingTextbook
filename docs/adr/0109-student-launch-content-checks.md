# ADR 0109: Student Launch Content Checks

## Status

Accepted

## Context

Student launch pages now expose package-driven media shortcuts. The active route verifier checks important teacher and media pages, but not the launch-page media shortcut.

## Decision

Add expected text checks for `Unit media` on the MiniStar and sample publisher launch routes.

## Consequences

Foundation verification catches regressions where launch pages load but lose the media package connection.
