# DR-225: Stable QR Route Content Verification

Date: 2026-07-15

## Decision

The active route verifier must content-check the sample stable QR alias route, not only confirm that it returns 200.

## Rationale

Printed QR codes are expensive to repair after textbooks ship. The foundation build should prove that the resolver preview shows the alias identity, resolved target, and guardrails every time verification runs.

## Standard

- Stable QR routes must show `Edition QR resolver preview`.
- The sample route must show the printed QR id, resolved target, stable alias rule, and guardrails.
- Direct localhost targets, direct media file targets, and unreviewed package swaps remain blocked.
- Production redirects and real textbook QR commitments remain deferred until durable route alias storage and release policy are accepted.
