# ADR 0694: True or False Canonical Entry Integration

## Status

Accepted

## Context

True or False was already a reviewed standalone selection activity with
target-language prompt and card audio, deterministic scoring, replay evidence,
standard interaction events, and canonical completion handling. The curated
path could recommend it after Quiz, but the student and front-door flows still
rendered it as a preview.

## Decision

Mount `TrueFalsePracticeGame` in the student and front-door flows when the
active mode is `true-false`. The launch surface selects and gates the mode; the
wrapper owns round interaction and scoring; the parent collects evidence and
applies the shared completion gate. Remaining unpromoted modes stay explicit
previews.

## Consequences

- The early curated path now includes canonical assessment coverage for both
  multiple-choice and binary selection.
- Target-language activity remains authoritative; support language cannot
  unlock or award progress.
- Audio prompts, visible card text, and answer choices remain supported and
  auditable.
- No Z.ai/Phaser source is imported or activated.

## Verification

- Canonical integration verification requires True or False in both launch
  flows.
- Web typecheck, production webpack build, and all active route checks pass.
