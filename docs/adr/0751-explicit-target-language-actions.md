# ADR 0751: Explicit Target-Language Audio Actions

## Status

Accepted

## Context

The shared audio action component previously supplied English when a caller
omitted its language. That made it possible for a learner-facing submit,
unlock, training, media, or progress action to speak English even when the
unit's target language was Japanese or another tenant-configured language.

## Decision

Make `audioLanguage` required on `AudioSupportedAction`. Each learner-facing
caller must pass the resolved target language from its unit or tenant
boundary. Canonical game verification also checks that canonical wrappers
bind audio-supported actions to `targetLanguage`.

## Consequences

Audio language becomes an explicit integration responsibility instead of an
implicit component default. This improves white-label language correctness
and makes missing handoffs fail at typecheck time. English remains available
through the explicit target-language resolver baseline. No unlock, scoring,
persistence, reporting, assignment, reward, or Phaser source-promotion
behavior changes.

## Verification

Run `npm run verify:canonical-games`, workspace typecheck, production build,
and the full foundation verification suite.
