# ADR 0225: Stable QR Route Content Verification

Date: 2026-07-15

## Status

Accepted

## Context

The stable `/q/...` resolver route is the future printed-textbook doorway for white-label publishers. It was already included in active route checks, but only as a 200 response. That is not strong enough for a printed QR promise.

## Decision

Add content expectations for the sample stable QR alias route to the active route verifier.

The verifier now checks the resolver preview for the printed QR id, stable alias rule, resolved target, guardrails, blocked target examples, and open-preview link.

## Consequences

- Stable QR regressions become visible during foundation verification.
- The route checker now protects the alias layer from becoming a thin load-only check.
- This does not enable production redirects, real printed QR commitments, durable alias storage, or local-bundle activation.
