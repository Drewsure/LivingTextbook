# ADR-0631: AI Review Formatter Strict Flags

Status: Accepted

## Decision

AI-service review warnings must interpret assist-language and approval fields with
strict runtime checks after request validation.

## Required behavior

- Missing or malformed assist-language values are treated as absent support configuration.
- Teacher approval and premium-cost approval are considered ready only when their values
  are actual booleans equal to `true`.
- Direct malformed callers cannot receive misleading approval or cost-readiness warnings.

## Guardrails

This remains a review-only formatter. It does not dispatch a provider, bill a model,
write a package, submit a verifier, activate routes, or enable Z.ai/game integration.

## Verification

Run `npm run verify:ai-service`, `npm run typecheck:ai-service`,
`npm run verify:runtime-behavior`, and `npm run verify:foundation`.
