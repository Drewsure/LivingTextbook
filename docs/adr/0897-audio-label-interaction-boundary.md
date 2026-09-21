# ADR 0897: Audio Label Interaction Boundary

## Status

Accepted

## Decision

Clickable learning-audio controls must not be nested inside native form
labels. When a prompt needs tap-to-speak behavior, the prompt receives its own
stable text container and the input references it with `aria-labelledby`.

## Consequences

- Keyboard and assistive-technology behavior remains predictable for text
  entry games.
- Learners retain tap-to-speak instructions without making the audio button a
  part of the input label activation path.
- The input and audio control remain separate interaction owners; neither can
  submit, score, or advance a round by itself.

## Verification

Run `npm run verify:canonical-games`, web typecheck, and the production build.
