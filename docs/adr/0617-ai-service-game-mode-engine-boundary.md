# ADR-0617: AI-Service Game-Mode And Engine Boundary

Status: Accepted

## Decision

The provider-neutral AI service must validate game mode, parent engine, and
level compatibility using the shared content-model game catalog before a
generation request can enter review preparation.

## Required behavior

- Unsupported game modes and parent engines are validation errors.
- A game mode must use its catalogued parent engine.
- A game mode must be available for the requested curriculum level.
- If configured, assist language must differ from the target language and is
  never a scoring, mastery, or progression authority.
- Readiness booleans must remain linked to explicit tenant-scoped evidence
  identifiers for source review, activity compatibility, target-language audio,
  media rights, and premium AI cost policy.
- Audio readiness must identify a language matching the request target language.
- Support-language policy must explicitly declare `progressionAllowed: false`.
- The AI service must reuse the shared catalog rather than maintaining a
  provider-specific compatibility table.

## Guardrails

This is a validation-only boundary. It does not call a provider, write a
package, submit a verifier result, activate a route, or enable Z.ai/game
integration. The request remains review-only and target-language progression
remains authoritative.

## Verification

Run `npm run verify:ai-service` and
`npm run typecheck --workspace @living-textbook/ai-service`.
