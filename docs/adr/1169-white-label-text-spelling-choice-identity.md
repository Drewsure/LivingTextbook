# ADR 1169: White-Label Text/Spelling Choice Identity

## Status

Accepted

## Context

The Text/Spelling parent engine renders tenant-owned sentences and answer
choices. Label-derived identity is unsafe when punctuation, spacing, or
hyphenation differs across otherwise similar content. Those labels must remain
visible and speakable, but they cannot be trusted as stable UI identity.

## Decision

Use deterministic position-based IDs for Sentence Builder tiles and explicit
position-based IDs for Fill in the Blank choices. Keep learner-visible labels,
audio lookup, answer correctness, scoring, progression, and replay identity
under their existing contracts.

## Consequences

White-label content may safely contain punctuation and formatting variants
without duplicate interaction keys or browser-dependent reconciliation. This
is an identity safeguard only; it does not normalize tenant content or change
the pedagogical answer.

## Verification

Run `npm run verify:text-spelling-engine-runtime` and the complete
`npm run verify:foundation` suite.
