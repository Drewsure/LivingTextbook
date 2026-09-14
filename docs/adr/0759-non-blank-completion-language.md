# ADR 0759: Non-Blank Completion Language

## Status

Accepted

## Context

Canonical completion now requires a target-language value in its TypeScript
input, but runtime data can still arrive through JavaScript or serialized
boundaries. An empty string would otherwise disable expected-language matching
while allowing completion validation to continue.

## Decision

Reject missing or blank target language in the canonical completion gate before
event replay validation. Keep the existing event, scoring, identity, and
replay checks unchanged after the language boundary passes.

## Consequences

Invalid language context fails closed and cannot be mistaken for valid
completion evidence. The guard does not grant progression, mastery, Star Dust,
persistence, reporting, assignment, rewards, or Phaser source-promotion
authority.

## Verification

Run `npm run verify:canonical-games`, the web typecheck, and the full
foundation suite.
