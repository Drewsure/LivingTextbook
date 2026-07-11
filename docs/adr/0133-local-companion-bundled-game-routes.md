# ADR 0133: Local Companion Bundled Game Routes

## Status

Accepted

## Context

The local companion preview showed media, QR fallback, handoff requirements, and a generated manifest snapshot. It still needed to represent the game routes that make the package a gamified companion rather than a media-only portal.

## Decision

Add local companion game summaries and render them on `/local/sample-publisher`.

## Consequences

- Publisher-facing local packages now show games, audio coverage, and reporting behavior.
- The generated manifest snapshot includes game route metadata.
- Local packages remain tied to reusable engines instead of one-off game pages.
