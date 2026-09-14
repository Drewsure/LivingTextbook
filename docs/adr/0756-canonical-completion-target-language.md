# ADR 0756: Canonical Completion Target Language

## Status

Accepted

## Context

The canonical completion gate already validates event identity, replay
evidence, scoring, and target-language audio. Its TypeScript input still made
`targetLanguage` optional, which allowed a future caller to bypass the
language contract without an obvious compile-time failure.

## Decision

Require a non-empty resolved `targetLanguage` in
`CanonicalGameCompletionGateArgs`. Student launch, front-door, and playable
route callers remain responsible for resolving tenant-first language before
they mount or complete a game. Static canonical verification must guard the
required input.

## Consequences

Future canonical game integrations cannot omit target-language completion
evidence accidentally. The change does not grant progression, mastery, Star
Dust, persistence, reporting, assignment, reward, or Phaser source-promotion
authority.

## Verification

Run `npm run verify:canonical-games`, the web typecheck, and the full
foundation suite.
