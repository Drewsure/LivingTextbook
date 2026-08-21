# ADR-0400: Fill in the Blank Active Route

Date: 2026-08-21

## Status

Accepted.

## Context

The foundation build already has entry practice, pairing, selection, spelling, typing, sentence construction, arcade scaffold, and speaking routes. The next game-mode slice should increase useful classroom coverage while staying inside the reusable parent-engine model and before any Z.ai intake is promoted into the app.

## Decision

Add `fill-in-the-blank` as an active text-spelling syntax route at `/fill/[code]`.

The route uses reviewed target sentences, hides one reviewed vocabulary word or phrase, provides deterministic answer choices, requires tap-to-speak learning audio, emits standard progress events, and scores through `syntax-construction-v1`.

## Consequences

- Positive: Teachers get a simpler syntax step before Sentence Builder.
- Positive: MiniStar and sample publisher packages prove the same white-label route.
- Positive: The mode can later be wrapped by a premium skin without changing the contract.
- Constraint: Support-language taps, media-only engagement, and background audio still cannot unlock progress.
- Constraint: Future Japanese target-language support will need reviewed segmentation rules before this mode is used beyond English-like spacing.

## Verification

See `docs/verification/FILL_IN_THE_BLANK_PLAYABLE_CHECKS.md`.
