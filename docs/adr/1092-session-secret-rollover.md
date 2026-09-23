# ADR 1092: Session Secret Rollover

## Status

Accepted and implemented on `legacy-source-import`.

## Context

White-label operators need a controlled way to rotate signing secrets without
forcing every active classroom session to expire at the exact rotation instant.
An unrestricted list of fallback secrets would create an indefinite trust
window and complicate incident response.

## Decision

Read at most the current strong secret and one strong `_PREVIOUS` value. Sign
new sessions with the current secret only. Ignore weak previous values and
deduplicate equal values.

## Consequences

- Rotation can be staged across a short operational window.
- Removing `_PREVIOUS` immediately revokes sessions signed only by the old key.
- A second previous key is intentionally unsupported.

## Verification

Run `npm run verify:persistence-runtime`, the teacher authorization verifier,
and the full `npm run verify:foundation` gate.
