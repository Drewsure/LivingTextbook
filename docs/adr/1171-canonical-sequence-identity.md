# ADR 1171: Canonical Sequence Identity

## Status

Accepted

## Context

The teacher and student shells render curated game offers and Training Academy
review sentences. Visible labels and sentence text are tenant-owned content;
they may repeat without representing the same row or control. Using those
values as UI identity creates reconciliation warnings and can cause controls
to be reused incorrectly.

## Decision

Use stable offer IDs or catalog mode IDs for `GameSequence` rows, with a
dedicated Training Academy identity. Use deterministic positions for Training
Academy sentence controls. Keep curated order, audio, route behavior,
progression, tenant scope, and review-only policy unchanged.

## Consequences

Duplicate labels and reviewed sentence text remain independently addressable
without UI identity collisions. The identity rule is presentation-only and
does not authorize offer mutation, progression unlocks, storage writes, or
student launch behavior.

## Verification

Run `node scripts/verify-review-list-key-stability.mjs` and the complete
`npm run verify:foundation` suite.
