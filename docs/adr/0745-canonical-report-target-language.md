# ADR 0745: Canonical Report Target-Language Evidence

## Status

Accepted

## Context

Playable game completion already enforced the tenant or unit target language,
but teacher report evidence could replay a canonical game without receiving
that language context. A report could therefore appear valid even when its
learner-facing audio evidence used an assist language.

## Decision

Canonical report evidence accepts an optional expected target language and
passes it to the shared game-event validator. Tenant-aware teacher session
monitors resolve and provide the tenant target language first, then the unit
textbook language, with the platform baseline as a final fallback. Legacy
review-only callers may omit the language when no unit context exists.

## Consequences

Teacher reports cannot treat assist-language audio as target-language learning
evidence when tenant context is available. The shared rule remains compatible
with older review fixtures while keeping student, teacher, and white-label
tenant paths aligned.

## Verification

Run `npm run verify:canonical-games`, `node scripts/verify-runtime-behavior.mjs`,
workspace typecheck, production build, and the active route verifier.
