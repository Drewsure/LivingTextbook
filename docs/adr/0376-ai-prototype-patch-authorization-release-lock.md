# ADR 0376: AI Prototype Patch Authorization Release Lock

## Status

Accepted.

## Context

The generator route now shows signed approval preflight records. A visible approval preflight is still not enough to permit app file work. The platform needs a final release-control lock that makes patch authorization impossible until signed approval acceptance, release-control binding, file scope, test evidence, route safety, rollback, storage, and reviewer identity evidence are accepted.

## Decision

Add review-only AI prototype patch authorization release locks to tenant generator routes after signed approval preflights.

The lock names required release locks, narrow authorization scope, forbidden-until-unlocked conditions, release evidence, blocked actions, and next required records.

## Consequences

- Future patch authorization has a visible release-control checkpoint before implementation.
- No patch authorization, app file write, patch generation, test execution, Playwright run, route mutation, scoring/reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress exists.
- MiniStar release locks preserve hiragana-only Japanese support and support-only progression while English remains the trigger.
