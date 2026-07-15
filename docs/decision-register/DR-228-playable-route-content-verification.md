# DR-228: Playable Route Content Verification

Date: 2026-07-15

## Decision

Training Academy, Quiz, Sentence Builder, and Speak It routes must be content-checked in active route verification for both sample tenants.

## Rationale

Load-only checks can miss white-label regressions. The sample publisher Training Academy route must render sample publisher content, not MiniStar fallback data.

## Standard

- Training Academy must use the shared launch resolver.
- MiniStar playable route checks must include `Greetings`.
- Sample publisher playable route checks must include `Daily Routines`.
- Route verification must check activity shell markers for Training Academy, Quiz, Sentence Builder, and Speak It.
