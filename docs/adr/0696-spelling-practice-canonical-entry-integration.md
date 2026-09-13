# ADR 0696: Spelling Practice Canonical Entry Integration

## Status

Accepted

## Context

Spelling Practice was already a reviewed text-spelling activity with
target-language prompt audio, tap-to-speak instruction and feedback, replay
controls, deterministic letter-tile scoring, replay evidence, standard
interaction events, and canonical completion handling. The curated path could
recommend it, but the student and front-door flows still rendered it as a
preview.

## Decision

Mount `SpellingPracticeGame` in the student and front-door flows when the
active mode is `spelling-practice`. The wrapper owns the letter-tile round and
scoring; the parent collects events and applies the shared identity and
completion gate. The current canonical fixture supports English letter
normalization only. Japanese script-aware spelling and segmentation require a
separate reviewed implementation before promotion.

## Consequences

- The curated path now includes canonical spelling practice.
- Target-language listening and spelling activity remain authoritative;
  support language cannot unlock or award progress.
- Incorrect attempts remain deterministic evidence rather than a random reward
  path.
- White-label tenants must declare compatible target-language script behavior.
- No Z.ai/Phaser source is imported or activated.

## Verification

- Canonical integration verification requires Spelling Practice in both launch
  flows.
- Web typecheck, production webpack build, and all active route checks pass.
