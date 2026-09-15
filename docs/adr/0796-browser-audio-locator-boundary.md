# ADR 0796: Browser Audio Locator Boundary

## Status

Accepted for the foundation slice.

## Context

Audio cues may eventually be supplied by white-label tenants, object storage,
or local companion bundles. A browser playback control must not assume every
locator is a web URL, especially when `localBundlePath` is intended for a
closed deployment. Unchecked values would make hosted playback brittle and
would blur the boundary between hosted and local media delivery.

## Decision

The browser audio primitive accepts same-origin paths and HTTP(S) URLs. It
rejects filesystem, script, data, and malformed locators and uses the existing
speech-synthesis fallback. A local companion must resolve its approved local
bundle path through a deployment-specific adapter before handing a browser
playable URL to the control.

## Consequences

- Hosted white-label tenants can use approved relative paths or CDN/object
  storage URLs.
- Invalid media metadata remains audible through a low-cost text fallback,
  while package and release gates still determine student readiness.
- Local companion delivery has a clear adapter boundary instead of a browser
  filesystem assumption.
- Audio playback still cannot change scoring, progression, mastery, rewards,
  assignments, or reporting.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation` after the slice is complete.
