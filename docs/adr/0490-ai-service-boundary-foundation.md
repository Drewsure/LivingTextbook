# ADR-0490: AI Service Boundary Foundation

Status: Accepted

## Decision

Promote `apps/ai-service` from a placeholder into a provider-neutral, review-only contract boundary for structured AI generation requests.

## Required contract

The service validates tenant and source review state, target language, game mode, parent engine, 8-12 vocabulary terms, exactly two target sentence structures, target-language audio readiness, media rights, teacher approval, and premium cost policy.

## Guardrails

- No provider model call or billing.
- No upload, generated package, verifier, route, playlist, or assignment write.
- No support-language progression.
- No provider SDK, storage vendor, web-route, student-state, or game-view dependency.
- Hosted and local adapters must remain replaceable and consume the same request/result contract.

## Verification

Run `npm run typecheck --workspace @living-textbook/ai-service` and `node scripts/verify-ai-service-boundary.mjs`.
