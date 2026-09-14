# ADR 0752: Learner Route-Guidance Audio

## Status

Accepted

## Context

The explicit audio-language requirement covered game actions and shared
progress surfaces, but recommended routes, activity-hub summaries, recovery
recommendations, and media playlist controls could still omit the tenant/unit
language. That would make the learner's navigation voice inconsistent with
the game voice, particularly for Japanese or future white-label tenants.

## Decision

Pass the resolved target language through learner route-guidance and media
preview components. Tap-to-speak route summaries, recovery notices, and media
controls must use that language explicitly. These surfaces remain support and
guidance only; they do not create progression evidence.

## Consequences

Learner-facing spoken guidance now follows the same language boundary across
the unit journey. The route and media contracts carry one additional explicit
field, while support-language controls remain separate. No unlock, scoring,
persistence, reporting, assignment, reward, or Phaser source-promotion
behavior changes.

## Verification

Run workspace typecheck, `npm run verify:canonical-games`, and the active route
verifier. The full foundation suite remains the release gate.
