# ADR 0693: Quiz Canonical Entry Integration

## Status

Accepted

## Context

Quiz was already a reviewed standalone selection activity with target-language
audio, deterministic scoring, replay evidence, standard interaction events,
and canonical completion handling. The curated path could recommend Quiz after
Balloon Pop, but the student and front-door flows still rendered it as a
preview.

## Decision

Mount `QuizPracticeGame` in the student and front-door flows when the active
mode is `quiz`. The launch surface selects and gates the mode; the wrapper owns
round interaction and scoring; the parent collects evidence and applies the
shared completion gate. Remaining unpromoted modes stay explicit previews.

## Consequences

- The early curated path now includes a canonical assessment slice after the
  pairing and arcade activities.
- Quiz answers remain target-language-led and deterministic; support language
  cannot unlock or award progress.
- Shared audio and replay evidence remain required for accepted completion.
- No Z.ai/Phaser source is imported or activated.

## Verification

- Canonical integration verification requires Quiz in both launch flows.
- Web typecheck, production webpack build, and all active route checks pass.
