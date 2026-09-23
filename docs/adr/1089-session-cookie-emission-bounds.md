# ADR 1089: Session Cookie Emission Bounds

## Status

Accepted and implemented on `legacy-source-import`.

## Context

Session readers and creators already enforce bounded claims and lifetimes, but
the low-level `Set-Cookie` helpers accepted arbitrary expiration text. An
internal caller could therefore emit `Max-Age=NaN` or a value longer than the
session policy.

## Decision

Calculate `Max-Age` from a finite expiration timestamp, clamp it to the
matching session maximum, and emit zero for invalid input. Preserve the
existing HttpOnly, SameSite, Path, and production Secure attributes.

## Consequences

- Malformed emission input fails closed at the browser boundary.
- Session lifetime policy remains effective even for future internal callers.
- Existing shorter deployment-specific TTLs continue to work.

## Verification

Run `npm run verify:persistence-runtime` and the full
`npm run verify:foundation` gate after changing cookie emission.
