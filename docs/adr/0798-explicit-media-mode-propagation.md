# ADR 0798: Explicit Media Mode Propagation

## Status

Accepted for the foundation slice.

## Context

The shared media resolver already distinguishes hosted-first and local-first
delivery. If the component chain relies only on a resolver default, a future
local companion change could silently affect hosted routes or make deployment
intent difficult to review.

## Decision

Playlist, unit engagement, event preview, and playback components accept an
explicit `mediaResolutionMode`. Hosted routes pass `hosted-first`. A future
local or hybrid companion must pass `local-first` from its deployment adapter
after its bundle-path and offline policy are verified.

## Consequences

- Current hosted behavior is unchanged and visible at the route boundary.
- Local delivery has a defined injection point without importing local paths
  into game components.
- Delivery mode remains independent from rights, release, scoring,
  progression, rewards, and reporting.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation` after the slice is complete.
