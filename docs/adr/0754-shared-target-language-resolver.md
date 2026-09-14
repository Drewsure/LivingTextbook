# ADR 0754: Shared Target-Language Resolver

## Status

Accepted

## Context

Tenant language, unit language, and the platform baseline were being resolved
in several route, game, media, printable, and teacher-report surfaces. Those
chains were equivalent today but created a white-label risk: a future tenant
could receive different learner audio or evidence language depending on the
surface that mounted first.

## Decision

Make `resolveTargetLanguage` in the content model the only shared precedence
rule. It selects tenant target language first, unit language second, and an
explicit English baseline last. Canonical games and platform surfaces must
pass their boundary values into this resolver rather than duplicating the
fallback chain.

## Consequences

Language behavior is consistent across white-label tenants and easier to
verify statically. Support-language behavior remains separate and cannot
unlock target-language progression. MiniStar-specific language choices remain
tenant configuration. No progression, unlock, scoring, persistence,
reporting, assignment, reward, or Phaser source-promotion behavior changes.

## Verification

Run `npm run verify:target-language`,
`npm run verify:canonical-games`, the web typecheck, and the full foundation
suite.
