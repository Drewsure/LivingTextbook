# ADR 0388: Spelling Practice Active Route

Date: 2026-08-21

## Status

Accepted

## Context

The Living Textbook foundation now has active entry, pairing, selection, typing, syntax, speaking, media, training, print, assignment, and teacher-review routes. The text-spelling engine still needs a more guided spelling mode before learners reach free typing or sentence construction.

## Decision

Introduce Spelling Practice as a first-class `/spelling/[code]` route using the shared text-spelling parent engine, shared scoring profile rules, shared audio cue policy, and shared route verification.

## Consequences

- The curated activity pathway can offer a spelling step without creating a new isolated game architecture.
- Teacher assignment plans and local companion packages can include spelling review beside Type Answer and Sentence Builder.
- Route verification increases to 73 checked routes.
- Support-language interactions remain explicitly non-progressing.

## Links

- `docs/decision-register/DR-459-spelling-practice-active-route.md`
- `docs/verification/SPELLING_PRACTICE_PLAYABLE_CHECKS.md`
