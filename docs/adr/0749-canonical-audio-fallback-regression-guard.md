# ADR 0749: Canonical Audio Fallback Regression Guard

## Status

Accepted

## Context

The Match Up review exposed a class of localization defect in which a game
wrapper could use English as the fallback language for a visible audio
control, even though the route had already resolved a tenant/unit target
language. A one-off check would protect only the wrapper already fixed.

## Decision

The canonical game integration verifier rejects learner-facing language
expressions that use English as an inline fallback. The platform baseline
English fallback remains allowed at the explicit target-language resolver
boundary, where tenant settings and unit metadata are resolved.

## Consequences

Future canonical wrappers receive the same protection automatically. A new
wrapper must make its target-language handoff explicit before it can pass the
canonical integration gate. This is a verification boundary only; it does not
change scoring, persistence, routes, or source-promotion authority.

## Verification

Run `npm run verify:canonical-games`, `npm run verify:foundation-composition`,
workspace typecheck, production build, and the active route verifier.
