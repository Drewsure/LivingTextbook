# ADR 1096: AI Service Runtime Regression

## Status

Accepted.

## Decision

The AI authoring service must have executable runtime verification in addition
to static contract checks and TypeScript typechecking. The runtime harness
must exercise the actual service boundary against valid, malformed, and
policy-invalid requests.

The regression covers the canonical 8-12 vocabulary rule, exactly two target
sentence structures, duplicate-term rejection, target/support language
separation, support-language progression blocking, evidence identifiers,
target-language audio, media rights, cost/teacher review warnings, and the
no-provider-dispatch result.

## Rationale

The AI service is optional and premium, but it sits close to source intake and
student-facing content. A static marker check cannot prove that malformed JSON
or policy-invalid requests are rejected by the implementation that will later
sit behind a hosted or local adapter.

## Guardrails

- The runtime harness never calls a model, provider, billing system, storage
  adapter, verifier, route writer, playlist writer, or assignment service.
- Review-only status and `providerDispatchAllowed: false` remain mandatory.
- Target-language content remains the only progression authority.
- The service stays independent of web routes, learner state, and Phaser/game
  view code.

See `scripts/verify-ai-service-runtime.mjs` and
`apps/ai-service/src/index.ts`.
