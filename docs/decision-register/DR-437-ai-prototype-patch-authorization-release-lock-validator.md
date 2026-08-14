# DR-437: AI Prototype Patch Authorization Release Lock Validator

## Status

Accepted.

## Context

Signed approval preflight previews are not enough to permit patch work. The platform needs a separate release-control lock that keeps authorization blocked until signed approval acceptance, release-control binding, route safety, rollback, storage, reviewer identity, and test evidence are accepted.

## Decision

Add a shared `validateAiPrototypePatchAuthorizationReleaseLock` guard in the content model and require the teacher generator route to show its active guard, guard blocks, and guard warnings.

The guard requires release locks, specific authorization scope, forbidden-until-unlocked blockers, release evidence, next required records, no patch authorization, and support-language boundaries.

## Consequences

- Release-control review is visible without authorizing patch work.
- No patch authorization, app file write, patch generation, test execution, Playwright run, route mutation, student-facing route, scoring or reward mutation, audio manifest mutation, package promotion, assignment, or support-language progress trigger is enabled.
- MiniStar Foundation Japanese support remains hiragana-only and support-only while English remains the progress trigger.
