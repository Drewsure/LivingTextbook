# ADR 0750: Shared Route-Surface Audio

## Status

Accepted

## Context

Canonical game wrappers already receive a resolved target language, but the
shared route shell also renders learner-facing access and next-activity
summaries. Those cards previously relied on the audio component's default
English language, which could split the route experience from the game
experience for a non-English tenant.

## Decision

The playable route shell passes its resolved target language into both shared
learner cards. Their tap-to-speak controls use that language explicitly, and
canonical integration verification guards the handoff.

## Consequences

Entry gates, game interactions, completion summaries, and recommended next
steps now share one target-language boundary. This is a presentation and
verification improvement only; it does not authorize route unlocking,
progression, persistence, reporting, or Phaser source promotion.

## Verification

Run `npm run verify:canonical-games`, workspace typecheck, production build,
and the active route verifier.
