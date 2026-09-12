# DR-718: Canonical Game Launch Identity

**Date:** 2026-09-13  
**Status:** Accepted  
**Area:** Canonical game integration / session integrity

## Decision

Canonical game evidence must preserve `unitKey`, `launchCode`, and
`studentSessionId` from the launch session. The shared completion validator
checks these values on every event before the completion surface accepts the
stream.

## Consequences

- A valid game result cannot be attached to a different unit or learner session.
- The rule remains compatible with local review evidence and future hosted or
  packaged persistence.
- New canonical modes must use the shared progression adapter and route shell.
- No live classroom, report export, or Phaser promotion is enabled by this
  decision.
