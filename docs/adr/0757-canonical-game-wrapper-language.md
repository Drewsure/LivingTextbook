# ADR 0757: Canonical Game Wrapper Language

## Status

Accepted

## Context

The canonical route and orchestration layers already resolve target language
before mounting the game wrappers. The wrapper prop contracts still marked
that value optional, leaving a future integration path able to omit learner
language context without an obvious type or verification failure.

## Decision

Require `targetLanguage: string` in every active canonical game wrapper. Keep
tenant-first resolution at the route/orchestration boundary and require the
wrapper to pass the value through all learner audio and completion paths.

## Consequences

Canonical game integrations cannot silently drop white-label target-language
context. This does not grant progression, mastery, persistence, reporting,
assignment, reward, or Phaser source-promotion authority.

## Verification

Run `npm run verify:canonical-games`, the web typecheck, and the full
foundation suite.
