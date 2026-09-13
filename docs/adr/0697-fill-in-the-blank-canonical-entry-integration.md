# ADR 0697: Fill in the Blank Canonical Entry Integration

## Status

Accepted

## Context

Fill in the Blank was already a reviewed text-spelling activity with
target-language sentence and choice audio, tap-to-speak prompt and feedback,
replay controls, deterministic choice scoring, replay evidence, standard
interaction events, and canonical completion handling. The curated path could
recommend it, but the student and front-door flows still rendered it as a
preview.

## Decision

Mount `FillInBlankPracticeGame` in the student and front-door flows when the
active mode is `fill-in-the-blank`. The wrapper owns the reviewed sentence
round and scoring; the parent collects events and applies the shared identity
and completion gate. The current canonical fixture supports English answer
normalization only. Japanese script-aware segmentation requires a separate
reviewed implementation before promotion.

## Consequences

- The curated path now includes canonical syntax reinforcement.
- Target-language listening and answer activity remain authoritative; support
  language cannot unlock or award progress.
- Incorrect attempts remain deterministic evidence rather than a random reward
  path.
- White-label tenants must declare compatible target-language script behavior.
- No Z.ai/Phaser source is imported or activated.

## Verification

- Canonical integration verification requires Fill in the Blank in both launch
  flows.
- Web typecheck, production webpack build, and all active route checks pass.
