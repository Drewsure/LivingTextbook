# ADR 0692: Balloon Pop Canonical Entry Integration

## Status

Accepted

## Context

Balloon Pop already had a reviewed standalone wrapper with deterministic
selection scoring, target-language audio evidence, replay metadata, standard
interaction events, and canonical completion handling. The student and
front-door flows still showed it as a preview, even though the curated path
could recommend it after the first pairing activities.

## Decision

Mount `BalloonPopPracticeGame` in the student and front-door flows when the
active mode is `balloon-pop`. The shared launch surface owns only selection;
the wrapper owns game events and scoring, while the parent owns event collection
and canonical completion validation. All remaining unpromoted modes stay
explicit previews.

## Consequences

- The curated path now has a canonical selection/arcade slice after the
  pairing activities.
- Balloon Pop remains deterministic and target-language-led; support language
  cannot unlock or award progress.
- Audio prompts and feedback remain part of the accepted game evidence.
- No Z.ai/Phaser source is imported or activated by this decision.

## Verification

- Canonical integration verification requires Balloon Pop in both launch flows.
- Web typecheck, production webpack build, and all active route checks pass.
