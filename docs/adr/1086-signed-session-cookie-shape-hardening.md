# ADR 1086: Signed Session Cookie Shape Hardening

## Status

Accepted and implemented on `legacy-source-import`.

## Context

Session signatures were verified, but the parser did not impose a size limit
on the signed value, did not require canonical two-part segmentation, and did
not uniformly validate student claim field types and lengths before use.

## Decision

Bound both session cookie values at 8 KiB, require exactly two dot-separated
segments, and validate bounded identity strings before temporal and tenant
authorization checks. Keep HMAC verification and all existing fail-closed
deployment and authorization gates.

## Consequences

- Malformed or oversized signed cookies are rejected early.
- Session identity fields cannot silently change type or grow without review.
- The same parser shape applies to student and teacher sessions.

## Verification

Run `npm run verify:persistence-runtime` and the full `npm run verify:foundation`
gate after changing session cookie parsing.
