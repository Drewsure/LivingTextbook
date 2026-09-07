# ADR-0503: Feature Entitlement Runtime Boundary

Status: Accepted

## Decision

Add a provider-neutral feature entitlement request/result contract and review-only adapter in the shared content model.

## Required checks

The runtime validates tenant/package/feature scope, requested state, package tier, teacher approval, school policy, privacy policy, cost policy, persistence, release, allowed levels, usage limits, and target-language audio readiness.

## Guardrails

- AI Tutor requires premium or enterprise entitlement and remains optional.
- Microphone practice remains teacher/school and privacy/cost gated.
- Review-only execution always returns `sideEffect: "none"` and blocks activation, billing, recording, AI dispatch, student unlocks, persistence, and release mutation.

## Verification

Run `npm run verify:entitlement-runtime`, `npm run verify:foundation-composition`, typechecks, production build, and full foundation verification.
