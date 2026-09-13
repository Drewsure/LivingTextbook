# ADR 0695: Type Answer Canonical Entry Integration

## Status

Accepted

## Context

Type Answer was already a reviewed text-spelling activity with target-language
prompt audio, input guidance, replay controls, deterministic typed-response
scoring, replay evidence, standard interaction events, and canonical
completion handling. The curated path could recommend it after the selection
activities, but the student and front-door flows still rendered it as a
preview.

## Decision

Mount `TypeAnswerPracticeGame` in the student and front-door flows when the
active mode is `type-answer`. The wrapper owns the input round and scoring;
the parent collects events and applies the shared identity and completion gate.
Remaining unpromoted modes stay explicit previews.

## Consequences

- The curated path now includes canonical typed-response practice.
- Target-language listening and typed answer activity remain authoritative;
  support language cannot unlock or award progress.
- Blank or incorrect attempts remain deterministic evidence rather than a
  random reward path.
- No Z.ai/Phaser source is imported or activated.

## Verification

- Canonical integration verification requires Type Answer in both launch
  flows.
- Web typecheck, production webpack build, and all active route checks pass.
