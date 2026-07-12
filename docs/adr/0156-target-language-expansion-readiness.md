# ADR 0156: Target Language Expansion Readiness

## Status

Accepted

## Context

Living Textbook is a white-label platform. MiniStar English currently uses Japanese as optional assist support, but a Japanese-language school may later want Japanese as the target learning language.

Those are different products. Japanese as target language needs script policy, segmentation, audio, typing, and curriculum review that Japanese assist text does not prove.

## Decision

Add a target-language expansion readiness plan, teacher/admin panel, verifier, and contract.

## Consequences

- `/teacher/intake` shows Japanese target-language readiness and blockers.
- `npm run verify:target-language` is part of `npm run verify:foundation`.
- Assist language remains support-only.
- MiniStar English keeps English as the progression trigger.
- Japanese target-language pilots remain blocked until script, segmentation, audio, input, and teacher-review gates are solved.
