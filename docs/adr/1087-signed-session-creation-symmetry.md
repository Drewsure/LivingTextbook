# ADR 1087: Signed Session Creation Symmetry

## Status

Accepted and implemented on `legacy-source-import`.

## Context

The signed-session readers rejected malformed, oversized, and inverted claims,
but the exported creator functions trusted their typed inputs. Future internal
callers could otherwise mint a cookie that the reader would reject.

## Decision

Student and teacher cookie creators validate the shared claim shape, require an
ordered future expiry, and enforce the same 8 KiB encoded cookie bound before
signing. Invalid creator input returns `undefined`.

## Consequences

- Creator and reader behavior is symmetric and fail-closed.
- Route validation remains useful but is no longer the only defense.
- No persistence, tenant authority, or report access is activated by creation.

## Verification

Run the persistence and teacher authorization verifiers, then the full
`npm run verify:foundation` gate after changing session creators.
