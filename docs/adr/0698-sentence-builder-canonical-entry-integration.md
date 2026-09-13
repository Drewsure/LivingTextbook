# ADR 0698: Sentence Builder Canonical Entry Integration

## Status

Accepted

## Context

Sentence Builder was already a reviewed text-spelling activity with
target-language sentence and word-tile audio, instruction and feedback
support, replay controls, deterministic ordered-token scoring, replay
evidence, standard interaction events, and canonical completion handling. The
curated path could recommend it, but the student and front-door flows still
rendered it as a preview. Its existing implementation also labeled each tile
selection as `round_shown`, which weakened event semantics.

## Decision

Mount `SentenceBuilderPracticeGame` in the student and front-door flows when
the active mode is `sentence-builder`. Emit `round_shown` when a round is
displayed; tile selection remains interaction evidence. The wrapper owns the
ordered-token round and scoring; the parent collects events and applies the
shared identity and completion gate. The current canonical fixture supports
English token normalization only. Japanese script-aware segmentation requires
a separate reviewed implementation before promotion.

## Consequences

- The curated path now includes canonical sentence construction.
- Target-language listening and syntax activity remain authoritative; support
  language cannot unlock or award progress.
- Event evidence better distinguishes display, selection, answer, and mastery
  boundaries.
- White-label tenants must declare compatible target-language script behavior.
- No Z.ai/Phaser source is imported or activated.

## Verification

- Canonical integration verification requires Sentence Builder in both launch
  flows and checks all promoted wrappers on both surfaces.
- Web typecheck, production webpack build, and all active route checks pass.
