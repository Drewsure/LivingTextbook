# ADR 0797: Explicit Media Delivery Mode

## Status

Accepted for the foundation slice.

## Context

White-label packages need hosted, closed-local, and hybrid delivery options.
The existing resolver could return a local bundle path during its default
hosted-first path when no hosted source existed. A normal browser route should
not guess that a local package path is a web-accessible media URL.

## Decision

`hosted-first` returns a hosted source only and otherwise reports a missing
source. `local-first` returns the approved local bundle source first and may
fall back to a hosted source. A local companion integration must select
`local-first` explicitly and own the adapter that turns its bundle entry into a
playable runtime URL.

## Consequences

- Hosted tenant routes cannot accidentally claim local media availability.
- Closed local deployments retain a clear path without weakening hosted
  browser behavior.
- Hybrid deployments can choose local-first deliberately and document the
  hosted fallback.
- Rights, release, checksum, and learner-progress gates remain independent of
  the delivery mode.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:runtime-behavior`, and
`npm run verify:foundation` after the slice is complete.
