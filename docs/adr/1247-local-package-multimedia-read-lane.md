# ADR 1247: Local Package Multimedia Read Lane

## Status

Accepted for the first white-label pilot vertical slice.

## Decision

Serve approved local package audio, video, poster, and transcript files
through a disabled-by-default, package-scoped read lane. The lane validates
the approved content package and local-bundle manifest before resolving a
media asset path inside the package custody directory. The student runtime
reuses the canonical media engagement component and records only browser
rehearsal evidence.

## Consequences

- A publisher package can demonstrate real local multimedia playback without
  exposing arbitrary filesystem paths.
- The same media engagement events can be used by the teacher report lane
  without activating hosted persistence.
- The media read gate remains an explicit deployment decision and does not
  imply offline caching or rights approval.
- A later production adapter can replace the route implementation while
  preserving the package and content contracts.

## Verification

`scripts/verify-local-pilot-media-route.mjs` checks the package media reader,
API, route, canonical playback component, package-bound source mapping, and
side-effect boundaries. Foundation composition runs that verifier.
