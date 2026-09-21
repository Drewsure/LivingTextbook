# ADR 0895: Audio Status Accessibility

## Status

Accepted

## Decision

The shared audio controls must expose playback state through an associated
polite status region. Reviewed media playback and browser speech fallback keep
the same status contract; the status layer does not create a second audio or
progression path.

## Consequences

- Screen-reader users receive ready, playing, and unavailable feedback.
- The behavior is inherited by games, instructions, terms, sentences, and
  teacher-facing audio previews that use the shared controls.
- `useId` keeps the relationship stable across server and client rendering.
- Audio status remains informational and cannot award progress or rewards.

## Verification

Run `npm run verify:audio-accessibility`, web typecheck, and the production
build.
